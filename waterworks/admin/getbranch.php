<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
 // Set this header last

 include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL query
        $branch_id = $_POST['branch_id'];
        $stmt = $conn->prepare("SELECT
                q.branch_id,
                q.branch_name,
                q.phone_num,
                a.zone_name,
                b.barangay_id,
                b.barangay_name,
                c.municipality_id,
                c.municipality_name
            FROM
                branch q
                INNER JOIN address_zone a ON q.locationId = a.zone_id
                INNER JOIN address_barangay b ON a.barangayId = b.barangay_id
                INNER JOIN address_municipality c ON b.municipalityId = c.municipality_id
        WHERE q.branch_id = :branch_id
        ");
        $stmt->bindParam(":branch_id", $branch_id);
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
