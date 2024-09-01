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


// Check if the reading date is Saturday or Sunday
$dayOfWeek = date('N', strtotime($reading_date));

// $currentDay = date('j');

// // Check if the current date falls within the specified range (25th to 5th)
// if ($currentDay < 25 || $currentDay > 5) {
//     echo json_encode(["error" => "Billing can only occur between the 25th and 5th of the month."]);
//     exit; // Stop further execution
// }

$date_added = date("Y-m-d");
$employee_Id = $_POST['readerId'];
$login_statusId = 2;

$due_date = date('Y-m-d', strtotime($reading_date . ' +20 days'));


try {
    $sqlSelect = "SELECT * FROM billing WHERE consumerId = :consumerId ";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
    $stmtSelect->execute();

    $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if ($row) {

    $sqlcheck = "SELECT * FROM billing WHERE consumerId = :consumerId AND present_meter >= :cubic_consumed ORDER BY billing_id DESC LIMIT 1";
    $stmtCheck = $conn->prepare($sqlcheck);
    $stmtCheck->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
    $stmtCheck->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_STR);
    $stmtCheck->execute();
    $rowCheck = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if ($rowCheck && $rowCheck['present_meter'] > $cubic_consumed) {
        echo json_encode(["error" => "Error: present_meter is greater than cubic_consumed", "errorCode" => 123]);
        exit;
    }

    // Fetch property rates
    $sqlSelectRate = "SELECT minimum_rate, second_rate, third_rate, last_rate FROM property_rate WHERE property_Id = :propertyId ORDER BY rate_id DESC LIMIT 1";
    $stmtSelectRate = $conn->prepare($sqlSelectRate);
    $stmtSelectRate->bindParam(':propertyId', $propertyId, PDO::PARAM_INT);
    $stmtSelectRate->execute();
    $rowRate = $stmtSelectRate->fetch(PDO::FETCH_ASSOC);

    if ($rowRate) {
        $minimum_rate = $rowRate['minimum_rate'];
        $second_rate = $rowRate['second_rate'];
        $third_rate = $rowRate['third_rate'];
        $last_rate = $rowRate['last_rate'];

        // Calculate billing amount
        $sql = "SELECT present_meter FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":consumerId", $consumerId);
        $stmt->execute();
        
        $old_present_meter = $stmt->fetchColumn();
        $previous_meter = ($old_present_meter !== false) ? $old_present_meter : 0;

        $current_bill_amount = $cubic_consumed - $previous_meter;
        $bill_amount = 0;

        if ($current_bill_amount > 0) {
            if ($current_bill_amount <= 10) {
                $bill_amount = $current_bill_amount * $minimum_rate;
            } elseif ($current_bill_amount <= 20) {
                $bill_amount = (10 * $minimum_rate) + (($current_bill_amount - 10) * $second_rate);
            } elseif ($current_bill_amount <= 30) {
                $bill_amount = (10 * $minimum_rate) + (10 * $second_rate) + (($current_bill_amount - 20) * $third_rate);
            } else {
                $bill_amount = (10 * $minimum_rate) + (10 * $second_rate) + (10 * $third_rate) + (($current_bill_amount - 30) * $last_rate);
            }
        }

        // Fetch past billing details
        $sql = "SELECT cubic_consumed FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":consumerId", $consumerId);
        $stmt->execute();
        $past_cubic_consumed = $stmt->fetchColumn();

        $sql = "SELECT total_bill FROM billing WHERE consumerId = :consumerId AND billing_statusId = 2 ORDER BY billing_id DESC LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":consumerId", $consumerId);
        $stmt->execute();
        $past_total_bills = $stmt->fetchColumn();
        $past_total_bill = $past_total_bills !== false ? $past_total_bills : 0;
        $arrears = $past_total_bill;
        $new_total = $bill_amount + $past_total_bill;

        // Update user_consumer
        $statusId = 1;
        $sqlUpdates = "UPDATE user_consumer SET billing_status = :statusId, total_cubic_consumed = :cubic_consumed WHERE user_id = :consumerId";
        $stmtUpdates = $conn->prepare($sqlUpdates);
        $stmtUpdates->bindParam(':statusId', $statusId, PDO::PARAM_INT);
        $stmtUpdates->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
        $stmtUpdates->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_INT);
        $stmtUpdates->execute();

        // Update previous billing status
        $sqlUpdate = "UPDATE billing SET billing_statusId = :statusId WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bindParam(':statusId', $statusId, PDO::PARAM_INT);
        $stmtUpdate->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
        $stmtUpdate->execute();

        // Insert new billing record
        $updatedStatusId = 2;
        $paid_unpaid = 2;
        $sql = "INSERT INTO billing (consumerId, readerId, branchId, prev_cubic_consumed, cubic_consumed, reading_date, due_date, period_cover, previous_meter, present_meter, bill_amount, arrears, total_bill, billing_statusId, billing_update_statusId) VALUES (:consumerId, :readerId, :branchId, :prev_cubic_consumed, :cubic_consumed, :reading_date, :due_date, :period_cover, :previous_meter, :present_meter, :bill_amount, :arrears, :total_bill, :updatedStatusId, :paid_unpaid)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":consumerId", $consumerId);
        $stmt->bindParam(":readerId", $readerId);
        $stmt->bindParam(":branchId", $branchId);
        $stmt->bindParam(":prev_cubic_consumed", $past_cubic_consumed);
        $stmt->bindParam(":cubic_consumed", $current_bill_amount);
        $stmt->bindParam(":reading_date", $reading_date);
        $stmt->bindParam(":due_date", $due_date);
        $stmt->bindParam(":period_cover", $period_cover);
        $stmt->bindParam(":previous_meter", $previous_meter);
        $stmt->bindParam(":present_meter", $cubic_consumed);
        $stmt->bindParam(":bill_amount", $bill_amount);
        $stmt->bindParam(":arrears", $arrears);
        $stmt->bindParam(":total_bill", $new_total);
        $stmt->bindParam(":updatedStatusId", $updatedStatusId);
        $stmt->bindParam(":paid_unpaid", $paid_unpaid);
        $stmt->execute();

        // Log activity
        $activity_type = "Add";
        $table_name = "Billing";
        $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) VALUES (:activity_type, :table_name, :date_added, :employee_Id)";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
        $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
        $stmt1->bindParam(":date_added", $date_added);
        $stmt1->bindParam(":employee_Id", $readerId, PDO::PARAM_INT);
        $stmt1->execute();

        $conn->commit();
        echo json_encode(["message" => "Successfully Billed"]);
    } else {
        echo json_encode(["error" => "Error: Unable to fetch property rates."]);
        $conn->rollBack();
    }
        
    } else {
       // Handle case where there's no existing billing record for the consumer
    echo "No billing yet but have New Bill";

    $conn->beginTransaction();

    $sqlSelectRate = "SELECT minimum_rate, second_rate, third_rate, last_rate FROM property_rate WHERE property_Id = :propertyId ORDER BY rate_id DESC LIMIT 1";
    $stmtSelectRate = $conn->prepare($sqlSelectRate);
    $stmtSelectRate->bindParam(':propertyId', $_POST['propertyId'], PDO::PARAM_INT);
    $stmtSelectRate->execute();
    
    $rowRate = $stmtSelectRate->fetch(PDO::FETCH_ASSOC);

    if ($rowRate) {
        $minimum_rate = $rowRate['minimum_rate'];
        $second_rate = $rowRate['second_rate'];
        $third_rate = $rowRate['third_rate'];
        $last_rate = $rowRate['last_rate'];

        $current_bill_amount = $cubic_consumed;
        $bill_amount = 0;

        if ($current_bill_amount > 0) {
            if ($current_bill_amount <= 10) {
                $bill_amount = $current_bill_amount * $minimum_rate;
            } elseif ($current_bill_amount <= 20) {
                $bill_amount = (10 * $minimum_rate) + (($current_bill_amount - 10) * $second_rate);
            } elseif ($current_bill_amount <= 30) {
                $bill_amount = (10 * $minimum_rate) + (10 * $second_rate) + (($current_bill_amount - 20) * $third_rate);
            } else {
                $bill_amount = (10 * $minimum_rate) + (10 * $second_rate) + (10 * $third_rate) + (($current_bill_amount - 30) * $last_rate);
            }
        }

        $previous_meter = 0;
        $past_total_bill = 0;
        $arrears = 0;
        $new_total = $bill_amount;

        $sqlUpdates = "UPDATE user_consumer SET billing_status = :statusId , total_cubic_consumed = :cubic_consumed WHERE user_id = :consumerId ";
        $stmtUpdates = $conn->prepare($sqlUpdates);
        $stmtUpdates->bindParam(':statusId', $statusId, PDO::PARAM_INT);
        $stmtUpdates->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
        $stmtUpdates->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_INT);
        
        if ($stmtUpdates->execute()) {
            $sql = "INSERT INTO billing (consumerId, readerId, branchId, prev_cubic_consumed, cubic_consumed, reading_date, due_date, period_cover, previous_meter, present_meter, bill_amount, arrears, total_bill, billing_statusId, billing_update_statusId) VALUES (:consumerId, :readerId, :branchId, :prev_cubic_consumed, :cubic_consumed, :reading_date, :due_date, :period_cover, :previous_meter, :cubic_consumed, :bill_amount, :arrears, :total_bill, :updatedStatusId, :paid_unpaid)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":consumerId", $consumerId);
            $stmt->bindParam(":readerId", $readerId);
            $stmt->bindParam(":branchId", $branchId);
            $stmt->bindParam(":prev_cubic_consumed", $prev_cubic_consumed);
            $stmt->bindParam(":cubic_consumed", $cubic_consumed);
            $stmt->bindParam(":reading_date", $reading_date);
            $stmt->bindParam(":due_date", $due_date);
            $stmt->bindParam(":period_cover", $period_cover);
            $stmt->bindParam(":previous_meter", $previous_meter);
            $stmt->bindParam(":bill_amount", $bill_amount);
            $stmt->bindParam(":arrears", $arrears);
            $stmt->bindParam(":total_bill", $new_total);
            $stmt->bindParam(":updatedStatusId", $updatedStatusId);
            $stmt->bindParam(":paid_unpaid", $paid_unpaid);

            $returnValue = 0;
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $activity_type = "Add";
                $table_name = "Billing";
                $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
                $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

                $stmt1 = $conn->prepare($sql1);
                $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
                $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
                $stmt1->bindParam(":date_added", $date_added);
                $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
                $stmt1->execute();

                $returnValue = "Successfully Billed";
            } else {
                echo "Error updating data: " . $stmt1->errorInfo()[2];
            }
        } else {
            echo "Error updating data: " . $stmtUpdates->errorInfo()[2];
        }

        $conn->commit();

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
