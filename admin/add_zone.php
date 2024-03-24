<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

// Sanitize and fetch POST data
$barangayId = htmlspecialchars($_POST['barangayId'], ENT_QUOTES, 'UTF-8');
$add_zone = htmlspecialchars($_POST['add_zone'], ENT_QUOTES, 'UTF-8');
$date_added = date("Y-m-d");
$employee_Id = htmlspecialchars($_POST['employee_Id'], ENT_QUOTES, 'UTF-8');

try {
    // Check if zone_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM address_zone WHERE zone_name = :add_zone AND barangayId = :barangayId";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":add_zone", $add_zone, PDO::PARAM_STR);
    $checkDuplicateStmt->bindParam(":barangayId", $barangayId, PDO::PARAM_INT);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {
        // If zone_name doesn't exist, proceed with insertion
        $sql = "INSERT INTO address_zone (zone_name, barangayId, date_added, employee_Id) ";
        $sql .= "VALUES (:add_zone, :barangayId, :date_added, :employee_Id)";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":add_zone", $add_zone, PDO::PARAM_STR);
        $stmt->bindParam(":barangayId", $barangayId, PDO::PARAM_INT);
        $stmt->bindParam(":date_added", $date_added);
        $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

        $returnValue = 0;
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $returnValue = 1;
            $activity_type = "Add";
            $table_name = "Zone";
            $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
            $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmt1->bindParam(":date_added", $date_added);
            $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt1->execute();

            echo json_encode(array("status" => $returnValue, "message" => "Zone Successfully Added & Added to Activity Log!"));
        } else {
            echo json_encode(array("status" => 0, "message" => "Failed to add Zone"));
        }
    } else {
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for zone_name"));
    }
} catch (PDOException $e) {
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
