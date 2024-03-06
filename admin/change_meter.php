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

    $sqlSelect = "SELECT firstname, middlename, lastname, phone_no, addressId, propertyId, email, code, meter_no, password, positionId, branchId FROM user_consumer WHERE user_id = :user_id";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->bindParam(':user_id', $consumerId, PDO::PARAM_INT);
    $stmtSelect->execute();

    $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $new_statusId = 2;
        // Insert the data into the 'changing_meter' table
        $sqlInsert = "INSERT INTO changinng_meter(firstname, middlename, lastname, phone_no, addressId, propertyId, email, code, old_meter_no , password, positionId, branchId, statusId) VALUES (:firstname, :middlename, :lastname, :phone_num, :addressId, :propertyId, :email, :code, :meter_no, :password, :positionId, :branchId, :statusId)";
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->bindParam(':firstname', $row['firstname']);
        $stmtInsert->bindParam(':middlename', $row['middlename']);
        $stmtInsert->bindParam(':lastname', $row['lastname']);
        $stmtInsert->bindParam(':phone_num', $row['phone_no']);
        $stmtInsert->bindParam(':addressId', $row['addressId']);
        $stmtInsert->bindParam(':propertyId', $row['propertyId']);
        $stmtInsert->bindParam(':email', $row['email']);
        $stmtInsert->bindParam(':code', $row['code']);
        $stmtInsert->bindParam(':meter_no', $row['meter_no']);
        $stmtInsert->bindParam(':password', $row['password']);
        $stmtInsert->bindParam(':positionId', $row['positionId']);
        $stmtInsert->bindParam(':branchId', $row['branchId']);
        $stmtInsert->bindParam(':statusId', $new_statusId);

        if ($stmtInsert->execute()) {
            //para update
            $sqlUpdate = "UPDATE user_consumer SET meter_no = :new_meter WHERE user_id = :user_id";
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':new_meter', $new_meter, PDO::PARAM_STR);
            $stmtUpdate->bindParam(':user_id', $consumerId, PDO::PARAM_INT);
            $stmtUpdate->execute();

        } else {
            echo "Error inserting data: " . $stmtInsert->errorInfo()[2];
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
