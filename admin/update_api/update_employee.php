<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../connection.php';

error_log(print_r($_POST, true)); 

$date_added = date("Y-m-d");
$employee_Id = $_POST['employee_Id'];

try {
    // Check if branch_name already exists
    $sql = "UPDATE user_employee SET
        firstname = :firstname, 
        middlename = :middlename,
        lastname = :lastname,
        suffixId = :suffixId,
        phone_no = :phone,
        provinceName = :provinceNames,
        municipalityName = :municipalityNames,
        barangayName = :barangayNames,
        email = :email_add,
        positionId = :positionId,
        branchId = :branchId
        WHERE user_id = :user_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":firstname", $_POST['firstname'], PDO::PARAM_STR);
        $stmt->bindParam(":middlename", $_POST['middlename'], PDO::PARAM_STR);
        $stmt->bindParam(":lastname", $_POST['lastname'], PDO::PARAM_STR);
        $stmt->bindParam(":suffixId", $_POST['suffixId'], PDO::PARAM_STR);
        $stmt->bindParam(":phone", $_POST['phone'], PDO::PARAM_STR);
        $stmt->bindParam(":provinceNames", $_POST['provinceNames'], PDO::PARAM_STR);
        $stmt->bindParam(":municipalityNames", $_POST['municipalityNames'], PDO::PARAM_STR);
        $stmt->bindParam(":barangayNames", $_POST['barangayNames'], PDO::PARAM_STR);
        $stmt->bindParam(":email_add", $_POST['email_add'], PDO::PARAM_STR);
        $stmt->bindParam(":positionId", $_POST['positionId'], PDO::PARAM_INT);
        $stmt->bindParam(":branchId", $_POST['branchId'], PDO::PARAM_INT);
        $stmt->bindParam(":user_id", $_POST['user_id'], PDO::PARAM_INT);
        if ($stmt->execute()) {
            $activity_type = "Edit";
            $table_name = "Employee";
            $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
            $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmt1->bindParam(":date_added", $date_added);
            $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt1->execute();

            echo json_encode(array("status" => 1, "message" => "Employee Successfully Updated & Added to Activity Log!"));
        } else {
            echo json_encode(array("status" => 0, "message" => "Failed to Updated Employee"));
        }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
