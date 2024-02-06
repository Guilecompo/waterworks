<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

$consumerId = $_POST['consumerId'];
$new_meter = $_POST['new_meters'];


try {

    $sqlSelect = "SELECT user_id, firstname, middlename, lastname, phone_no, addressId, propertyId, email, code, meter_no, password, positionId, branchId FROM user_consumer WHERE user_id = :user_id";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->bindParam(':user_id', $consumerId, PDO::PARAM_INT);
    $stmtSelect->execute();

    $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if ($row) {

        $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM user_consumer_branch WHERE meter_no = :new_meter";
        $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
        $checkDuplicateStmt->bindParam(":new_meter", $new_meter, PDO::PARAM_STR);
        // $checkDuplicateStmt->bindParam(":phone_no", $phone_no, PDO::PARAM_STR);
        // $checkDuplicateStmt->bindParam(":email_add", $email_add, PDO::PARAM_STR);
        $checkDuplicateStmt->execute();
        $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

        if ($result['count'] > 0) {
            // Username or phone number already exists, don't insert the data
            echo json_encode(['status' => 'duplicate', 'message' => 'Duplicate Meter Number']);
        } else {
            $new_statusId = 1;
            $password = md5('waterworks');
            // Insert the data into the 'changing_meter' table
            $sqlInsert = "INSERT INTO user_consumer_branch(consumerId, firstname, middlename, lastname, phone_no, addressId, propertyId, email, code, meter_no , password, positionId, branchId, statusId) VALUES (:consumerId, :firstname, :middlename, :lastname, :phone_no, :addressId, :propertyId, :email, :code, :meter_no, :password, :positionId, :branchId, :statusId)";
            $stmtInsert = $conn->prepare($sqlInsert);
            $stmtInsert->bindParam(':consumerId', $row['user_id']);
            $stmtInsert->bindParam(':firstname', $row['firstname']);
            $stmtInsert->bindParam(':middlename', $row['middlename']);
            $stmtInsert->bindParam(':lastname', $row['lastname']);
            $stmtInsert->bindParam(':phone_no', $row['phone_no']);
            $stmtInsert->bindParam(':addressId', $row['addressId']);
            $stmtInsert->bindParam(':propertyId', $row['propertyId']);
            $stmtInsert->bindParam(':email', $row['email']);
            $stmtInsert->bindParam(':code', $row['code']);
            $stmtInsert->bindParam(':meter_no', $new_meter);
            $stmtInsert->bindParam(':password', $password);
            $stmtInsert->bindParam(':positionId', $row['positionId']);
            $stmtInsert->bindParam(':branchId', $row['branchId']);
            $stmtInsert->bindParam(':statusId', $new_statusId);

            if ($stmtInsert->execute()) {
            } else {
                echo "Error inserting data: " . $stmtInsert->errorInfo()[2];
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

