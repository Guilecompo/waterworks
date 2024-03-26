<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

error_reporting(E_ALL);
ini_set('display_errors', 1);


include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $reading_date = date('Y-m-d');
        $currentDay = date('d');

        // Check if the current day is between 25th and 5th
        if ($currentDay < 25 && $currentDay > 5) {
            echo json_encode(["error" => "Data can only be displayed between the 25th and 5th of the month."]);
            exit; // Stop further execution
        }

        echo "Current Day: " . $currentDay . "<br>";
        $dayOfWeek = date('N', strtotime($reading_date));
        echo "Day of Week: " . $dayOfWeek . "<br>";

        // Check if it's Saturday (6) or Sunday (7)
        if ($dayOfWeek >= 6) {
            echo json_encode(["error" => "No work on weekends!"]);
            exit; // Stop further execution
        }

        $branchId = $_POST['branchId'];
        $readerId = $_POST['readerId'];

        $stmt = $conn->prepare("SELECT 
            a.emp_Id, a.zone_Id
        FROM
            assign a
        WHERE a.emp_Id = :readerId
        ");
        $stmt->bindParam(":readerId", $readerId);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rows) {
            $zones = array_column($rows, 'zone_Id'); 

            $stmt = $conn->prepare("SELECT 
                a.user_id, a.branchId,
                a.firstname, a.middlename,
                a.lastname,a.connected_number,
                a.phone_no, c.property_name,
                d.zone_name, e.barangay_name,
                f.municipality_name, a.meter_no,
                a.password, g.position_name,
                h.branch_name, i.user_status
            FROM
                user_consumer a
            INNER JOIN property c ON a.propertyId = c.property_id
            INNER JOIN address_zone d ON a.addressId = d.zone_id
            INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
            INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
            INNER JOIN position g ON a.positionId = g.position_id
            INNER JOIN branch h ON a.branchId = h.branch_id 
            INNER JOIN user_status i ON a.statusId = i.status_id
            WHERE a.branchId = :branchId AND a.billing_status != 1 AND a.addressId IN (" . implode(',', $zones) . ")
            ORDER BY a.house_no ASC
            ");
            $stmt->bindParam(":branchId", $branchId, PDO::PARAM_INT);
            $stmt->execute();

            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($results);
            
        } else {
            echo json_encode(["error" => "No data found for the given readerId"]);
        }
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
