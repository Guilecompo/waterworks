<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Include the file for database connection
include 'connection.php';

// Check if the add_position parameter is set in the POST request
if(isset($_POST['add_position'])) {
    // Sanitize and fetch POST data
    $add_position = filter_input(INPUT_POST, 'add_position', FILTER_SANITIZE_STRING);
    $date_added = date("Y-m-d");
    $employee_Id = filter_input(INPUT_POST, 'employee_Id', FILTER_VALIDATE_INT);
    $position_statusId = 1; // Assuming this is a default value

    try {
        // Query to check for duplicate position name
        $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM position WHERE position_name = :add_position";
        $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
        $checkDuplicateStmt->bindParam(":add_position", $add_position, PDO::PARAM_STR);
        $checkDuplicateStmt->execute();
        $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

        if ($result['count'] > 0) {
            // Position name already exists, don't insert the data
            echo json_encode(['status' => 0, 'message' => 'Duplicate Position']);
        } else {
            // Define SQL statement for insertion
            $sql = "INSERT INTO position (position_name, date_added, employee_Id, position_statusId) ";
            $sql .= "VALUES (:add_position, :date_added, :employee_Id, :position_statusId)";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":add_position", $add_position, PDO::PARAM_STR);
            $stmt->bindParam(":date_added", $date_added);
            $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt->bindParam(":position_statusId", $position_statusId, PDO::PARAM_INT);
            
            // Execute the prepared statement
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                // Position successfully added
                $activity_type = "Add";
                $table_name = "Position";
                $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
                $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

                $stmt1 = $conn->prepare($sql1);
                $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
                $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
                $stmt1->bindParam(":date_added", $date_added);
                $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
                $stmt1->execute();

                echo json_encode(array("status" => 1, "message" => "Position Successfully Added & Added to Activity Log!"));
            } else {
                // Failed to add position
                echo json_encode(array("status" => 0, "message" => "Failed to add Position"));
            }
        }
    } catch (PDOException $e) {
        // Handle database errors
        echo json_encode(array("status" => 0, "message" => "Database Error: " . $e->getMessage()));
    }
} else {
    // Error if add_position parameter is not provided
    echo json_encode(array("status" => 0, "message" => "Add Position parameter not provided"));
}
?>
