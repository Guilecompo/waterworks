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

$date_added = date("Y-m-d");
$employee_Id = $_POST['readerId'];
$login_statusId = 2;

$due_date = date('Y-m-d', strtotime($reading_date . ' +20 days'));

try {
    $conn->beginTransaction();

    $year = date("y");  // Last 2 digits of the year
    $month = date("m"); // Current month

    // Query to get the last billing_uniqueId
    $sql = "SELECT billing_uniqueId FROM billing WHERE billing_uniqueId LIKE :uniqueIdPattern ORDER BY billing_uniqueId DESC LIMIT 1";
    $stmt = $conn->prepare($sql);

    // Bind the parameter with the LIKE clause
    $uniqueIdPattern = "CWB-{$readerId}-{$year}{$month}-%";
    $stmt->bindParam(':uniqueIdPattern', $uniqueIdPattern);
    $stmt->execute();

    // Check if any results were returned
    if ($stmt->rowCount() > 0) {
        // Get the last billing_uniqueId
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $lastUniqueId = $row['billing_uniqueId'];

        // Extract the last number after the last hyphen
        $lastIdNumber = (int)substr($lastUniqueId, strrpos($lastUniqueId, '-') + 1);

        // Increment the last number
        $newIdNumber = $lastIdNumber + 1;

        // Convert the new number back to a string with leading zeros (ensuring it's 3 digits long)
        $newIdNumberString = str_pad($newIdNumber, 3, '0', STR_PAD_LEFT);

        // Construct the new uniqueId
        $uniqueId = "CWB-{$readerId}-{$year}{$month}-{$newIdNumberString}";
    } else {
        // No billing records found, create the first uniqueId with 001
        $uniqueId = "CWB-{$readerId}-{$year}{$month}-001";
    }

    // Fetch discount information
    $sqlDiscount = "SELECT b.discount_percent FROM user_consumer a INNER JOIN consumer_type b ON a.consumertypeId = b.consumertype_id WHERE a.user_id = :consumerId";
    $stmtDiscount = $conn->prepare($sqlDiscount);
    $stmtDiscount->bindParam(':consumerId', $consumerId);
    $stmtDiscount->execute();
    $discount = $stmtDiscount->fetch(PDO::FETCH_ASSOC);

    if (!$discount) {
        throw new Exception("Discount information not found for consumer ID {$consumerId}");
    }

    $discountPercent = $discount['discount_percent'];
    $discountValue = $discountPercent / 100;

    // Calculate total cubic consumed from last 3 bills
    $sumSql = "SELECT SUM(cubic_consumed) AS total_cubic FROM (SELECT cubic_consumed FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 3 ) AS total_cubic; ";
    $sumStmt = $conn->prepare($sumSql);
    $sumStmt->bindParam(":consumerId", $consumerId);
    $sumStmt->execute();
    $total_cubic = $sumStmt->fetchColumn();

    if ($total_cubic === false) {
        throw new Exception("Failed to retrieve cubic consumption data for consumer ID {$consumerId}");
    }

    $total_cubic = $total_cubic / 3;

    // Get the last meter reading
    $getSql = "SELECT present_meter FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
    $getStmt = $conn->prepare($getSql);
    $getStmt->bindParam(":consumerId", $consumerId);
    $getStmt->execute();
    $get_present_meter = $getStmt->fetchColumn();

    if ($get_present_meter === false) {
        throw new Exception("Failed to retrieve last present meter reading for consumer ID {$consumerId}");
    }

    $cubic_consumed = $get_present_meter + $total_cubic;

    // Check for any issues with the data
    $sqlcheck = "SELECT * FROM billing WHERE consumerId = :consumerId AND present_meter >= :cubic_consumed ORDER BY billing_id DESC LIMIT 1";
    $stmtCheck = $conn->prepare($sqlcheck);
    $stmtCheck->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
    $stmtCheck->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_STR);
    $stmtCheck->execute();
    $rowCheck = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if ($rowCheck && $rowCheck['present_meter'] > $cubic_consumed) {
        throw new Exception("Error: present_meter is greater than cubic_consumed");
    }

    // Fetch property rates
    $sqlSelectRate = "SELECT minimum_rate, second_rate, third_rate, last_rate FROM property_rate WHERE property_Id = :propertyId ORDER BY rate_id DESC LIMIT 1";
    $stmtSelectRate = $conn->prepare($sqlSelectRate);
    $stmtSelectRate->bindParam(':propertyId', $propertyId, PDO::PARAM_INT);
    $stmtSelectRate->execute();
    $rowRate = $stmtSelectRate->fetch(PDO::FETCH_ASSOC);

    if (!$rowRate) {
        throw new Exception("Error: Unable to fetch property rates for property ID {$propertyId}");
    }

    // Retrieve rates
    $minimum_rate = $rowRate['minimum_rate'];
    $second_rate = $rowRate['second_rate'];
    $third_rate = $rowRate['third_rate'];
    $last_rate = $rowRate['last_rate'];

    // Calculate billing amount based on cubic consumed
    $sql = "SELECT present_meter FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
    $stmts = $conn->prepare($sql);
    $stmts->bindParam(":consumerId", $consumerId);
    $stmts->execute();
    $old_present_meter = $stmts->fetchColumn();
    $previous_meter = $old_present_meter !== false ? $old_present_meter : 0;
    $current_bill_amount = $cubic_consumed - $previous_meter;
    $additional_units = $current_bill_amount;

    $bill_amount = 0;

    // Billing calculations based on the cubic consumed
    if ($additional_units >= 1 && $additional_units <= 10) {
        $bill_amount = $minimum_rate;
    } elseif ($additional_units >= 11 && $additional_units <= 20) {
        $new = $additional_units - 10;
        $bill_amount = $minimum_rate + ($second_rate * $new);
    } elseif ($additional_units >= 21 && $additional_units <= 30) {
        $new = $additional_units - 20;
        $bill_amount = $minimum_rate + ($second_rate * 10) + ($third_rate * $new);
    } elseif ($additional_units > 30) {
        $new = $additional_units - 30;
        $bill_amount = $minimum_rate + ($second_rate * 10) + ($third_rate * 10) + ($last_rate * $new);
    }

    // Fetch previous billing data
    $sqlPastBill = "SELECT cubic_consumed, total_bill FROM billing WHERE consumerId = :consumerId AND billing_statusId = 2 ORDER BY billing_id DESC LIMIT 1";
    $stmtPastBill = $conn->prepare($sqlPastBill);
    $stmtPastBill->bindParam(":consumerId", $consumerId);
    $stmtPastBill->execute();
    $pastData = $stmtPastBill->fetch(PDO::FETCH_ASSOC);
    
    $past_cubic_consumed = $pastData['cubic_consumed'] ?? 0;
    $past_total_bill = $pastData['total_bill'] ?? 0;

    // Apply discount
    $discounted = $bill_amount * (1 - $discountValue);

    // Insert billing information
    $insertBillSql = "INSERT INTO billing (consumerId, propertyId, readerId, billing_uniqueId, period_cover, bill_amount, discount, previous_reading, current_reading, total_bill, due_date, branchId) 
                      VALUES (:consumerId, :propertyId, :readerId, :billing_uniqueId, :period_cover, :bill_amount, :discount, :previous_reading, :current_reading, :total_bill, :due_date, :branchId)";
    
    $stmtInsertBill = $conn->prepare($insertBillSql);
    $stmtInsertBill->bindParam(':consumerId', $consumerId);
    $stmtInsertBill->bindParam(':propertyId', $propertyId);
    $stmtInsertBill->bindParam(':readerId', $readerId);
    $stmtInsertBill->bindParam(':billing_uniqueId', $uniqueId);
    $stmtInsertBill->bindParam(':period_cover', $period_cover);
    $stmtInsertBill->bindParam(':bill_amount', $bill_amount);
    $stmtInsertBill->bindParam(':discount', $discounted);
    $stmtInsertBill->bindParam(':previous_reading', $previous_meter);
    $stmtInsertBill->bindParam(':current_reading', $cubic_consumed);
    $stmtInsertBill->bindParam(':total_bill', $discounted);
    $stmtInsertBill->bindParam(':due_date', $due_date);
    $stmtInsertBill->bindParam(':branchId', $branchId);
    $stmtInsertBill->execute();

    $conn->commit();
    echo json_encode(["message" => "Successfully Billed"]);

} catch (Exception $e) {
    $errorMessage = $e->getMessage();
    error_log($errorMessage); // Log the error to a file or logging system
    $conn->rollBack(); // Rollback if any operation fails
    echo json_encode(["error" => $errorMessage]);
} catch (PDOException $e) {
    $errorMessage = "Database error: " . $e->getMessage();
    error_log($errorMessage); // Log the error to a file or logging system
    $conn->rollBack(); // Rollback if any PDO error occurs
    echo json_encode(["error" => $errorMessage]);
}

// Close connection
$conn = null;
?>
