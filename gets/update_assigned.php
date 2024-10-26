<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

$assign_id = $_POST['assign_id'];
$employee_Id = $_POST['employee_Id'];
$assign_statusId = 2;

// Prepare and execute the update statement
$sql = "UPDATE assign SET assign_statusId = :assign_statusId WHERE assign_id = :assign_id";
$stmt = $conn->prepare($sql);
$stmt->bindParam(":assign_id", $assign_id);
$stmt->bindParam(":assign_statusId", $assign_statusId);

if ($stmt->execute()) {
    // Prepare the insert statement for activity log
    $activity_type = "Remove";
    $table_name = "Assigned";
    $date_added = date('Y-m-d H:i:s'); // Assuming you want to log the current timestamp

    $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) VALUES (:activity_type, :table_name, :date_added, :employee_Id)";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->bindParam(":activity_type", $activity_type);
    $stmt1->bindParam(":table_name", $table_name);
    $stmt1->bindParam(":date_added", $date_added);
    $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
    
    if ($stmt1->execute()) {
        echo json_encode(array("status" => 1, "message" => "Barangay Successfully Updated & Added to Activity Log!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "Failed to log the activity."));
    }
} else {
    echo json_encode(array("status" => 0, "message" => "Failed to update assignment."));
}
?>
