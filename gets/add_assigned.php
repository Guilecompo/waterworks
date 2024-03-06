<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

try {
    // 2. Check for duplicate zoneIds
    $zoneIds = $_POST['zoneId'];
    $date_added = date("Y-m-d");
    $employee_Id = $_POST['employee_Id'];
    $assign_statusId = 1;

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
    $sql = "INSERT INTO assign (emp_Id , zone_Id, branchId, date_added, employee_Id, assign_statusId) ";
    $sql .= "VALUES (:accId, :zoneId, :branchId, :date_added, :employee_Id, :assign_statusId)";

    // Loop through zoneIds and insert data
    foreach ($zoneIds as $zoneId) {
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":accId", $_POST['accId'], PDO::PARAM_INT);
        $stmt->bindParam(":zoneId", $zoneId, PDO::PARAM_INT);  // Use sanitized zoneId
        $stmt->bindParam(":branchId", $_POST['branchId'], PDO::PARAM_INT);
        $stmt->bindParam(":assign_statusId", $assign_statusId, PDO::PARAM_INT);
        $stmt->bindParam(":date_added", $date_added);
        $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

        // Execute the prepared statement
        $returnValue = 0;
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $returnValue = 1;
            $activity_type = "Add";
            $table_name = "Assign";
            $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
            $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";
    
            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmt1->bindParam(":date_added", $date_added);
            $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt1->execute();
    
            echo json_encode(array("status" => $returnValue, "message" => "Position Successfully Added & Added to Activity Log!"));
        }else {
            echo json_encode(array("status" => 0, "message" => "Failed to add Position"));
        }
    }
} catch (PDOException $e) {
    // Handle database errors
    echo json_encode(['status' => -1, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
