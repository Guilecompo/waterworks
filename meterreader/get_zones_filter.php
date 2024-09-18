<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json"); // Set content type to JSON
include 'connection.php';

// Assuming you're using POST method to send data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['readerId'], $_POST['branchId'])) {
        $readerId = $_POST['readerId'];
        $branchId = $_POST['branchId'];

        $stmt = $conn->prepare("SELECT * FROM assign WHERE emp_Id = :readerId");
        $stmt->bindParam(":readerId", $readerId);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rows) {
            $zoneIds = array_column($rows, 'zone_Id');

            if (!empty($zoneIds)) {
                $sql = "SELECT a.zone_id, a.zone_name, b.barangay_name
                        FROM address_zone a
                        INNER JOIN address_barangay b ON a.barangayId = b.barangay_id
                        WHERE a.barangayId = :branchId AND a.zone_id IN (".implode(',', array_map('intval', $zoneIds)).")
                        ORDER BY zone_name";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(":branchId", $branchId);
                $stmt->execute();
                $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode($returnValue);
            } else {
                echo json_encode([]);
            }
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
