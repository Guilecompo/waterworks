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
    $conn->beginTransaction();

    $sql = "SELECT arrears FROM billing WHERE consumerId = :consumerId AND billing_statusId = 2 ORDER BY billing_id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":consumerId", $consumerId);
    $stmt->execute();
    $past_arrears = $stmt->fetchColumn();

    $new_arrears = $past_arrears - $amount;

    $sql = "SELECT total_bill FROM billing WHERE consumerId = :consumerId AND billing_statusId = 2 ORDER BY billing_id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":consumerId", $consumerId);
    $stmt->execute();
    $past_total_bill = $stmt->fetchColumn();

    $updated_bill = $past_total_bill - $amount;

    
    
        if ($amount <= 0) {
            echo json_encode(['error' => 'Invalid Input amount']);
        } elseif ($amount > $past_total_bill) {
            echo json_encode(['error' => 'Invalid Input amount']);
        }else if($amount == $past_total_bill ){

            echo "Debug: Amount = $amount, Past Total Bill = $past_total_bill";

            // $updated_bill = $past_total_bill - $amount;
            
            $sqlSelect = "SELECT * FROM billing WHERE consumerId = :consumerId AND billing_statusId = 2";
            $stmtSelect = $conn->prepare($sqlSelect);
            $stmtSelect->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
            $stmtSelect->execute();
    
            $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);
    
            if ($row) {
                // Insert the data into the 'changing_meter' table
                $sqlInsert = "INSERT INTO payment(pay_consumerId, pay_employeeId, billingId, pay_amount, pay_balance, pay_date, branchId) 
              VALUES (:pay_consumerId, :pay_employeeId, :pay_billingId, :pay_amount, :pay_balance, :pay_date, :pay_branchId)";
                $stmtInsert = $conn->prepare($sqlInsert);

                $stmtInsert->bindParam(':pay_consumerId', $consumerId);
                $stmtInsert->bindParam(':pay_employeeId', $emp_Id);
                $stmtInsert->bindParam(':pay_billingId', $row['billing_id']);
                $stmtInsert->bindParam(':pay_amount', $amount);
                $stmtInsert->bindParam(':pay_balance', $updated_bill);
                $stmtInsert->bindParam(':pay_date', $pay_date);
                $stmtInsert->bindParam(':pay_branchId', $row['branchId']);
    
                if ($stmtInsert->execute()) {
                    //para update
                    $statusId = 1;
    
                    $sqlUpdate = "UPDATE billing SET billing_statusId = :statusId WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
                    $stmtUpdate = $conn->prepare($sqlUpdate);
                    $stmtUpdate->bindParam(':statusId', $statusId, PDO::PARAM_INT);
                    $stmtUpdate->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
                    $stmtUpdate->execute();
                    
                }else {
                    echo "Error inserting data: " . $stmtInsert1->errorInfo()[2];
                }
            } else {
                echo "No data found for the specified row.";
            }
        }else if($past_total_bill && $past_total_bill > $amount && $amount >= 1){
            // $updated_bill = $past_total_bill - $amount;
            
            $sqlSelect = "SELECT * FROM billing WHERE consumerId = :consumerId AND billing_statusId = 2";
            $stmtSelect = $conn->prepare($sqlSelect);
            $stmtSelect->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
            $stmtSelect->execute();
    
            $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);
    
            if ($row) {
                // Insert the data into the 'changing_meter' table
                $sqlInsert = "INSERT INTO payment(pay_consumerId, pay_employeeId, billingId, pay_amount, pay_balance, pay_date, branchId) VALUES (:pay_consumerId, :pay_employeeId, :pay_billingId, :pay_amount, :pay_balance, :pay_date, :pay_branchId)";
                $stmtInsert = $conn->prepare($sqlInsert);
                $stmtInsert->bindParam(':pay_consumerId', $consumerId);
                $stmtInsert->bindParam(':pay_employeeId', $emp_Id);
                $stmtInsert->bindParam(':pay_billingId', $row['billing_id']);
                $stmtInsert->bindParam(':pay_amount', $amount);
                $stmtInsert->bindParam(':pay_balance', $updated_bill);
                $stmtInsert->bindParam(':pay_date', $pay_date);
                $stmtInsert->bindParam(':pay_branchId',  $row['branchId']);
    
                if ($stmtInsert->execute()) {
                    //para update
                    $statusId = 1;
    
                    $sqlUpdate = "UPDATE billing SET billing_statusId = :statusId WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
                    $stmtUpdate = $conn->prepare($sqlUpdate);
                    $stmtUpdate->bindParam(':statusId', $statusId, PDO::PARAM_INT);
                    $stmtUpdate->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
    
                    if ($stmtUpdate->execute()) {
    
                        $sqlSelect = "SELECT * FROM billing WHERE consumerId = :consumerId AND billing_statusId = 1  ORDER BY billing_id DESC LIMIT 1";
                        $stmtSelect = $conn->prepare($sqlSelect);
                        $stmtSelect->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
                        $stmtSelect->execute();
                
                        $rows = $stmtSelect->fetch(PDO::FETCH_ASSOC);
    
                        if ($rows) {
    
                            $updatedStatusId = 2;
    
                            $sql = "INSERT INTO billing (consumerId, readerId, branchId, prev_cubic_consumed, cubic_consumed, reading_date, previous_meter, present_meter, bill_amount, arrears, penalty, total_bill, billing_statusId) VALUES (:consumerId, :readerId, :branchId, :prev_cubic_consumed, :cubic_consumed, :reading_date, :previous_meter, :present_meter, :bill_amount, :arrears, :penalty, :total_bill, :updatedStatusId)";
                            $stmt = $conn->prepare($sql);
                            $stmt->bindParam(":consumerId", $rows['consumerId']);
                            $stmt->bindParam(":readerId",  $rows['readerId']);
                            $stmt->bindParam(":branchId", $rows['branchId']);
                            $stmt->bindParam(":prev_cubic_consumed", $rows['prev_cubic_consumed']);
                            $stmt->bindParam(":cubic_consumed", $rows['cubic_consumed']);
                            $stmt->bindParam(":reading_date", $rows['reading_date']);
                            $stmt->bindParam(":previous_meter", $rows['previous_meter']);
                            $stmt->bindParam(":present_meter", $rows['present_meter']);
                            $stmt->bindParam(":bill_amount", $rows['bill_amount']);
                            $stmt->bindParam(":arrears", $new_arrears);
                            $stmt->bindParam(":penalty", $rows['penalty']);
                            $stmt->bindParam(":total_bill", $updated_bill);
                            $stmt->bindParam(":updatedStatusId", $updatedStatusId);
    
                            $stmt->execute();
                        }
                    }else {
                        echo "Error updating data: " . $stmtUpdate->errorInfo()[2];
                    }
                    
                }else {
                    echo "Error inserting data: " . $stmtInsert->errorInfo()[2];
                }
            } else {
                echo "No data found for the specified row.";
            }
            
        } else {
            echo json_encode(['error' => 'Zero Balance']);
        }
        

        $conn->commit();
} catch (PDOException $e) {
    // echo "Connection failed: " . $e->getMessage();
    $conn->rollBack();
    echo "Transaction failed: " . $e->getMessage();
}

// Close connection
$conn = null;
?>
