<?php
// Include the database connection
include 'connection.php';

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate input
    if (filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($password)) {
        // Prepare and execute the SQL statement
        $stmt = $conn->prepare("SELECT * FROM tbl_users WHERE user_email = :email AND user_password = :password");
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        // Check if a user was found
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Login successful"]);
        } else {
            echo json_encode(["message" => "Invalid email or password"]);
        }
    } else {
        echo json_encode(["message" => "Invalid input"]);
    }
} else {
    echo json_encode(["message" => "Invalid request method"]);
}
?>
