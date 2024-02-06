<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

// 2. Check for duplicate username and phone number
$add_position = $_POST['add_position'];


// Query to check for duplicate username or phone number
$checkDuplicateQuery = "SELECT COUNT(*) AS count FROM position WHERE position_name = :add_position ";
$checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
$checkDuplicateStmt->bindParam(":add_position", $add_position, PDO::PARAM_STR);
$checkDuplicateStmt->execute();
$result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

if ($result['count'] > 0) {
    // Username or phone number already exists, don't insert the data
    echo json_encode(['status' => 0, 'message' => 'Duplicate Position']);
} else {
    // 3. Define SQL statement for insertion
    $sql = "INSERT INTO position (position_name) ";
    $sql .= "VALUES (:add_position)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":add_position", $_POST['add_position'], PDO::PARAM_STR);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $returnValue = 1;
    }

    echo json_encode(['status' => $returnValue, 'message' => 'Record saved successfully']);
}
?>
