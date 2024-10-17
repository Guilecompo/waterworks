<?php
// Include the database connection file
require 'connection.php'; // Ensure this file sets up your database connection

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Initialize response array
$response = array("status" => 0); // Default response status

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve input data from the form
    $firstname = isset($_POST['firstname']) ? $_POST['firstname'] : '';
    $middlename = isset($_POST['middlename']) ? $_POST['middlename'] : '';
    $lastname = isset($_POST['lastname']) ? $_POST['lastname'] : '';
    $suffixId = isset($_POST['suffixId']) ? $_POST['suffixId'] : '';
    $phone = isset($_POST['phone']) ? $_POST['phone'] : '';
    $email_add = isset($_POST['email_add']) ? $_POST['email_add'] : '';
    $provinceNames = isset($_POST['provinceNames']) ? $_POST['provinceNames'] : '';
    $municipalityNames = isset($_POST['municipalityNames']) ? $_POST['municipalityNames'] : '';
    $barangayNames = isset($_POST['barangayNames']) ? $_POST['barangayNames'] : '';
    $branchId = isset($_POST['branchId']) ? $_POST['branchId'] : '';
    $positionId = isset($_POST['positionId']) ? $_POST['positionId'] : '';
    $employee_Id = isset($_POST['employee_Id']) ? $_POST['employee_Id'] : '';

    // Check for duplicates based on phone or email
    $duplicateCheckStmt = $conn->prepare("SELECT * FROM employees WHERE phone = :phone OR email = :email");
    $duplicateCheckStmt->bindParam(':phone', $phone);
    $duplicateCheckStmt->bindParam(':email', $email_add);
    $duplicateCheckStmt->execute();

    if ($duplicateCheckStmt->rowCount() > 0) {
        // If a duplicate is found, return a status indicating this
        $response["status"] = -1; // Duplicate status
    } else {
        // Prepare the SQL statement to insert a new employee
        $stmt = $conn->prepare("INSERT INTO employees (firstname, middlename, lastname, suffix, phone, email, province, municipality, barangay, branch, position, added_by) 
                                 VALUES (:firstname, :middlename, :lastname, :suffix, :phone, :email, :province, :municipality, :barangay, :branch, :position, :added_by)");

        // Bind parameters to the prepared statement
        $stmt->bindParam(':firstname', $firstname);
        $stmt->bindParam(':middlename', $middlename);
        $stmt->bindParam(':lastname', $lastname);
        $stmt->bindParam(':suffix', $suffixId);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':email', $email_add);
        $stmt->bindParam(':province', $provinceNames);
        $stmt->bindParam(':municipality', $municipalityNames);
        $stmt->bindParam(':barangay', $barangayNames);
        $stmt->bindParam(':branch', $branchId);
        $stmt->bindParam(':position', $positionId);
        $stmt->bindParam(':added_by', $employee_Id);

        // Execute the statement and check if it was successful
        if ($stmt->execute()) {
            // Log the activity
            $logStmt = $conn->prepare("INSERT INTO activity_log (activity, employee_id, timestamp) VALUES (:activity, :employee_id, NOW())");
            $activity = "Added new employee: $firstname $lastname";
            $logStmt->bindParam(':activity', $activity);
            $logStmt->bindParam(':employee_id', $employee_Id);
            $logStmt->execute();

            $response["status"] = 1; // Success status
        } else {
            $response["status"] = 0; // Failure status
        }
    }
}

// Return the response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
?>
