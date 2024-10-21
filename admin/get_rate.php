<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
 // Set this header last

 include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL query
        $rate_id = $_POST['rate_id'];
        $stmt = $conn->prepare("SELECT
                a.rate_id,
                a.minimum_rate,
                a.second_rate,
                a.third_rate,
                a.last_rate,
                b.property_id,
                b.property_name
            FROM
                property_rate a
            INNER JOIN property b ON a.property_Id = b.property_id
        WHERE rate_id = :rate_id
        ");
        $stmt->bindParam(":rate_id", $rate_id);
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
