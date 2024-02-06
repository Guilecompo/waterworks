<?php
header("Access-Control-Allow-Origin: *");
include 'connection.php';

// Assuming you're using POST method to send data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate if 'readerId' and 'barangayId' are set
    if (isset($_POST['readerId'], $_POST['barangayId'])) {
        $readerId = $_POST['readerId'];
        $barangayId = $_POST['barangayId'];

        // Check if 'readerId' exists in the 'assign' table
        $stmt = $conn->prepare("SELECT emp_Id, zone_Id FROM assign WHERE emp_Id = :readerId");
        $stmt->bindParam(":readerId", $readerId);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rows) {
            // Fetch data based on 'barangayId' and 'zone_Id'
            $sql = "SELECT a.zone_id, a.zone_name, b.barangay_name
                    FROM address_zone a
                    INNER JOIN address_barangay b ON a.barangayId = b.barangay_id
                    WHERE a.barangayId = :barangayId AND a.zone_id = :zoneId
                    ORDER BY zone_name";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":barangayId", $barangayId);

            // Assuming you want to use the first row from the previous query result
            $stmt->bindParam(":zoneId", $rows[0]['zone_Id']);
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
