<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
 // Set this header last

 include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL query
        $consumertype_id = $_POST['consumertype_id'];
        $stmt = $conn->prepare("SELECT
                consumertype_id,
                consumertype,
                discount_percent
            FROM
            consumer_type 
        WHERE consumertype_id = :consumertype_id
        ");
        $stmt->bindParam(":consumertype_id", $consumertype_id);
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
