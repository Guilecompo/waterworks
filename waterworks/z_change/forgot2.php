<?php
// header("Access-Control-Allow-Origin:*");
// 1. establish connection to the database
include("connection.php");

// 2. get the data passed from the client
$email = $_POST['email'];

// 3. Define SQL statement
$sql = "SELECT * FROM user_employee ";
$sql .= "WHERE email = :email";

// 4. define prepared statement
$stmt = $conn->prepare($sql);
$stmt->bindParam(":email", $email);

// 5. execute the command
$returnValue = 0;
$stmt->execute();

if ($stmt->rowCount() > 0) {
    // Email is correct, generate a 6-digit random code
    $randomCode = rand(100000, 999999);

    // Update the code in the database
    $updateSql = "UPDATE user_employee SET code = :code WHERE email = :email";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bindParam(":code", $randomCode);
    $updateStmt->bindParam(":email", $email);

    if ($updateStmt->execute()) {
        $returnValue = array("success" => true, "code" => $randomCode);
    } else {
        $returnValue = array("success" => false, "error" => "Failed to update the verification code");
    }
}

echo json_encode($returnValue);
?>
