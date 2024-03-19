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
        $stmt = $conn->prepare("SELECT COUNT(user_consumer.user_id) AS Total_Consumers FROM user_consumer INNER JOIN branch ON user_consumer.branchId = branch.branch_id WHERE branch.branch_name = :barangayId");
        // $stmt = $conn->prepare("SELECT COUNT(user_id) AS Total_Consumers FROM user_consumer WHERE branchId = 1");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $CTotalresults = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // total employees
        $stmt = $conn->prepare("SELECT COUNT(user_employee.user_id) AS Total_Employees FROM user_employee INNER JOIN branch ON user_employee.branchId = branch.branch_id WHERE branch.branch_name = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $ETotalresults = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // total consumed (pres + prev)
        $stmt = $conn->prepare("SELECT SUM(billing.cubic_consumed) AS Total_Consumed FROM billing INNER JOIN branch ON billing.branchId = branch.branch_id WHERE branch.branch_name = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $PresConsumedTotalresults = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT SUM(payment.pay_amount) AS Total_Pay FROM payment INNER JOIN branch ON payment.branchId = branch.branch_id WHERE branch.branch_name = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $PayTotalresults = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT SUM(total_bill) AS Total_Balance FROM billing INNER JOIN branch ON billing.branchId = branch.branch_id  WHERE billing_update_statusId = 2 AND branch.branch_name = :barangayId");
        $stmt->bindParam(":barangayId", $barangayId);
        $stmt->execute();
        $BalanceTotalresults = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $response = [
            "Total_Consumers" => $CTotalresults[0]['Total_Consumers'],
            "Total_Employees" => $ETotalresults[0]['Total_Employees'],
            "Total_Consumed" => $PresConsumedTotalresults[0]['Total_Consumed'],
            "Total_Pay" => $PayTotalresults[0]['Total_Pay'],
            "Total_Balance" => $BalanceTotalresults[0]['Total_Balance'],
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