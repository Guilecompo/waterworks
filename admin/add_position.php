<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

// 2. Check for duplicate username and phone number
$add_position = $_POST['add_position'];
$date_added = date("Y-m-d");
$employee_Id = $_POST['employee_Id'];
$position_statusId = 1;

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
    $sql = "INSERT INTO position (position_name, date_added, employee_Id, position_statusId) ";
    $sql .= "VALUES (:add_position, :date_added, :employee_Id, :position_statusId)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":add_position", $_POST['add_position'], PDO::PARAM_STR);
    $stmt->bindParam(":position_statusId", $position_statusId, PDO::PARAM_INT);
    $stmt->bindParam(":date_added", $date_added);
    $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $returnValue = 1;
        $activity_type = "Add";
        $table_name = "Position";
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
?>
