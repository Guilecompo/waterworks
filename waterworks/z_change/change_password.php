<?php
// header("Access-Control-Allow-Origin:*");
// 1. establish a connection to the database
include("connection.php");

// 2. get the data passed from the client
$newPassword = $_POST['password'];
$Email = $_POST['Email'];

// 3. Define SQL statement
$sql = "UPDATE user_consumer SET password = :newPassword ";
$sql .= "WHERE email = :Email";

// 4. define prepared statement
$stmt = $conn->prepare($sql);
$stmt->bindParam(":newPassword", $newPassword);
$stmt->bindParam(":Email", $Email);

// 5. execute the command
$success = $stmt->execute();

if ($success) {
    // Password updated successfully, set the password to a blank value
    $blankCode = ""; // Change this to the desired blank value
    $sqlBlankPassword = "UPDATE user_consumer SET code = :blankCode WHERE email = :Email";
    $stmtBlankPassword = $conn->prepare($sqlBlankPassword);
    $stmtBlankPassword->bindParam(":blankCode", $blankCode);
    $stmtBlankPassword->bindParam(":Email", $Email);
    $stmtBlankPassword->execute();
    
    $response = array(
        'success' => true,
        'message' => 'Password updated successfully.',
    );
} else {
    $response = array(
        'success' => false,
        'message' => 'Password update failed.',
    );
}

echo json_encode($response);
?>
