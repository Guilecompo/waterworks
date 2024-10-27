<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $user_id = $_POST['user_id'];
        $stmt = $conn->prepare("SELECT 
                a.user_id,a.meter_no,
                a.firstname, a.middlename,
                a.lastname,a.email,a.house_no,
                a.phone_no, c.property_name,d.zone_id,
                d.zone_name, e.barangay_name,
                f.municipality_name, a.meter_no,
                a.password, g.position_name,
                h.branch_name, i.user_status, j.*
            FROM
                user_consumer a
            INNER JOIN property c ON a.propertyId = c.property_id
            INNER JOIN address_zone d ON a.addressId = d.zone_id
            INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
            INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
            INNER JOIN position g ON a.positionId = g.position_id
            INNER JOIN branch h ON a.branchId = h.branch_id 
            INNER JOIN user_status i ON a.statusId = i.status_id
            INNER JOIN consumer_type j ON a.consumertypeId = j.consumertype_id 
            WHERE a.user_id = :user_id
          ");
            $stmt->bindParam(":user_id", $user_id);
            $stmt->execute();
    
            $results = $stmt->fetchAll();
    
        echo json_encode($results);
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
