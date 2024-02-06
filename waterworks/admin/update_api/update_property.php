<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// include 'connection.php';
include '../connection.php';


error_log(print_r($_POST, true)); // Log the received POST data

$add_property = $_POST['add_property'];

try {
    // Check if barangay_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM property WHERE property_name = :add_property";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":add_property", $add_property, PDO::PARAM_STR);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {

        $sql = "UPDATE property SET
        property_name = :add_property
        WHERE property_id = :property_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":property_id", $_POST['property_id'], PDO::PARAM_INT);
        $stmt->bindParam(":add_property", $_POST['add_property'], PDO::PARAM_STR);
        $stmt->execute();

        echo json_encode(array("status" => 1, "message" => "Property Successfully Updated!"));

    } else {
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for property_name"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
