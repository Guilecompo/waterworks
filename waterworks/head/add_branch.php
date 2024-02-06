<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

// 2. Check for duplicate username and phone number
$branch = $_POST['branch'];
$phone = $_POST['phone_no'];

// Query to check for duplicate username or phone number
$checkDuplicateQuery = "SELECT COUNT(*) AS count FROM branch WHERE branch_name = :branch_names OR phone_num = :phone";
$checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
$checkDuplicateStmt->bindParam(":branch_names", $branch, PDO::PARAM_STR);
$checkDuplicateStmt->bindParam(":phone", $phone, PDO::PARAM_STR);
$checkDuplicateStmt->execute();
$result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

if ($result['count'] > 0) {
    // Username or phone number already exists, don't insert the data
    echo json_encode(['status' => 0, 'message' => 'Duplicate name and phone']);
} else {
    // 3. Define SQL statement for insertion
    $sql = "INSERT INTO branch (branch_name, locationId, phone_num) ";
    $sql .= "VALUES (:branch_names, :location, :phone_no)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":branch_names", $branch, PDO::PARAM_STR);
    $stmt->bindParam(":location", $_POST['zoneId'], PDO::PARAM_INT);
    $stmt->bindParam(":phone_no", $_POST['phone_no'], PDO::PARAM_INT);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $returnValue = 1;
    }

    echo json_encode(['status' => $returnValue, 'message' => 'Record saved successfully']);
}
?>
