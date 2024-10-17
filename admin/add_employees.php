<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

// Sanitize and fetch POST data
$status = '1';
$branch = htmlspecialchars($_POST['branchId'], ENT_QUOTES, 'UTF-8');
$suffixId = htmlspecialchars($_POST['suffixId'], ENT_QUOTES, 'UTF-8');
$phone_no = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8');
$email_add = htmlspecialchars($_POST['email_add'], ENT_QUOTES, 'UTF-8');
$username = htmlspecialchars($_POST['username'], ENT_QUOTES, 'UTF-8');
$date_added = date("Y-m-d");
$employee_Id = htmlspecialchars($_POST['employee_Id'], ENT_QUOTES, 'UTF-8');
$login_statusId = 2;
$code = "";

try {
    // Query to check for duplicate username or phone number
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM user_employee WHERE phone_no = :phone_no OR username = :username";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":phone_no", $phone_no, PDO::PARAM_STR);
    $checkDuplicateStmt->bindParam(":username", $username, PDO::PARAM_STR);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['count'] > 0) {
        // Username or phone number already exists, don't insert the data
        echo json_encode(['status' => 0, 'message' => 'Duplicate username or phone number']);
    } else {
        // 3. Define SQL statement for insertion
        $password = md5('waterworks');

        // Sanitize other POST values
        $firstname = htmlspecialchars($_POST['firstname'], ENT_QUOTES, 'UTF-8');
        $middlename = htmlspecialchars($_POST['middlename'], ENT_QUOTES, 'UTF-8');
        $lastname = htmlspecialchars($_POST['lastname'], ENT_QUOTES, 'UTF-8');
        $provinceNames = htmlspecialchars($_POST['provinceNames'], ENT_QUOTES, 'UTF-8');
        $municipalityNames = htmlspecialchars($_POST['municipalityNames'], ENT_QUOTES, 'UTF-8');
        $barangayNames = htmlspecialchars($_POST['barangayNames'], ENT_QUOTES, 'UTF-8');
        $positionId = htmlspecialchars($_POST['positionId'], ENT_QUOTES, 'UTF-8');

        $sql = "INSERT INTO user_employee(firstname, middlename, lastname, suffixId, phone_no, provinceName, municipalityName, barangayName, email, code, username, password, positionId, branchId, statusId, login_statusId, date_added, employee_Id) ";
        $sql .= "VALUES (:firstname, :middlename, :lastname, :suffixId, :phone_no, :provinceNames, :municipalityNames, :barangayNames, :email_add, :code, :username, :password, :positionId, :branchId, :statusId, :login_statusId, :date_added, :employee_Id)";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":firstname", $firstname, PDO::PARAM_STR);
        $stmt->bindParam(":middlename", $middlename, PDO::PARAM_STR);
        $stmt->bindParam(":lastname", $lastname, PDO::PARAM_STR);
        $stmt->bindParam(":phone_no", $phone_no, PDO::PARAM_STR);
        $stmt->bindParam(":provinceNames", $provinceNames, PDO::PARAM_STR);
        $stmt->bindParam(":municipalityNames", $municipalityNames, PDO::PARAM_STR);
        $stmt->bindParam(":barangayNames", $barangayNames, PDO::PARAM_STR);
        $stmt->bindParam(":email_add", $email_add, PDO::PARAM_STR); 
        $stmt->bindParam(":username", $username, PDO::PARAM_STR); 
        $stmt->bindParam(":code", $code, PDO::PARAM_STR);
        $stmt->bindParam(":suffixId", $suffixId, PDO::PARAM_INT);
        $stmt->bindParam(":password", $password, PDO::PARAM_STR);
        $stmt->bindParam(":positionId", $positionId, PDO::PARAM_INT);
        $stmt->bindParam(":branchId", $branch, PDO::PARAM_INT);
        $stmt->bindParam(":statusId", $status, PDO::PARAM_INT);
        $stmt->bindParam(":login_statusId", $login_statusId, PDO::PARAM_INT);
        $stmt->bindParam(":date_added", $date_added);
        $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

        // Execute the prepared statement
        $returnValue = 0;
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $returnValue = 1;
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

            echo json_encode(array("status" => $returnValue, "message" => "Employee Successfully Added & Added to Activity Log!"));
        } else {
            echo json_encode(array("status" => 0, "message" => "Failed to add Employee"));
        }
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 0, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
