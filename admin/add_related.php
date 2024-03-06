<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

$consumerId = $_POST['consumerId'];
$new_meter = $_POST['new_meters'];

$date_added = date("Y-m-d");
$employee_Id = $_POST['employee_Id'];
$login_statusId = 2;

$billing_status = 2;
try {

    $sqlSelect = "SELECT firstname, middlename, lastname, suffixId, connected_number, phone_no, addressId, propertyId, email, house_no, meter_no, password, positionId, consumertypeId , branchId, statusId, login_statusId, date_added, employee_Id FROM user_consumer WHERE user_id = :user_id";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->bindParam(':user_id', $consumerId, PDO::PARAM_INT);
    $stmtSelect->execute();

    $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if ($row) {

        $sqlSelect = "SELECT connected_number FROM user_consumer WHERE connected_parentId = :user_id ORDER BY user_id DESC LIMIT 1";
        $stmtSelect = $conn->prepare($sqlSelect);
        $stmtSelect->bindParam(':user_id', $consumerId, PDO::PARAM_INT);
        $stmtSelect->execute();

        $rows = $stmtSelect->fetch(PDO::FETCH_ASSOC);
    
        if ($rows) {
            $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM user_consumer WHERE meter_no = :new_meter";
            $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
            $checkDuplicateStmt->bindParam(":new_meter", $new_meter, PDO::PARAM_STR);
            $checkDuplicateStmt->execute();
            $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

            if ($result['count'] > 0) {
                // Username or phone number already exists, don't insert the data
                echo json_encode(['status' => 'duplicate', 'message' => 'Duplicate Meter Number']);
            } else {
                $connected_number = $rows['connected_number'] + 1;
                $new_statusId = 1;
                $password = md5('waterworks');
                // Insert the data into the 'changing_meter' table
                $sqlInsert = "INSERT INTO user_consumer( firstname, middlename, lastname, suffixId, connected_parentId, connected_number, phone_no, addressId, propertyId, email, house_no, meter_no, password, positionId, consumertypeId,  branchId, statusId, login_statusId, date_added, employee_Id, billing_status ) VALUES ( :firstname, :middlename, :lastname, :suffixId, :connected_parentId, :connected_number, :phone_no, :addressId, :propertyId, :email_add, :house_no, :meter_no, :password, :positionId, :consumertypeId, :branchId, :statusId, :login_statusId, :date_added, :employee_Id, :billing_status)";
                $stmtInsert = $conn->prepare($sqlInsert);
                $stmtInsert->bindParam(':firstname', $row['firstname']);
                $stmtInsert->bindParam(':middlename', $row['middlename']);
                $stmtInsert->bindParam(':lastname', $row['lastname']);
                $stmtInsert->bindParam(':suffixId', $row['suffixId']);
                $stmtInsert->bindParam(':connected_parentId', $consumerId);
                $stmtInsert->bindParam(':connected_number', $connected_number);
                $stmtInsert->bindParam(':phone_no', $row['phone_no']);
                $stmtInsert->bindParam(':addressId', $row['addressId']);
                $stmtInsert->bindParam(':propertyId', $row['propertyId']);
                $stmtInsert->bindParam(':email_add', $row['email']);
                $stmtInsert->bindParam(':house_no', $row['house_no']);
                $stmtInsert->bindParam(':meter_no', $new_meter);
                $stmtInsert->bindParam(':password', $password);
                $stmtInsert->bindParam(':positionId', $row['positionId']);
                $stmtInsert->bindParam(':consumertypeId', $row['consumertypeId']);
                $stmtInsert->bindParam(':branchId', $row['branchId']);
                $stmtInsert->bindParam(':statusId', $new_statusId);
                $stmtInsert->bindParam(":login_statusId", $login_statusId, PDO::PARAM_INT);
                $stmtInsert->bindParam(":date_added", $date_added);
                $stmtInsert->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
                $stmtInsert->bindParam(":billing_status", $billing_status);

                $returnValue = 0;
                $stmtInsert->execute();

                if ($stmtInsert->rowCount() > 0) {
                    $returnValue = 1;
                    $activity_type = "Add";
                    $table_name = "Consumer";
                    $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
                    $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

                    $stmt1 = $conn->prepare($sql1);
                    $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
                    $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
                    $stmt1->bindParam(":date_added", $date_added);
                    $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
                    $stmt1->execute();

                    echo json_encode(array("status" => $returnValue, "message" => "Consumer Successfully Added & Added to Activity Log!"));
                }else {
                    echo json_encode(array("status" => 0, "message" => "Failed to add Consumer"));
                }
            }
        }else {
            $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM user_consumer WHERE meter_no = :new_meter";
            $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
            $checkDuplicateStmt->bindParam(":new_meter", $new_meter, PDO::PARAM_STR);
            $checkDuplicateStmt->execute();
            $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

            if ($result['count'] > 0) {
                // Username or phone number already exists, don't insert the data
                echo json_encode(['status' => 'duplicate', 'message' => 'Duplicate Meter Number']);
            } else {
                $connected_number = $row['connected_number'] + 1;
                $new_statusId = 1;
                $password = md5('waterworks');
                // Insert the data into the 'changing_meter' table
                $sqlInsert = "INSERT INTO user_consumer( firstname, middlename, lastname, suffixId, connected_parentId, connected_number, phone_no, addressId, propertyId, email, house_no, meter_no, password, positionId, consumertypeId,  branchId, statusId, login_statusId, date_added, employee_Id, billing_status ) VALUES ( :firstname, :middlename, :lastname, :suffixId, :connected_parentId, :connected_number, :phone_no, :addressId, :propertyId, :email_add, :house_no, :meter_no, :password, :positionId, :consumertypeId, :branchId, :statusId, :login_statusId, :date_added, :employee_Id, :billing_status)";
                $stmtInsert = $conn->prepare($sqlInsert);
                $stmtInsert->bindParam(':firstname', $row['firstname']);
                $stmtInsert->bindParam(':middlename', $row['middlename']);
                $stmtInsert->bindParam(':lastname', $row['lastname']);
                $stmtInsert->bindParam(':suffixId', $row['suffixId']);
                $stmtInsert->bindParam(':connected_parentId', $consumerId);
                $stmtInsert->bindParam(':connected_number', $connected_number);
                $stmtInsert->bindParam(':phone_no', $row['phone_no']);
                $stmtInsert->bindParam(':addressId', $row['addressId']);
                $stmtInsert->bindParam(':propertyId', $row['propertyId']);
                $stmtInsert->bindParam(':email_add', $row['email']);
                $stmtInsert->bindParam(':house_no', $row['house_no']);
                $stmtInsert->bindParam(':meter_no', $new_meter);
                $stmtInsert->bindParam(':password', $password);
                $stmtInsert->bindParam(':positionId', $row['positionId']);
                $stmtInsert->bindParam(':consumertypeId', $row['consumertypeId']);
                $stmtInsert->bindParam(':branchId', $row['branchId']);
                $stmtInsert->bindParam(':statusId', $new_statusId);
                $stmtInsert->bindParam(":login_statusId", $login_statusId, PDO::PARAM_INT);
                $stmtInsert->bindParam(":date_added", $date_added);
                $stmtInsert->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
                $stmtInsert->bindParam(":billing_status", $billing_status);

                $returnValue = 0;
                $stmtInsert->execute();

                if ($stmtInsert->rowCount() > 0) {
                    $returnValue = 1;
                    $activity_type = "Add";
                    $table_name = "Consumer";
                    $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
                    $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

                    $stmt1 = $conn->prepare($sql1);
                    $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
                    $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
                    $stmt1->bindParam(":date_added", $date_added);
                    $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
                    $stmt1->execute();

                    echo json_encode(array("status" => $returnValue, "message" => "Consumer Successfully Added & Added to Activity Log!"));
                }else {
                    echo json_encode(array("status" => 0, "message" => "Failed to add Consumer"));
                }
            }
        }
    } else {
        echo "No data found for the specified row.";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

// Close connection
$conn = null;
?>

