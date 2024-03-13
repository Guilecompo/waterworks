<?php
header("Access-Control-Allow-Origin: *");
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $barangayId = $_POST['barangayId'];
    
    try {
        $sql = "SELECT * FROM branch a 
                INNER JOIN address_zone b ON a.locationId = b.zone_id 
                WHERE b.barangayId = :barangayId
                ORDER BY branch_id";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($returnValue);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Only POST requests are allowed"]);
}
?>
