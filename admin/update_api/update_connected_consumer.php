

<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../connection.php';

error_log(print_r($_POST, true)); 

try {
    // Check if branch_name already exists
    $sql = "UPDATE user_consumer_branch SET
        firstname = :firstname, 
        middlename = :middlename,
        lastname = :lastname,
        phone_no = :phone_no,
        addressId = :addressId,
        propertyId = :propertyId,
        email = :email_add,
        meter_no = :meter_no,
        branchId = :branchId
        WHERE user_id = :user_id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":firstname", $_POST['firstname'], PDO::PARAM_STR);
    $stmt->bindParam(":middlename", $_POST['middlename'], PDO::PARAM_STR);
    $stmt->bindParam(":lastname", $_POST['lastname'], PDO::PARAM_STR);
    $stmt->bindParam(":phone_no", $_POST['phone'], PDO::PARAM_STR);
    $stmt->bindParam(":email_add", $_POST['email_add'], PDO::PARAM_STR);
    $stmt->bindParam(":propertyId", $_POST['propertyId'], PDO::PARAM_INT);
    $stmt->bindParam(":addressId", $_POST['zone_Id'], PDO::PARAM_INT);
    $stmt->bindParam(":meter_no", $_POST['meter_no'], PDO::PARAM_STR);
    $stmt->bindParam(":branchId", $_POST['branchId'], PDO::PARAM_INT);
    $stmt->bindParam(":user_id", $_POST['userid'], PDO::PARAM_INT);
    $stmt->execute();

    // $affectedRows = $stmt->rowCount();
    // if ($affectedRows === 0) {
    //     echo json_encode(array("status" => 0, "message" => "No records updated. User ID not found."));
    //     exit();
    // }

    // echo json_encode(array("status" => 1, "message" => "Consumer Successfully Updated!"));
    if ($stmt->execute()) {
        $activity_type = "Edit";
        $table_name = "Consumer";
        $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
        $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
        $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
        $stmt1->bindParam(":date_added", $date_added);
        $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
        $stmt1->execute();

        echo json_encode(array("status" => 1, "message" => "Consumer Successfully Updated & Added to Activity Log!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "Failed to Updated Consumer"));
    }
} catch (PDOException $e) {
    error_log("Error Code: " . $e->getCode() . ", Message: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>

