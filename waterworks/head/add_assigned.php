<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

try {
    // 2. Check for duplicate zoneIds
    $zoneIds = $_POST['zoneId'];

    // Loop through zoneIds and check for duplicates
    foreach ($zoneIds as $zoneId) {
        // Query to check for duplicate zoneId
        $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM assign WHERE zone_Id = :zoneId";
        $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
        $checkDuplicateStmt->bindParam(":zoneId", $zoneId, PDO::PARAM_INT);
        $checkDuplicateStmt->execute();
        $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

        if ($result['count'] > 0) {
            // At least one zoneId is already assigned, don't insert the data
            echo json_encode(['status' => 0, 'message' => 'Someone is already assigned to one or more zones']);
            exit(); // Stop execution to prevent inserting data
        }
    }

    $statusId = 1;

    // 3. Define SQL statement for insertion
    $sql = "INSERT INTO assign (emp_Id , zone_Id, branchId) ";
    $sql .= "VALUES (:accId, :zoneId, :branchId)";

    // Loop through zoneIds and insert data
    foreach ($zoneIds as $zoneId) {
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":accId", $_POST['accId'], PDO::PARAM_INT);
        $stmt->bindParam(":zoneId", $zoneId, PDO::PARAM_INT);  // Use sanitized zoneId
        $stmt->bindParam(":branchId", $_POST['branchId'], PDO::PARAM_INT);

        // Execute the prepared statement
        $returnValue = 0;
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $returnValue = 1;
        }
    }

    echo json_encode(['status' => $returnValue, 'message' => 'Record saved successfully']);
} catch (PDOException $e) {
    // Handle database errors
    echo json_encode(['status' => -1, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
