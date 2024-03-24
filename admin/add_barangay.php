<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

// Sanitize and fetch POST data
$municipalityId = htmlspecialchars($_POST['municipalityId'], ENT_QUOTES, 'UTF-8');
$add_barangay = htmlspecialchars($_POST['add_barangay'], ENT_QUOTES, 'UTF-8');
$date_added = date("Y-m-d");
$employee_Id = htmlspecialchars($_POST['employee_Id'], ENT_QUOTES, 'UTF-8');

try {
    // Check if barangay_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM address_barangay WHERE barangay_name = :add_barangay AND municipalityId = :municipalityId";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":add_barangay", $add_barangay, PDO::PARAM_STR);
    $checkDuplicateStmt->bindParam(":municipalityId", $municipalityId, PDO::PARAM_STR);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {
        // If barangay_name doesn't exist, proceed with insertion
        $sql = "INSERT INTO address_barangay (barangay_name, municipalityId, date_added, employee_Id) ";
        $sql .= "VALUES (:add_barangay, :municipalityId, :date_added, :employee_Id)";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":add_barangay", $add_barangay, PDO::PARAM_STR);
        $stmt->bindParam(":municipalityId", $municipalityId, PDO::PARAM_INT);
        $stmt->bindParam(":date_added", $date_added);
        $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            $activity_type = "Add";
            $table_name = "Barangay";
            $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
            $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmt1->bindParam(":date_added", $date_added);
            $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt1->execute();

            echo json_encode(array("status" => 1, "message" => "Barangay Successfully Added & Added to Activity Log!"));
        } else {
            echo json_encode(array("status" => 0, "message" => "Failed to add Barangay"));
        }
    } else {
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for barangay_name"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
