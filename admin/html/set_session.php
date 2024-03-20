<?php
// Start session
session_start();

// Check if accountId is sent via POST
if(!isset($_POST['accountId']) || $_SESSION['accountId'] == 0 || empty($_SESSION['accountId'])) {
    // Set accountId in session
    http_response_code(400);
    echo "Error: Account ID not provided.";
    // Respond with success message or any other response if needed
    echo "Session updated successfully.";
    header('Location: /waterworks/');
}
?>
