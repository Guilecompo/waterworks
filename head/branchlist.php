<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
 // Set this header last

 include 'connection.php';
session_start();

$barangayId = $_POST['barangayId'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL query
        $stmt = $conn->prepare("SELECT
        a.branch_id,
        a.branch_name,
        a.phone_num,
        b.zone_name,
        c.barangay_name
        FROM branch a
        INNER JOIN address_zone b ON a.locationId = b.zone_id
        INNER JOIN address_barangay c ON b.barangayId = c.barangay_id
        WHERE c.barangay_id = :barangayId
        ");

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
