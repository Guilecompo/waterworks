<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

$municipalityId = $_POST['municipalityId'];
$add_barangay = $_POST['add_barangay'];

try {
    // Check if barangay_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM address_barangay WHERE barangay_name = :add_barangay AND municipalityId = :municipalityId";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":add_barangay", $add_barangay, PDO::PARAM_STR);
    $checkDuplicateStmt->bindParam(":municipalityId", $municipalityId, PDO::PARAM_STR);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {
        // If barangay_name doesn't exist, proceed with insertion
        $sql = "INSERT INTO address_barangay (barangay_name, municipalityId) ";
        $sql .= "VALUES (:add_barangay, :municipalityId)";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":add_barangay", $_POST['add_barangay'], PDO::PARAM_STR);
        $stmt->bindParam(":municipalityId", $municipalityId, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(array("status" => 1, "message" => "Barangay Successfully Added!"));

    } else {
        
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for barangay_name"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
