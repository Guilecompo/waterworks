<?php
header('Content-Type: application/json');

include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL queries
        $accountId = $_POST['accountId'];

        $stmt = $conn->prepare("SELECT SUM(cubic_consumed) AS Pres_Total_Consumed FROM billing WHERE total_bill != 0 AND consumerId = :accountId");
        $stmt->bindParam(":accountId", $accountId);
        $stmt->execute();
        $PresConsumedTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT SUM(pay_amount) AS Total_Pay FROM payment WHERE pay_consumerId = :accountId");
        $stmt->bindParam(":accountId", $accountId);
        $stmt->execute();
        $PayTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        $response = [
            "Total_Consumed" => $PresConsumedTotalresults['Pres_Total_Consumed'],
            "Total_Pay" => $PayTotalresults['Total_Pay'],
        ];

        echo json_encode($response);
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>
