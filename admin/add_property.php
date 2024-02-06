<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

// 2. Check for duplicate username and phone number
$add_property = $_POST['add_property'];


// Query to check for duplicate username or phone number
$checkDuplicateQuery = "SELECT COUNT(*) AS count FROM property WHERE property_name = :add_property ";
$checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
$checkDuplicateStmt->bindParam(":add_property", $add_property, PDO::PARAM_STR);
$checkDuplicateStmt->execute();
$result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

if ($result['count'] > 0) {
    // Username or phone number already exists, don't insert the data
    echo json_encode(['status' => 0, 'message' => 'Duplicate Property']);
} else {
    // 3. Define SQL statement for insertion
    $sql = "INSERT INTO property (property_name) ";
    $sql .= "VALUES (:add_property)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":add_property", $_POST['add_property'], PDO::PARAM_STR);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $returnValue = 1;
    }

    echo json_encode(['status' => $returnValue, 'message' => 'Record saved successfully']);
}
?>
