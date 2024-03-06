<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

$status = '1';
$branch = $_POST['branchId'];

// 2. Check for duplicate username and phone number
$meter_no = $_POST['meter_no'];
$phone_no = $_POST['phone'];
$email_add = $_POST['email_add'];

$date_added = date("Y-m-d");
$employee_Id = $_POST['employee_Id'];
$login_statusId = 2;

$billing_status = 2;



// Query to check for duplicate username or phone number
$checkDuplicateQuery = "SELECT COUNT(*) AS count FROM user_consumer WHERE meter_no = :meter_no OR phone_no = :phone_no OR email = :email_add";
$checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
$checkDuplicateStmt->bindParam(":meter_no", $meter_no, PDO::PARAM_STR);
$checkDuplicateStmt->bindParam(":phone_no", $phone_no, PDO::PARAM_STR);
$checkDuplicateStmt->bindParam(":email_add", $email_add, PDO::PARAM_STR);
$checkDuplicateStmt->execute();
$result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

if ($result['count'] > 0) {
    // Username or phone number already exists, don't insert the data
    echo json_encode(['status' => 0, 'message' => 'Duplicate username or phone number or email']);
} else {
    $password = md5('waterworks');
    $position = '5';
    // 3. Define SQL statement for insertion
    $sql = "INSERT INTO user_consumer (firstname, middlename, lastname, suffixId, phone_no, addressId, propertyId, email, house_no, meter_no, password, positionId, consumertypeId, branchId, statusId, login_statusId, date_added, employee_Id, billing_status) ";
    $sql .= "VALUES (:firstname, :middlename, :lastname, :suffixId, :phone_no, :addressId, :propertyId, :email_add, :house_no, :meter_no, :password, :positionId, :consumertypeId, :branchId, :statusId, :login_statusId, :date_added, :employee_Id, :billing_status)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":firstname", $_POST['firstname'], PDO::PARAM_STR);
    $stmt->bindParam(":middlename", $_POST['middlename'], PDO::PARAM_STR);
    $stmt->bindParam(":lastname", $_POST['lastname'], PDO::PARAM_STR);
    $stmt->bindParam(":suffixId", $_POST['suffixId'], PDO::PARAM_INT);

    $stmt->bindParam(":phone_no", $_POST['phone'], PDO::PARAM_STR);
    $stmt->bindParam(":email_add", $_POST['email_add'], PDO::PARAM_STR);
    $stmt->bindParam(":propertyId", $_POST['propertyId'], PDO::PARAM_INT);
    $stmt->bindParam(":addressId", $_POST['zoneId'], PDO::PARAM_INT);
    $stmt->bindParam(":house_no", $_POST['house_no'], PDO::PARAM_INT);
    $stmt->bindParam(":meter_no", $_POST['meter_no'], PDO::PARAM_STR);
    $stmt->bindParam(":password", $password, PDO::PARAM_STR);

    $stmt->bindParam(":positionId", $position, PDO::PARAM_INT);
    $stmt->bindParam(":consumertypeId", $_POST['consumer'], PDO::PARAM_INT);
    $stmt->bindParam(":branchId", $branch, PDO::PARAM_INT);

    $stmt->bindParam(":statusId", $status, PDO::PARAM_INT);
    $stmt->bindParam(":login_statusId", $login_statusId, PDO::PARAM_INT);
    $stmt->bindParam(":date_added", $date_added);
    $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
    $stmt->bindParam(":billing_status", $billing_status, PDO::PARAM_INT);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
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
?>
