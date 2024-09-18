<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
$assignId = $_POST['assignId'];

$stmt = $conn->prepare("DELETE FROM `assign` WHERE assign_id = :assignId");
$stmt->bindParam(":assignId", $assignId);
$stmt->execute();

// Check how many rows were affected
if ($stmt->rowCount() > 0) {
    // Successfully deleted
    echo json_encode(["success" => true]);
} else {
    // No rows affected (either not found or invalid ID)
    echo json_encode(["success" => false, "error" => "Reader data not found or is invalid"]);
}
?>
