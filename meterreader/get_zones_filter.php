<?php
header("Access-Control-Allow-Origin: *");
include 'connection.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log the request method
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);

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
            $sql = "SELECT a.zone_id, a.zone_name, b.barangay_name
                    FROM address_zone a
                    INNER JOIN address_barangay b ON a.barangayId = b.barangay_id
                    WHERE a.barangayId = :branchId AND a.zone_id IN (".implode(',', $zoneIds).")
                    ORDER BY a.zone_name";
            // $sql = "SELECT b.zone_id, b.zone_name, c.barangay_name
            //         FROM branch a
            //         INNER JOIN address_zone b ON a.locationId = b.zone_id
            //         INNER JOIN address_barangay c ON b.barangayId = c.barangay_id
            //         WHERE a.branch_id = :branchId AND b.zone_id IN (".implode(',', $zoneIds).")
            //         ORDER BY b.zone_name";

            $stmt = $conn->prepare($sql);
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
