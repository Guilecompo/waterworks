<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

// Check if the necessary POST parameters are set
if (!isset($_POST['consumerId'], $_POST['propertyId'], $_POST['readerId'], $_POST['branchId'])) {
    echo json_encode(["error" => "Missing required parameters."]);
    exit;
}

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

$date_added = date("Y-m-d");
$employee_Id = $_POST['readerId'];
$login_statusId = 2;

$due_date = date('Y-m-d', strtotime($reading_date . ' +20 days'));

try {
    // Start the transaction
    $conn->beginTransaction();

    // Get the last billing_uniqueId and generate the new one
    $year = date("y");  // Last 2 digits of the year
    $month = date("m"); // Current month

    // Query to get the last billing_uniqueId
    $sql = "SELECT billing_uniqueId FROM billing WHERE billing_uniqueId LIKE :uniqueIdPattern ORDER BY billing_uniqueId DESC LIMIT 1";
    $stmt = $conn->prepare($sql);
    $uniqueIdPattern = "CWB-{$readerId}-{$year}{$month}-%";
    $stmt->bindParam(':uniqueIdPattern', $uniqueIdPattern);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // Get the last billing_uniqueId and increment
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $lastUniqueId = $row['billing_uniqueId'];
        $lastIdNumber = (int)substr($lastUniqueId, strrpos($lastUniqueId, '-') + 1);
        $newIdNumber = $lastIdNumber + 1;
        $newIdNumberString = str_pad($newIdNumber, 3, '0', STR_PAD_LEFT);
        $uniqueId = "CWB-{$readerId}-{$year}{$month}-{$newIdNumberString}";
    } else {
        // No billing records found, create the first uniqueId with 001
        $uniqueId = "CWB-{$readerId}-{$year}{$month}-001";
    }

    // Fetch discount info
    $sqlDiscount = "SELECT b.discount_percent FROM user_consumer a INNER JOIN consumer_type b ON a.consumertypeId = b.consumertype_id WHERE a.user_id = :consumerId";
    $stmtDiscount = $conn->prepare($sqlDiscount);
    $stmtDiscount->bindParam(':consumerId', $consumerId);
    $stmtDiscount->execute();
    $discount = $stmtDiscount->fetch(PDO::FETCH_ASSOC);
    $discountPercent = $discount['discount_percent'] ?? 0;
    $discountValue = $discountPercent / 100;

    // Calculate average cubic consumed from the last 3 bills
    $sumSql = "SELECT SUM(cubic_consumed) AS total_cubic FROM (SELECT cubic_consumed FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 3) AS total_cubic; ";
    $sumStmt = $conn->prepare($sumSql);
    $sumStmt->bindParam(":consumerId", $consumerId);
    $sumStmt->execute();
    $total_cubic = $sumStmt->fetchColumn();
    $total_cubic = $total_cubic / 3;

    // Get the last present_meter value
    $getSql = "SELECT present_meter FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
    $getStmt = $conn->prepare($getSql);
    $getStmt->bindParam(":consumerId", $consumerId);
    $getStmt->execute();
    $get_present_meter = $getStmt->fetchColumn();

    $cubic_consumed = $get_present_meter + $total_cubic;

    // Check if the present_meter is valid
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
        $stmts = $conn->prepare($sql);
        $stmts->bindParam(":consumerId", $consumerId);
        $stmts->execute();
        $old_present_meter = $stmts->fetchColumn();
        $previous_meter = $old_present_meter !== false ? $old_present_meter : 0;
        $current_bill_amount = $cubic_consumed - $previous_meter;
        $additional_units = $current_bill_amount;

        // Calculate total bill amount
        $bill_amount = 0;

        // Calculate total bill amount based on the cubic consumed
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

        // Apply discount
        $discounted = $bill_amount * $discountValue;
        $newTotalBillDiscount = $bill_amount - $discounted;

        $arrears = $past_total_bill;
        $newTotalBill = $newTotalBillDiscount + $past_total_bill;

        // Update user_consumer
        // $statusSql = "UPDATE user_consumer SET last_billed = :lastBilled WHERE user_id = :consumerId";
        // $statusStmt = $conn->prepare($statusSql);
        // $statusStmt->bindParam(":consumerId", $consumerId);
        // $statusStmt->bindParam(":lastBilled", $period_cover);
        // $statusStmt->execute();

        // Insert into billing table
        $billingSql = "INSERT INTO billing (consumerId, billing_uniqueId, billing_date, period_cover, billing_statusId, branchId, employeeId, total_bill, cubic_consumed, arrears, due_date) 
                    VALUES (:consumerId, :billingUniqueId, :billingDate, :periodCover, :billingStatusId, :branchId, :employeeId, :totalBill, :cubicConsumed, :arrears, :dueDate)";
        
        $stmtBilling = $conn->prepare($billingSql);
        $stmtBilling->bindParam(":consumerId", $consumerId);
        $stmtBilling->bindParam(":billingUniqueId", $uniqueId);
        $stmtBilling->bindParam(":billingDate", $reading_date);
        $stmtBilling->bindParam(":periodCover", $period_cover);
        $stmtBilling->bindParam(":billingStatusId", $login_statusId);
        $stmtBilling->bindParam(":branchId", $branchId);
        $stmtBilling->bindParam(":employeeId", $employee_Id);
        $stmtBilling->bindParam(":totalBill", $newTotalBill);
        $stmtBilling->bindParam(":cubicConsumed", $cubic_consumed);
        $stmtBilling->bindParam(":arrears", $arrears);
        $stmtBilling->bindParam(":dueDate", $due_date);
        $stmtBilling->execute();

        // Commit the transaction
        $conn->commit();

        // Log activity
        $logSql = "INSERT INTO activity_log (activity, created_at, user_id) 
                    VALUES ('Added new bill with ID {$uniqueId}', NOW(), :userId)";
        $stmtLog = $conn->prepare($logSql);
        $stmtLog->bindParam(":userId", $consumerId);
        $stmtLog->execute();

        echo json_encode(["success" => true, "message" => "Billing record successfully added.", "billingUniqueId" => $uniqueId]);
    } else {
        echo json_encode(["error" => "Failed to retrieve property rate data."]);
    }

} catch (Exception $e) {
    // Rollback if there's an error
    $conn->rollBack();
    echo json_encode(["error" => "An error occurred. Please try again later.", "exception" => $e->getMessage()]);
}
?>
