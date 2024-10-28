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
        $accountId = htmlspecialchars($_POST['accountId'], ENT_QUOTES, 'UTF-8');
        
        // Prepare and execute the SQL query with the current date and time
        $stmt = $conn->prepare("SELECT a.*, b.*
                                FROM activity_log a
                                INNER JOIN user_employee b ON a.employee_Id = b.user_id
                                INNER JOIN position c ON b.positionId = c.position_id
                                WHERE a.date_added = :currentDateTime AND b.user_id = :accountId
                                ORDER BY a.activity_id");

        $stmt->bindParam(':currentDateTime', $currentDateTime);
        $stmt->bindParam(':accountId', $accountId);
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
