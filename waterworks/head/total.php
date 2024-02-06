<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL queries
        // total consumers
        $barangayId = $_POST['branchId'];

        $stmt = $conn->prepare("SELECT COUNT(user_id) AS Total_Consumers FROM user_consumer WHERE branchId = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $CTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        // total employees
        $stmt = $conn->prepare("SELECT COUNT(user_id) AS Total_Employees FROM user_employee WHERE positionId NOT IN (1) AND branchId = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $ETotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        // total consumed (pres + prev)
        $stmt = $conn->prepare("SELECT SUM(cubic_consumed) AS Pres_Total_Consumed FROM billing WHERE total_bill != 0 AND branchId = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $PresConsumedTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT SUM(cubic_consumed) AS Prev_Total_Consumed FROM previous_billing WHERE branchId = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $PrevConsumedTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT SUM(pay_amount) AS Total_Pay FROM payment WHERE branchId = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $PayTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        // Combine the results into a single JSON object
        $ConsumedTotal = $PresConsumedTotalresults['Pres_Total_Consumed'] + $PrevConsumedTotalresults['Prev_Total_Consumed'];

        $response = [
            "Total_Consumers" => $CTotalresults['Total_Consumers'],
            "Total_Employees" => $ETotalresults['Total_Employees'],
            "Total_Consumed" => $ConsumedTotal,
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
