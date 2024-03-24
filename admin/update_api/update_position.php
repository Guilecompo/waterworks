<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// include 'connection.php';
include '../connection.php';


error_log(print_r($_POST, true)); // Log the received POST data

$add_position = htmlspecialchars($_POST['add_position'], ENT_QUOTES, 'UTF-8');
$date_added = date("Y-m-d");
$employee_Id = $_POST['employee_Id'];

try {
    // Check if barangay_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM position WHERE position_name = :add_position";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":add_position", $add_position, PDO::PARAM_STR);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {

        $sql = "UPDATE position SET
        position_name = :add_position
        WHERE position_id = :position_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":position_id", $_POST['position_id'], PDO::PARAM_INT);
        $stmt->bindParam(":add_position", $_POST['add_position'], PDO::PARAM_STR);
        if ($stmt->execute()) {
            $activity_type = "Edit";
            $table_name = "Position";
            $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
            $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmt1->bindParam(":date_added", $date_added);
            $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt1->execute();

            echo json_encode(array("status" => 1, "message" => "Position Successfully Updated & Added to Activity Log!"));
        } else {
            echo json_encode(array("status" => 0, "message" => "Failed to Updated Position"));
        }

    } else {
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for position_name"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
