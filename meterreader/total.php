<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get inputs
        $branchId = $_POST['branchId']; // Make sure this is sent in the request
        $readerId = $_SESSION['readerId']; // Or use a POST variable for this if necessary

        // Fetch the zones assigned to the reader
        $stmt = $conn->prepare("SELECT a.zone_Id FROM assign a WHERE a.emp_Id = :readerId");
        $stmt->bindParam(":readerId", $readerId);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$rows) {
            echo json_encode(["error" => "No data found for the given readerId"]);
            exit;
        }

        // Get all zone IDs the reader is assigned to
        $zones = array_column($rows, 'zone_Id');

        // Query to count total consumers in those zones
        $stmt = $conn->prepare("SELECT COUNT(*) as total_consumers
            FROM user_consumer a
            WHERE a.branchId = :branchId
            AND a.addressId IN (" . implode(',', $zones) . ")");
        $stmt->bindParam(":branchId", $branchId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $totalConsumers = $result['total_consumers'];

        // Query to count consumers with billing status not 1 (reading left)
        $stmt = $conn->prepare("SELECT COUNT(*) as total_consumers
            FROM user_consumer a
            WHERE a.branchId = :branchId
            AND a.billing_status != 1
            AND a.addressId IN (" . implode(',', $zones) . ")");
        $stmt->bindParam(":branchId", $branchId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $readingLeft = $result['total_consumers'];

        // Query to calculate total cubic consumed this month
        $stmt = $conn->prepare("SELECT SUM(cubic_consumed) AS totalCubic
            FROM billing
            WHERE readerId = :readerId");
        $stmt->bindParam(":readerId", $readerId, PDO::PARAM_INT);
        $stmt->execute();
        $totalCubicResult = $stmt->fetch(PDO::FETCH_ASSOC);
        $totalCubic = $totalCubicResult['totalCubic'] ? $totalCubicResult['totalCubic'] : 0;

        // Prepare response
        $response = [
            "total_consumers" => $totalConsumers,
            "reading_left" => $readingLeft,
            "total_consumed" => $totalCubic
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
