<?php
header("Access-Control-Allow-Origin: *");
include 'connection.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log the request method
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['readerId'], $_POST['branchId'])) {
        $readerId = $_POST['readerId'];
        $branchId = $_POST['branchId'];

        // Log input values
        error_log("readerId: $readerId, branchId: $branchId");

        $stmt = $conn->prepare("SELECT * FROM assign WHERE emp_Id = :readerId");
        $stmt->bindParam(":readerId", $readerId);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rows) {
            $zoneIds = array_column($rows, 'zone_Id');
            if (empty($zoneIds)) {
                echo json_encode([]); // No zones found
                return;
            }

            $zoneIdsPlaceholders = implode(',', array_fill(0, count($zoneIds), '?'));
            $sql = "SELECT c.zone_id, c.zone_name, d.barangay_name
                    FROM branch a
                    INNER JOIN address_zone c ON a.locationId = c.zone_id
                    INNER JOIN address_barangay d ON c.barangayId = d.barangay_id
                    WHERE a.branchId = :branchId AND c.zone_id IN ($zoneIdsPlaceholders)
                    ORDER BY c.zone_name";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":branchId", $branchId);
            $stmt->execute(array_merge([$branchId], $zoneIds));

            $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            echo json_encode($returnValue);
        } else {
            echo json_encode(['error' => 'Reader not found']);
        }
    } else {
        echo json_encode(['error' => 'Invalid parameters']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
