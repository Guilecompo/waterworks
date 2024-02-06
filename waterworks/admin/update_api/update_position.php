<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// include 'connection.php';
include '../connection.php';


error_log(print_r($_POST, true)); // Log the received POST data

$add_position = $_POST['add_position'];

try {
    // Check if barangay_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM position WHERE position_name = :add_position";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":add_position", $add_position, PDO::PARAM_STR);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {

        $sql = "UPDATE position SET
        position_name = :add_position
        WHERE position_id = :position_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":position_id", $_POST['position_id'], PDO::PARAM_INT);
        $stmt->bindParam(":add_position", $_POST['add_position'], PDO::PARAM_STR);
        $stmt->execute();

        echo json_encode(array("status" => 1, "message" => "Position Successfully Updated!"));

    } else {
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for position_name"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
