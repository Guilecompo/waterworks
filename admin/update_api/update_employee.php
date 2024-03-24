<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../connection.php';

error_log(print_r($_POST, true)); 

$date_added = date("Y-m-d");
$employee_Id = htmlspecialchars($_POST['employee_Id'], ENT_QUOTES, 'UTF-8');

// Sanitize and assign POST data to variables
$firstname = htmlspecialchars($_POST['firstname'], ENT_QUOTES, 'UTF-8');
$middlename = htmlspecialchars($_POST['middlename'], ENT_QUOTES, 'UTF-8');
$lastname = htmlspecialchars($_POST['lastname'], ENT_QUOTES, 'UTF-8');
$suffixId = htmlspecialchars($_POST['suffixId'], ENT_QUOTES, 'UTF-8');
$phone_no = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8');
$provinceNames = htmlspecialchars($_POST['provinceNames'], ENT_QUOTES, 'UTF-8');
$municipalityNames = htmlspecialchars($_POST['municipalityNames'], ENT_QUOTES, 'UTF-8');
$barangayNames = htmlspecialchars($_POST['barangayNames'], ENT_QUOTES, 'UTF-8');
$email_add = htmlspecialchars($_POST['email_add'], ENT_QUOTES, 'UTF-8');
$positionId = htmlspecialchars($_POST['positionId'], ENT_QUOTES, 'UTF-8');
$branch = htmlspecialchars($_POST['branchId'], ENT_QUOTES, 'UTF-8');
$status = '1';
$login_statusId = 2;
$code = "";

try {
    // Define SQL statement for insertion
    $password = md5('waterworks');
    $sql = "INSERT INTO user_employee(firstname, middlename, lastname, suffixId, phone_no, provinceName, municipalityName, barangayName, email, code, password, positionId, branchId, statusId, login_statusId, date_added, employee_Id) ";
    $sql .= "VALUES (:firstname, :middlename, :lastname, :suffixId, :phone_no, :provinceNames, :municipalityNames, :barangayNames, :email_add, :code, :password, :positionId, :branchId, :statusId, :login_statusId, :date_added, :employee_Id)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":firstname", $firstname, PDO::PARAM_STR);
    $stmt->bindParam(":middlename", $middlename, PDO::PARAM_STR);
    $stmt->bindParam(":lastname", $lastname, PDO::PARAM_STR);
    $stmt->bindParam(":suffixId", $suffixId, PDO::PARAM_STR);
    $stmt->bindParam(":phone_no", $phone_no, PDO::PARAM_STR);
    $stmt->bindParam(":provinceNames", $provinceNames, PDO::PARAM_STR);
    $stmt->bindParam(":municipalityNames", $municipalityNames, PDO::PARAM_STR);
    $stmt->bindParam(":barangayNames", $barangayNames, PDO::PARAM_STR);
    $stmt->bindParam(":email_add", $email_add, PDO::PARAM_STR); 
    $stmt->bindParam(":code", $code, PDO::PARAM_STR);
    $stmt->bindParam(":password", $password, PDO::PARAM_STR);
    $stmt->bindParam(":positionId", $positionId, PDO::PARAM_INT);
    $stmt->bindParam(":branchId", $branch, PDO::PARAM_INT);
    $stmt->bindParam(":statusId", $status, PDO::PARAM_INT);
    $stmt->bindParam(":login_statusId", $login_statusId, PDO::PARAM_INT);
    $stmt->bindParam(":date_added", $date_added);
    $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        $activity_type = "Add";
        $table_name = "Employee";
        $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
        $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
        $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
        $stmt1->bindParam(":date_added", $date_added);
        $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
        $stmt1->execute();

        echo json_encode(array("status" => 1, "message" => "Employee Successfully Added & Added to Activity Log!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "Failed to add Employee"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Database error: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
