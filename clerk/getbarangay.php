<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
 // Set this header last

 include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL query
        $barangay_id = $_POST['barangay_id'];
        $stmt = $conn->prepare("SELECT
                a.barangay_id,
                a.barangay_name,
                b.municipality_name
            FROM
                address_barangay a
                INNER JOIN address_municipality b ON a.municipalityId = b.municipality_id
        WHERE a.barangay_id = :barangay_id
        ");
        $stmt->bindParam(":barangay_id", $barangay_id);
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
