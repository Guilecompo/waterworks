<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include the file for database connection
include '../connection.php';

// Log the received POST data
error_log(print_r($_POST, true));

// Check if the required POST parameters are set
if(isset($_POST['add_position'], $_POST['position_id'], $_POST['employee_Id'])) {
    // Sanitize and fetch POST data
    $add_position = $_POST['add_position'];
    $position_id = $_POST['position_id'];
    $employee_Id = $_POST['employee_Id'];
    $date_added = date("Y-m-d");

    try {
        // Check if the new position name already exists
        $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM position WHERE position_name = :add_position AND position_id != :position_id";
        $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
        $checkDuplicateStmt->bindParam(":add_position", $add_position, PDO::PARAM_STR);
        $checkDuplicateStmt->bindParam(":position_id", $position_id, PDO::PARAM_INT);
        $checkDuplicateStmt->execute();
        $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

        if ($result['count'] == 0) {
            // Update the position record
            $sql = "UPDATE position SET position_name = :add_position WHERE position_id = :position_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":position_id", $position_id, PDO::PARAM_INT);
            $stmt->bindParam(":add_position", $add_position, PDO::PARAM_STR);
            
            if ($stmt->execute()) {
                // Record the activity in the activity log
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
                echo json_encode(array("status" => 0, "message" => "Failed to Update Position"));
            }
        } else {
            echo json_encode(array("status" => 0, "message" => "Duplicate entry for position_name"));
        }
    } catch (PDOException $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
    }
} else {
    // Error if required parameters are not provided
    echo json_encode(array("status" => 0, "message" => "Required parameters not provided"));
}

// Close the database connection
$conn = null;
?>
