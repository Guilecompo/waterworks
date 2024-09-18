<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json"); // Set content type to JSON
include 'connection.php';

// Assuming you're using POST method to send data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['readerId'], $_POST['branchId'])) {
        $readerId = $_POST['readerId'];
        $branchId = $_POST['branchId'];

        // Query to get zones assigned to the reader
        $stmt = $conn->prepare("SELECT * FROM assign WHERE emp_Id = :readerId");
        $stmt->bindParam(":readerId", $readerId);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rows) {
            // Fetch zone IDs from the result
            $zoneIds = array_column($rows, 'zone_Id');

            if (!empty($zoneIds)) {
                // Prepare SQL to fetch zones based on 'barangayId' and zone IDs
                $sql = "SELECT a.zone_id, a.zone_name, b.barangay_name
                        FROM address_zone a
                        INNER JOIN address_barangay b ON a.barangayId = b.barangay_id
                        WHERE a.branchId = :branchId AND a.zone_id IN (" . implode(',', array_map('intval', $zoneIds)) . ")
                        ORDER BY zone_name";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(":branchId", $branchId);
                $stmt->execute();
                $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode($returnValue); // Return the zone data as JSON
            } else {
                echo json_encode([]); // No zones found
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
