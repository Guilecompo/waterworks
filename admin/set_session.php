<?php
// Start session
session_start();

// Check if accountId is sent via POST
if(isset($_POST['accountId'])) {
    // Set accountId in session
    $_SESSION['accountId'] = $_POST['accountId'];
    // Respond with success message or any other response if needed
    echo "Session updated successfully.";
} else {
    // Respond with error message if accountId is not sent
    http_response_code(400);
    echo "Error: Account ID not provided.";
}
?>
