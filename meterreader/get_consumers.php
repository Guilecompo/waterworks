<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $branchId = $_POST['branchId'];
    $readerId = $_POST['readerId'];
    $currentDate = $_POST['currentDate']; // Get the current date from the client-side

    // Determine the date range based on the current date
    $start_date = date('Y-m-d', strtotime('25th day of this month', strtotime($currentDate)));
    $end_date = date('Y-m-d', strtotime('5th day of next month', strtotime($currentDate)));

    try {
        // Check if the current date falls within the date range
        if ($currentDate >= $start_date || $currentDate <= $end_date) {
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
        } else {
            echo json_encode(["error" => "Data can only be displayed between the 25th and 5th of the month."]);
        }
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
