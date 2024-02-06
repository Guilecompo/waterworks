<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

$consumerId = $_POST['consumerId'];
$emp_Id = $_POST['emp_Id'];
$amount = $_POST['amount'];
$pay_date = date('Y-m-d H:i:s');
$branchId = $_POST['branchId'];

try {

    
    $sql = "SELECT total_bill FROM billing WHERE consumerId = :consumerId  AND billing_statusId = 2";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":consumerId", $consumerId);
    $stmt->execute();
    $past_total_bill = $stmt->fetchColumn();
    if($past_total_bill >= 1 && $amount >= 1){

        $updated_bill = $past_total_bill - $amount;
        
        $sqlSelect = "SELECT * FROM billing WHERE consumerId = :consumerId";
        $stmtSelect = $conn->prepare($sqlSelect);
        $stmtSelect->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
        $stmtSelect->execute();

        $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Insert the data into the 'changing_meter' table
            $sqlInsert = "INSERT INTO payment(pay_consumerId, pay_employeeId, billingId, pay_amount, pay_date, branchId) VALUES (:pay_consumerId, :pay_employeeId, :pay_billingId, :pay_amount, :pay_date, :pay_branchId)";
            $stmtInsert = $conn->prepare($sqlInsert);
            $stmtInsert->bindParam(':pay_consumerId', $consumerId);
            $stmtInsert->bindParam(':pay_employeeId', $emp_Id);
            $stmtInsert->bindParam(':pay_billingId', $row['billing_id']);
            $stmtInsert->bindParam(':pay_amount', $amount);
            $stmtInsert->bindParam(':pay_date', $pay_date);
            $stmtInsert->bindParam(':pay_branchId', $branchId);

            if ($stmtInsert->execute()) {
                //para update

                $sqlUpdate = "UPDATE billing SET total_bill = :updated_bill WHERE consumerId = :consumerId  AND billing_statusId = 2";
                $stmtUpdate = $conn->prepare($sqlUpdate);
                $stmtUpdate->bindParam(':updated_bill', $updated_bill, PDO::PARAM_STR);
                $stmtUpdate->execute();
                
            }else {
                echo "Error inserting data: " . $stmtInsert1->errorInfo()[2];
            }
        } else {
            echo "No data found for the specified row.";
        }
    }else{
        echo "Zero Balance";
    }
    
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

// Close connection
$conn = null;
?>
