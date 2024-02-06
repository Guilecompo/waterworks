<?php
// header("Access-Control-Allow-Origin:*");
// 1. establish a connection to the database
include("connection.php");

// 2. get the data passed from the client
$newPass = $_POST['password'];
$Email = $_POST['Email'];
$newPassword = md5($newPass);
// 3. Define SQL statement for user_consumer
$sqlConsumer = "UPDATE user_consumer SET password = :newPassword ";
$sqlConsumer .= "WHERE email = :Email";

// 4. define prepared statement for user_consumer
$stmtConsumer = $conn->prepare($sqlConsumer);
$stmtConsumer->bindParam(":newPassword", $newPassword);
$stmtConsumer->bindParam(":Email", $Email);

// 5. execute the command for user_consumer
$successConsumer = $stmtConsumer->execute();

if ($successConsumer) {
    // Password updated successfully, set the password to a blank value for user_consumer
    $blankCodeConsumer = ""; // Change this to the desired blank value
    $sqlBlankPasswordConsumer = "UPDATE user_consumer SET code = :blankCode WHERE email = :Email";
    $stmtBlankPasswordConsumer = $conn->prepare($sqlBlankPasswordConsumer);
    $stmtBlankPasswordConsumer->bindParam(":blankCode", $blankCodeConsumer);
    $stmtBlankPasswordConsumer->bindParam(":Email", $Email);
    $stmtBlankPasswordConsumer->execute();

    $responseConsumer = array(
        'success' => true,
        'message' => 'Password updated successfully for user_consumer.',
    );
} else {
    $responseConsumer = array(
        'success' => false,
        'message' => 'Password update failed for user_consumer.',
    );
}

// 3. Define SQL statement for user_employee
$sqlEmployee = "UPDATE user_employee SET password = :newPassword ";
$sqlEmployee .= "WHERE email = :Email";

// 4. define prepared statement for user_employee
$stmtEmployee = $conn->prepare($sqlEmployee);
$stmtEmployee->bindParam(":newPassword", $newPassword);
$stmtEmployee->bindParam(":Email", $Email);

// 5. execute the command for user_employee
$successEmployee = $stmtEmployee->execute();

if ($successEmployee) {
    // Password updated successfully, set the password to a blank value for user_employee
    $blankCodeEmployee = ""; // Change this to the desired blank value
    $sqlBlankPasswordEmployee = "UPDATE user_employee SET code = :blankCode WHERE email = :Email";
    $stmtBlankPasswordEmployee = $conn->prepare($sqlBlankPasswordEmployee);
    $stmtBlankPasswordEmployee->bindParam(":blankCode", $blankCodeEmployee);
    $stmtBlankPasswordEmployee->bindParam(":Email", $Email);
    $stmtBlankPasswordEmployee->execute();

    $responseEmployee = array(
        'success' => true,
        'message' => 'Password updated successfully for user_employee.',
    );
} else {
    $responseEmployee = array(
        'success' => false,
        'message' => 'Password update failed for user_employee.',
    );
}

// Combine the responses for both user_consumer and user_employee
$response = array(
    'user_consumer' => $responseConsumer,
    'user_employee' => $responseEmployee,
);

echo json_encode($response);
?>
