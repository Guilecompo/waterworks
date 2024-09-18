<?php
header("Access-Control-Allow-Origin: *");
include 'connection.php';

// Assuming you're using POST method to send data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate if 'readerId' and 'barangayId' are set
    if (isset($_POST['readerId'], $_POST['branchId'])) {
        $readerId = $_POST['readerId'];
        $barangayId = $_POST['branchId'];

        // Check if 'readerId' exists in the 'assign' table
        $stmt = $conn->prepare("SELECT * FROM assign WHERE emp_Id = :readerId");
        $stmt->bindParam(":readerId", $readerId);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rows) {
            // Fetch all zones associated with the reader ID and barangay ID
            $zoneIds = array_column($rows, 'zone_Id');

            // Fetch data based on 'barangayId' and 'zone_Id' from the list of zone IDs
            // $sql = "SELECT a.zone_id, a.zone_name, b.barangay_name
            //         FROM address_zone a
            //         INNER JOIN address_barangay b ON a.barangayId = b.barangay_id
            //         WHERE a.barangayId = :barangayId AND a.zone_id IN (".implode(',', $zoneIds).")
            //         ORDER BY zone_name";
            $sql = "SELECT c.zone_id, c.zone_name, d.barangay_name
                    FROM branch a
                    INNER JOIN address_zone c ON a.locationId = c.zone_id
                    INNER JOIN address_barangay d ON c.barangayId = d.barangay_id
                    WHERE a.emp_Id = :readerId AND a.branchId = :branchId AND c.zone_id IN (".implode(',', $zoneIds).")
                    ORDER BY c.zone_name";

            $stmt = $conn->prepare($sql);
            // $stmt->bindParam(":readerId", $readerId);
            $stmt->bindParam(":branchId", $branchId);
            $stmt->execute();

            $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            echo json_encode($returnValue);
        } else {
            // Handle the case where 'readerId' doesn't exist
            echo json_encode(['error' => 'Reader not found']);
        }
    } else {
        // Handle the case where 'readerId' or 'barangayId' is not set
        echo json_encode(['error' => 'Invalid parameters']);
    }
} else {
    // Handle the case where the request method is not POST
    echo json_encode(['error' => 'Invalid request method']);
}
?>
