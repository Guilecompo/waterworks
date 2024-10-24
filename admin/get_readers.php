<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
 // Set this header last

 include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL query
        $barangayId = $_POST['barangayId'];
        $stmt = $conn->prepare("SELECT 
                a.*, g.position_name,
                h.branch_id, i.status_id, f.suffix_id, f.suffix_name,
                h.branch_name, i.user_status
            FROM
                user_employee a
                INNER JOIN suffix f ON a.suffixId = f.suffix_id
                INNER JOIN position g ON a.positionId = g.position_id
                INNER JOIN branch h ON a.branchId = h.branch_id
                INNER JOIN user_status i ON a.statusId = i.status_id
                INNER JOIN address_zone j ON h.locationId = j.zone_id
        WHERE g.position_name IN ('Meter Reader') AND j.barangayId = :barangayId");

        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
    
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        echo json_encode($results);
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
