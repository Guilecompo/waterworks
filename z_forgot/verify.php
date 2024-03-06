<?php
// 1. establish connection to the database
include("connection.php");

// 2. get the data passed from the client
$code = $_POST['code'];

// 3. Define SQL statement for user_consumer
$sqlConsumer = "SELECT * FROM user_consumer ";
$sqlConsumer .= "WHERE code=:code";

// 4. define prepared statement for user_consumer
$stmtConsumer = $conn->prepare($sqlConsumer);
$stmtConsumer->bindParam(":code", $code);

// 5. execute the command for user_consumer
$returnValueConsumer = 0;
$stmtConsumer->execute();

if ($stmtConsumer->rowCount() > 0) {
    $returnValueConsumer = $stmtConsumer->fetch(PDO::FETCH_ASSOC);
} else {
    // If not found in user_consumer, check in user_employee
    // Define SQL statement for user_employee
    $sqlEmployee = "SELECT * FROM user_employee ";
    $sqlEmployee .= "WHERE code=:code";

    // Define prepared statement for user_employee
    $stmtEmployee = $conn->prepare($sqlEmployee);
    $stmtEmployee->bindParam(":code", $code);

    // Execute the command for user_employee
    $stmtEmployee->execute();

    if ($stmtEmployee->rowCount() > 0) {
        $returnValueConsumer = $stmtEmployee->fetch(PDO::FETCH_ASSOC);
    } else {
        // Code not found in both user_consumer and user_employee
        $returnValueConsumer = 0;
    }
}

echo json_encode($returnValueConsumer);
?>
