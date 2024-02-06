<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
 // Set this header last

 include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL query
        $user_id = $_POST['user_id'];
        $stmt = $conn->prepare("SELECT 
                a.user_id, a.branchId,
                a.firstname, a.middlename,
                a.lastname, a.phone_no,
                a.email, a.provinceName, a.municipalityName, a.barangayName,
                a.username,
                a.password, g.position_name,
                h.branch_id, i.status_id,
                h.branch_name, i.user_status
            FROM
                user_employee a
                INNER JOIN position g ON a.positionId = g.position_id
                INNER JOIN branch h ON a.branchId = h.branch_id
                INNER JOIN user_status i ON a.statusId = i.status_id
        WHERE a.user_id = :user_id
        ");

        $stmt->bindParam(":user_id", $user_id);
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
