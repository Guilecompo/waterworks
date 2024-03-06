<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// include 'connection.php';
include '../connection.php';


error_log(print_r($_POST, true)); // Log the received POST data

$edited_zone = $_POST['edited_zone'];
$barangayId = $_POST['barangayId'];
$date_added = date("Y-m-d");
$employee_Id = $_POST['employee_Id'];

try {
    // Check if barangay_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM address_zone WHERE zone_name = :edited_zone AND barangayId = :barangayId";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":edited_zone", $edited_zone, PDO::PARAM_STR);
    $checkDuplicateStmt->bindParam(":barangayId", $barangayId, PDO::PARAM_INT);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {
        // If barangay_name doesn't exist, proceed with the update
        $sql = "UPDATE address_zone SET
        zone_name = :edited_zone, 
        barangayId = :barangayId
        WHERE zone_id = :zone_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":zone_id", $_POST['zone_id'], PDO::PARAM_INT);
        $stmt->bindParam(":edited_zone", $_POST['edited_zone'], PDO::PARAM_STR);
        $stmt->bindParam(":barangayId", $_POST['barangayId'], PDO::PARAM_INT);
        if ($stmt->execute()) {
            $activity_type = "Edit";
            $table_name = "Zone";
            $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
            $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmt1->bindParam(":date_added", $date_added);
            $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt1->execute();

            echo json_encode(array("status" => 1, "message" => "Zone Successfully Updated & Added to Activity Log!"));
        } else {
            echo json_encode(array("status" => 0, "message" => "Failed to Updated Zone"));
        }

    } else {
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for zone_name"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
