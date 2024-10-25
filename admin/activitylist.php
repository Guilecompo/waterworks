<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
// Set this header last

include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get the current date and time in the desired format
        $currentDateTime = date("Y-m-d");
        
        // Prepare and execute the SQL query with the current date and time
        $stmt = $conn->prepare("SELECT a.*, b.*, DATE_FORMAT(a.date_added, '%d %b %Y') AS formatted_date
                                FROM activity_log a
                                INNER JOIN user_employee b ON a.employee_Id = b.user_id
                                WHERE a.date_added = :currentDateTime
                                ORDER BY a.activity_id");

        $stmt->bindParam(':currentDateTime', $currentDateTime);
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
