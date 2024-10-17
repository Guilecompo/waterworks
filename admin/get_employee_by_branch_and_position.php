<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL query
        $branchId = $_POST['branchId']; 
        $selectedPosition = $_POST['selectedPosition']; 
        $stmt = $conn->prepare("SELECT 
                a.*, g.position_name,
                h.branch_name, i.user_status
            FROM
                user_employee a
                INNER JOIN position g ON a.positionId = g.position_id
                INNER JOIN branch h ON a.branchId = h.branch_id
                INNER JOIN user_status i ON a.statusId = i.status_id
        WHERE g.position_name NOT IN ('Admin') AND h.branch_name = :branchId AND g.position_name = :selectedPosition;
        ");

        $stmt->bindParam(":branchId", $branchId);
        $stmt->bindParam(":selectedPosition", $selectedPosition);
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
