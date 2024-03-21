<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

$consumerId = $_POST['consumerId'];
$propertyId = $_POST['propertyId'];
$readerId = $_POST['readerId'];
$cubic_consumed = $_POST['cubic_consumed'];
$branchId = $_POST['branchId'];

$reading_date = date('Y-m-d H:i:s');

// Calculate period start and end dates
$today = date('Y-m-d'); // Current date
$year = date('Y', strtotime($today));
$month = date('m', strtotime($today));

// Set the start date to the 26th day of the previous month
$period_start = date('F j', strtotime(($month == 1 ? ($year - 1) : $year) . '-' . ($month == 1 ? '12' : str_pad($month - 1, 2, '0', STR_PAD_LEFT)) . '-26'));

// Set the end date to the 25th day of the current month
$period_end = date('F j, Y', strtotime($year . '-' . str_pad($month, 2, '0', STR_PAD_LEFT) . '-25'));

// Concatenate period start and end
$period_cover = $period_start . ' to ' . $period_end;

// Debug statements to output variable values
echo "Current Day: " . $today . "\n";
echo "Period Start: " . $period_start . "\n";
echo "Period End: " . $period_end . "\n";

// Check if the current date falls within the specified range (25th to 5th)
$currentDay = date('j');
if ($currentDay < 22 || $currentDay > 5) {
    echo json_encode(["error" => "Billing can only occur between the 25th and 5th of the month."]);
    exit; // Stop further execution
}

$date_added = date("Y-m-d");
$employee_Id = $_POST['readerId'];
$login_statusId = 2;

$due_date = date('Y-m-d', strtotime($reading_date . ' +20 days'));

try {
    // Check if there's a previous billing record for the consumer
    $sqlSelect = "SELECT * FROM billing WHERE consumerId = :consumerId ";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
    $stmtSelect->execute();

    $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        // If there's a previous billing record, proceed with the billing calculations

        // Check if present_meter is greater than cubic_consumed in the previous record
        $sqlCheck = "SELECT * FROM billing WHERE consumerId = :consumerId AND present_meter >= :cubic_consumed ORDER BY billing_id DESC LIMIT 1";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
        $stmtCheck->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_STR);
        $stmtCheck->execute();
        
        $rowCheck = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        if ($rowCheck && $rowCheck['present_meter'] > $cubic_consumed) {
            // Set a specific error code
            $errorCode = 123; // You can use any value other than 0
        
            echo json_encode(["error" => "Error: present_meter is greater than cubic_consumed", "errorCode" => $errorCode]);
            exit; // Stop further execution
        }

        // Fetch property rates
        $sqlSelectRate = "SELECT minimum_rate, second_rate, third_rate, last_rate FROM property_rate WHERE property_Id = :propertyId ORDER BY rate_id DESC LIMIT 1";
        $stmtSelectRate = $conn->prepare($sqlSelectRate);
        $stmtSelectRate->bindParam(':propertyId', $propertyId, PDO::PARAM_INT);
        $stmtSelectRate->execute();
        
        $rowRate = $stmtSelectRate->fetch(PDO::FETCH_ASSOC);

        if ($rowRate) {
            // Calculate bill amount based on cubic_consumed and property rates
            $minimum_rate = $rowRate['minimum_rate'];
            $second_rate = $rowRate['second_rate'];
            $third_rate = $rowRate['third_rate'];
            $last_rate = $rowRate['last_rate'];

            $current_bill_amount = $cubic_consumed - $row['present_meter'];
            $bill_amount = $minimum_rate;

            for ($i = 1; $i <= $current_bill_amount; $i++) {
                if ($i >= 1 && $i <= 10) {
                    $bill_amount += $minimum_rate;
                } elseif ($i >= 11 && $i <= 20) {
                    $bill_amount += $second_rate;
                } elseif ($i > 20 && $i <= 30) {
                    $bill_amount += $third_rate;
                } elseif ($i > 30) {
                    $bill_amount += $last_rate;
                }
            }

            // Begin transaction
            $conn->beginTransaction();

            // Update user_consumer table with new billing status and total_cubic_consumed
            $sqlUpdateConsumer = "UPDATE user_consumer SET billing_status = 1, total_cubic_consumed = :cubic_consumed WHERE user_id = :consumerId";
            $stmtUpdateConsumer = $conn->prepare($sqlUpdateConsumer);
            $stmtUpdateConsumer->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_INT);
            $stmtUpdateConsumer->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
            $stmtUpdateConsumer->execute();

            // Insert new billing record
            $sqlInsertBilling = "INSERT INTO billing (consumerId, readerId, branchId, prev_cubic_consumed, cubic_consumed, reading_date, due_date, period_cover, previous_meter, present_meter, bill_amount, arrears, total_bill, billing_statusId, billing_update_statusId) VALUES (:consumerId, :readerId, :branchId, :prev_cubic_consumed, :cubic_consumed, :reading_date, :due_date, :period_cover, :previous_meter, :cubic_consumed, :bill_amount, :arrears, :total_bill, 1, 2)";
            $stmtInsertBilling = $conn->prepare($sqlInsertBilling);
            $stmtInsertBilling->bindParam(':consumerId', $consumerId);
            $stmtInsertBilling->bindParam(':readerId', $readerId);
            $stmtInsertBilling->bindParam(':branchId', $branchId);
            $stmtInsertBilling->bindParam(':prev_cubic_consumed', $row['present_meter']);
            $stmtInsertBilling->bindParam(':cubic_consumed', $cubic_consumed);
            $stmtInsertBilling->bindParam(':reading_date',$reading_date);
            $stmtInsertBilling->bindParam(':due_date', $due_date);
            $stmtInsertBilling->bindParam(':period_cover', $period_cover);
            $stmtInsertBilling->bindParam(':previous_meter', $row['present_meter']);
            $stmtInsertBilling->bindParam(':bill_amount', $bill_amount);
            $stmtInsertBilling->bindParam(':arrears', $row['total_bill']);
            $stmtInsertBilling->bindParam(':total_bill', $row['total_bill'] + $bill_amount);
            $stmtInsertBilling->execute();

            // Log activity
            $activity_type = "Add";
            $table_name = "Billing";
            $sqlInsertLog = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) VALUES (:activity_type, :table_name, :date_added, :employee_Id)";
            $stmtInsertLog = $conn->prepare($sqlInsertLog);
            $stmtInsertLog->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmtInsertLog->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmtInsertLog->bindParam(":date_added", $date_added);
            $stmtInsertLog->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmtInsertLog->execute();

            // Commit transaction
            $conn->commit();

            echo "Successfully billed.";
        } else {
            echo "Error: Unable to fetch property rates.";
        }
    } else {
        // If there's no previous billing record, insert a new billing record

        // Fetch property rates
        $sqlSelectRate = "SELECT minimum_rate, second_rate, third_rate, last_rate FROM property_rate WHERE property_Id = :propertyId ORDER BY rate_id DESC LIMIT 1";
        $stmtSelectRate = $conn->prepare($sqlSelectRate);
        $stmtSelectRate->bindParam(':propertyId', $propertyId, PDO::PARAM_INT);
        $stmtSelectRate->execute();
        
        $rowRate = $stmtSelectRate->fetch(PDO::FETCH_ASSOC);

        if ($rowRate) {
            // Calculate bill amount based on cubic_consumed and property rates
            $minimum_rate = $rowRate['minimum_rate'];
            $second_rate = $rowRate['second_rate'];
            $third_rate = $rowRate['third_rate'];
            $last_rate = $rowRate['last_rate'];

            $bill_amount = $minimum_rate;

            for ($i = 1; $i <= $cubic_consumed; $i++) {
                if ($i >= 1 && $i <= 10) {
                    $bill_amount += $minimum_rate;
                } elseif ($i >= 11 && $i <= 20) {
                    $bill_amount += $second_rate;
                } elseif ($i > 20 && $i <= 30) {
                    $bill_amount += $third_rate;
                } elseif ($i > 30) {
                    $bill_amount += $last_rate;
                }
            }

            // Begin transaction
            $conn->beginTransaction();

            // Update user_consumer table with new billing status and total_cubic_consumed
            $sqlUpdateConsumer = "UPDATE user_consumer SET billing_status = 1, total_cubic_consumed = :cubic_consumed WHERE user_id = :consumerId";
            $stmtUpdateConsumer = $conn->prepare($sqlUpdateConsumer);
            $stmtUpdateConsumer->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_INT);
            $stmtUpdateConsumer->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
            $stmtUpdateConsumer->execute();

            // Insert new billing record
            $sqlInsertBilling = "INSERT INTO billing (consumerId, readerId, branchId, prev_cubic_consumed, cubic_consumed, reading_date, due_date, period_cover, previous_meter, present_meter, bill_amount, arrears, total_bill, billing_statusId, billing_update_statusId) VALUES (:consumerId, :readerId, :branchId, 0, :cubic_consumed, :reading_date, :due_date, :period_cover, 0, :cubic_consumed, :bill_amount, 0, :bill_amount, 1, 2)";
            $stmtInsertBilling = $conn->prepare($sqlInsertBilling);
            $stmtInsertBilling->bindParam(':consumerId', $consumerId);
            $stmtInsertBilling->bindParam(':readerId', $readerId);
            $stmtInsertBilling->bindParam(':branchId', $branchId);
            $stmtInsertBilling->bindParam(':cubic_consumed', $cubic_consumed);
            $stmtInsertBilling->bindParam(':reading_date', $reading_date);
            $stmtInsertBilling->bindParam(':due_date', $due_date);
            $stmtInsertBilling->bindParam(':period_cover', $period_cover);
            $stmtInsertBilling->bindParam(':bill_amount', $bill_amount);
            $stmtInsertBilling->execute();

            // Log activity
            $activity_type = "Add";
            $table_name = "Billing";
            $sqlInsertLog = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) VALUES (:activity_type, :table_name, :date_added, :employee_Id)";
            $stmtInsertLog = $conn->prepare($sqlInsertLog);
            $stmtInsertLog->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmtInsertLog->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmtInsertLog->bindParam(":date_added", $date_added);
            $stmtInsertLog->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmtInsertLog->execute();

            // Commit transaction
            $conn->commit();

            echo "Successfully billed.";
        } else {
            echo "Error: Unable to fetch property rates.";
        }
    }
} catch (PDOException $e) {
    $errorMessage = "Connection failed: " . $e->getMessage();
    // Echo a JSON-encoded error response
    echo json_encode(["error" => $errorMessage]);
    // You can also log the error to a file or take other appropriate actions.
}

// Close connection
$conn = null;
?>

