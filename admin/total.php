
<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prepare and execute the SQL queries
        // total consumers

        $stmt = $conn->prepare("SELECT COUNT(user_id) AS Total_Consumers FROM user_consumer ");
        $stmt->execute();
        $CTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        // total employees
        $stmt = $conn->prepare("SELECT COUNT(user_id) AS Total_Employees FROM user_employee ");
        $stmt->execute();
        $ETotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        // total consumed (pres + prev)
        $stmt = $conn->prepare("SELECT SUM(cubic_consumed) AS Pres_Total_Consumed FROM billing ");
        $stmt->execute();
        $PresConsumedTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT SUM(pay_amount) AS Total_Pay FROM payment ");
        $stmt->execute();
        $PayTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT SUM(total_bill) AS Total_Balance FROM billing ");
        $stmt->execute();
        $BalanceTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);

        $response = [
            "Total_Consumers" => $CTotalresults['Total_Consumers'],
            "Total_Employees" => $ETotalresults['Total_Employees'],
            "Total_Consumed" => $PresConsumedTotalresults['Pres_Total_Consumed'],
            "Total_Pay" => $PayTotalresults['Total_Pay'],
            "Total_Balance" => $BalanceTotalresults['Total_Balance'],
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
