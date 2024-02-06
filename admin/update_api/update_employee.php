<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../connection.php';

error_log(print_r($_POST, true)); 

try {
    // Check if branch_name already exists
    $sql = "UPDATE user_employee SET
        firstname = :firstname, 
        middlename = :middlename,
        lastname = :lastname,
        phone_no = :phone,
        provinceName = :provinceNames,
        municipalityName = :municipalityNames,
        barangayName = :barangayNames,
        email = :email_add,
        username = :username,
        positionId = :positionId,
        branchId = :branchId
        WHERE user_id = :user_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":firstname", $_POST['firstname'], PDO::PARAM_STR);
        $stmt->bindParam(":middlename", $_POST['middlename'], PDO::PARAM_STR);
        $stmt->bindParam(":lastname", $_POST['lastname'], PDO::PARAM_STR);
        $stmt->bindParam(":phone", $_POST['phone'], PDO::PARAM_STR);
        $stmt->bindParam(":provinceNames", $_POST['provinceNames'], PDO::PARAM_STR);
        $stmt->bindParam(":municipalityNames", $_POST['municipalityNames'], PDO::PARAM_STR);
        $stmt->bindParam(":barangayNames", $_POST['barangayNames'], PDO::PARAM_STR);
        $stmt->bindParam(":email_add", $_POST['email_add'], PDO::PARAM_STR);
        $stmt->bindParam(":username", $_POST['username'], PDO::PARAM_STR);
        $stmt->bindParam(":positionId", $_POST['positionId'], PDO::PARAM_INT);
        $stmt->bindParam(":branchId", $_POST['branchId'], PDO::PARAM_INT);
        $stmt->bindParam(":user_id", $_POST['user_id'], PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(array("status" => 1, "message" => "Employee Successfully Updated!"));
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
