<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../connection.php';

error_log(print_r($_POST, true)); 

try {
    // Sanitize and fetch POST data
    $firstname = htmlspecialchars($_POST['firstname'], ENT_QUOTES, 'UTF-8');
    $middlename = htmlspecialchars($_POST['middlename'], ENT_QUOTES, 'UTF-8');
    $lastname = htmlspecialchars($_POST['lastname'], ENT_QUOTES, 'UTF-8');
    $phone_no = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8');
    $addressId = htmlspecialchars($_POST['zoneId'], ENT_QUOTES, 'UTF-8');
    $propertyId = htmlspecialchars($_POST['propertyId'], ENT_QUOTES, 'UTF-8');
    $consumertypeId = htmlspecialchars($_POST['consumertypeId'], ENT_QUOTES, 'UTF-8');
    $email_add = htmlspecialchars($_POST['email_add'], ENT_QUOTES, 'UTF-8');
    $house_no = htmlspecialchars($_POST['house_no'], ENT_QUOTES, 'UTF-8');
    $meter_no = htmlspecialchars($_POST['meter_no'], ENT_QUOTES, 'UTF-8');
    $branchId = htmlspecialchars($_POST['branchId'], ENT_QUOTES, 'UTF-8');
    $user_id = htmlspecialchars($_POST['userid'], ENT_QUOTES, 'UTF-8');
    $employee_Id = htmlspecialchars($_POST['employee_Id'], ENT_QUOTES, 'UTF-8');

    $date_added = date("Y-m-d");

    // Update consumer information
    $sql = "UPDATE user_consumer SET
        firstname = :firstname, 
        middlename = :middlename,
        lastname = :lastname,
        phone_no = :phone_no,
        addressId = :addressId,
        propertyId = :propertyId,
        email = :email_add,
        house_no = :house_no,
        meter_no = :meter_no,
        consumertypeId = :consumertypeId,
        branchId = :branchId
        WHERE user_id = :user_id";

    $stmt = $conn->prepare($sql);

    // Bind parameters
    $stmt->bindParam(":firstname", $firstname, PDO::PARAM_STR);
    $stmt->bindParam(":middlename", $middlename, PDO::PARAM_STR);
    $stmt->bindParam(":lastname", $lastname, PDO::PARAM_STR);
    $stmt->bindParam(":phone_no", $phone_no, PDO::PARAM_STR);
    $stmt->bindParam(":email_add", $email_add, PDO::PARAM_STR);
    $stmt->bindParam(":propertyId", $propertyId, PDO::PARAM_INT);
    $stmt->bindParam(":addressId", $addressId, PDO::PARAM_INT);
    $stmt->bindParam(":meter_no", $meter_no, PDO::PARAM_STR);
    $stmt->bindParam(":house_no", $house_no, PDO::PARAM_INT);
    $stmt->bindParam(":consumertypeId", $consumertypeId, PDO::PARAM_INT);
    $stmt->bindParam(":branchId", $branchId, PDO::PARAM_INT);
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $affectedRows = $stmt->rowCount();

    // Check if the update was successful
    if ($affectedRows > 0) {
        // Log the activity
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

        echo json_encode(array("status" => 1, "message" => "Consumer Successfully Updated!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "No records updated. User ID not found."));
    }
} catch (PDOException $e) {
    error_log("Error Code: " . $e->getCode() . ", Message: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
