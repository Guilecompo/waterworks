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

// Check if the reading date is Saturday or Sunday
$dayOfWeek = date('N', strtotime($reading_date));
if ($dayOfWeek >= 6) {
    echo json_encode(["error" => "No work on weekends!"]);
    exit; // Stop further execution
}

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
            // Set a specific error code
            $errorCode = 123; // You can use any value other than 0
        
            echo json_encode(["error" => "Error: present_meter is greater than cubic_consumed", "errorCode" => $errorCode]);
        }else {
            $conn->beginTransaction();

            // Fetch property rates
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

                // Calculate bill amount based on cubic_consumed
                $sql = "SELECT present_meter FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
                $stmts = $conn->prepare($sql);
                $stmts->bindParam(":consumerId", $consumerId);
                $stmts->execute();

                $old_present_meter = $stmts->fetchColumn();
                $previous_meter = ($old_present_meter !== false) ? $old_present_meter : 0;

                $current_bill_amount = $cubic_consumed - $previous_meter;
                // Initialize bill_amount with the minimum rate
                $bill_amounts = $minimum_rate;

                $additional_units = $current_bill_amount;

                for ($i = 1; $i <= $additional_units; $i++) {
                    if ($i >= 1 && $i <= 10) {
                        $bill_amount = $bill_amounts ;
                    } elseif ($i >= 11 && $i <= 20) {
                        $new = $i - 10;
                        $bill_amount = $bill_amounts + ($second_rate * $new);
                    } elseif ($i > 20 && $i <= 30) {
                        $new = $i - 20;
                        $bill_amount = $bill_amounts + ($third_rate * $new);
                    } elseif ($i > 30) {
                        $new = $i - 30;
                        $bill_amount = $bill_amounts + ($last_rate * $new);
                    }
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
                $past_total_bill = ($past_total_bills !== false) ? $past_total_bills : 0;


                $arrears = 0 + $past_total_bill;

                $new_total = $bill_amount + $past_total_bill;
                
                

                $statusId = 1;

                $sqlUpdates = "UPDATE user_consumer SET billing_status = :statusId , total_cubic_consumed = :cubic_consumed WHERE user_id = :consumerId ";
                $stmtUpdates = $conn->prepare($sqlUpdates);
                $stmtUpdates->bindParam(':statusId', $statusId, PDO::PARAM_INT);
                $stmtUpdates->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
                $stmtUpdates->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_INT);

                if ($stmtUpdates->execute()) {
                    $sqlUpdate = "UPDATE billing SET billing_statusId = :statusId WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
                    $stmtUpdate = $conn->prepare($sqlUpdate);
                    $stmtUpdate->bindParam(':statusId', $statusId, PDO::PARAM_INT);
                    $stmtUpdate->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);

                    if ($stmtUpdate->execute()) {

                        $updatedStatusId = 2;
                        $paid_unpaid = 2;

                        $sql = "INSERT INTO billing (consumerId, readerId, branchId, prev_cubic_consumed, cubic_consumed, reading_date, due_date, previous_meter, present_meter, bill_amount, arrears, total_bill, billing_statusId, billing_update_statusId) VALUES (:consumerId, :readerId, :branchId, :prev_cubic_consumed, :cubic_consumed, :reading_date, :due_date, :previous_meter, :present_meter, :bill_amount, :arrears, :total_bill, :updatedStatusId, :paid_unpaid)";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(":consumerId", $consumerId);
                        $stmt->bindParam(":readerId", $readerId);
                        $stmt->bindParam(":branchId", $branchId);
                        $stmt->bindParam(":prev_cubic_consumed", $past_cubic_consumed);
                        $stmt->bindParam(":cubic_consumed", $current_bill_amount);
                        $stmt->bindParam(":reading_date", $reading_date);
                        $stmt->bindParam(":due_date", $due_date);
                        $stmt->bindParam(":previous_meter", $previous_meter);
                        $stmt->bindParam(":present_meter", $cubic_consumed);
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
                        }else {
                        echo "Error updating data: " . $stmt1->errorInfo()[2];
                        }
                        $conn->commit();

                        echo "Data inserted successfully into 'adding bill'";

                    } else {
                        echo "Error updating data: " . $stmtUpdate->errorInfo()[2];
                    }
                }else {
                    echo "Error updating data: " . $stmtUpdates->errorInfo()[2];
                }
                
            } else {
                echo "Error: Unable to fetch property rates.";
            }
        }
        
    } else {
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

            $bill_amounts = $minimum_rate;

            $additional_units = $cubic_consumed;

            for ($i = 1; $i <= $additional_units; $i++) {
                if ($i >= 1 && $i <= 10) {
                    $bill_amount = $bill_amounts ;
                } elseif ($i >= 11 && $i <= 20) {
                    $new = $i - 10;
                    $bill_amount = $bill_amounts + ($second_rate * $new);
                } elseif ($i > 20 && $i <= 30) {
                    $new = $i - 20;
                    $bill_amount = $bill_amounts + ($third_rate * $new);
                } elseif ($i > 30) {
                    $new = $i - 30;
                    $bill_amount = $bill_amounts + ($last_rate * $new);
                }
            }

            // $sql = "SELECT present_meter FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
            // $stmt = $conn->prepare($sql);
            // $stmt->bindParam(":consumerId", $consumerId);
            // $stmt->execute();

            // $old_present_meter = $stmt->fetchColumn();
            // if ($old_present_meter !== false) {
            //     $previous_meter = $old_present_meter;
            // } else {
            //     $previous_meter = 0;
            // }
            $previous_meter = 0;

            $sql = "SELECT total_bill FROM billing WHERE consumerId = :consumerId ORDER BY billing_id DESC LIMIT 1";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":consumerId", $consumerId);
            $stmt->execute();
            $past_total_bill = $stmt->fetchColumn();

            $arrears = 0 + $past_total_bill;

            $new_total = $bill_amount ;
            $new_total_bill = $new_total + $past_total_bill;

            $prev_cubic_consumed = 0;

            $updatedStatusId = 2;
            $paid_unpaid = 2;

                $statusId = 1;

                $sqlUpdates = "UPDATE user_consumer SET billing_status = :statusId , total_cubic_consumed = :cubic_consumed WHERE user_id = :consumerId ";
                $stmtUpdates = $conn->prepare($sqlUpdates);
                $stmtUpdates->bindParam(':statusId', $statusId, PDO::PARAM_INT);
                $stmtUpdates->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
                $stmtUpdates->bindParam(':cubic_consumed', $cubic_consumed, PDO::PARAM_INT);
                
                if ($stmtUpdates->execute()) {
                    $sql = "INSERT INTO billing (consumerId, readerId, branchId, prev_cubic_consumed, cubic_consumed, reading_date, due_date, previous_meter, present_meter, bill_amount, arrears, total_bill, billing_statusId, billing_update_statusId) VALUES (:consumerId, :readerId, :branchId, :prev_cubic_consumed, :cubic_consumed, :reading_date, :due_date, :previous_meter, :cubic_consumed, :bill_amount, :arrears, :total_bill, :updatedStatusId, :paid_unpaid)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(":consumerId", $consumerId);
                    $stmt->bindParam(":readerId", $readerId);
                    $stmt->bindParam(":branchId", $branchId);
                    $stmt->bindParam(":prev_cubic_consumed", $prev_cubic_consumed);
                    $stmt->bindParam(":cubic_consumed", $cubic_consumed);
                    $stmt->bindParam(":reading_date", $reading_date);
                    $stmt->bindParam(":due_date", $due_date);
                    $stmt->bindParam(":previous_meter", $previous_meter);
                    $stmt->bindParam(":bill_amount", $bill_amount);
                    $stmt->bindParam(":arrears", $arrears);
                    $stmt->bindParam(":total_bill", $new_total_bill);
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
                    }else {
                    echo "Error updating data: " . $stmt1->errorInfo()[2];
                    }
                }else {
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
