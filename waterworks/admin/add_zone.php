<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

$barangayId = $_POST['barangayId'];
$add_zone = $_POST['add_zone'];

try {
    // Check if barangay_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM address_zone WHERE zone_name = :add_zone AND barangayId = :barangayId";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":add_zone", $add_zone, PDO::PARAM_STR);
    $checkDuplicateStmt->bindParam(":barangayId", $barangayId, PDO::PARAM_INT);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {

        $sql = "INSERT INTO address_zone (zone_name, barangayId) ";
        $sql .= "VALUES (:add_zone, :barangayId)";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":add_zone", $_POST['add_zone'], PDO::PARAM_STR);
        $stmt->bindParam(":barangayId", $barangayId, PDO::PARAM_INT);

        $returnValue = 0;
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $returnValue = 1;
        }

        echo json_encode(['status' => $returnValue, 'message' => 'Record saved successfully']);
    } else {
        
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for barangay_name"));
    }
} catch (PDOException $e) {
    
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>