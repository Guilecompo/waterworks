<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'master/src/Exception.php';
require 'master/src/PHPMailer.php';
require 'master/src/SMTP.php';

// 1. establish connection to the database
include("connection.php");

// 2. get the data passed from the client
$email = $_POST['email'];

// 3. Define SQL statement
$sql = "SELECT * FROM user_employee ";
$sql .= "WHERE email = :email";

// 4. define prepared statement
$stmt = $conn->prepare($sql);
$stmt->bindParam(":email", $email);

// 5. execute the command
$returnValue = 0;
$stmt->execute();

if ($stmt->rowCount() > 0) {
    // Email is correct, generate a 6-digit random code
    $randomCode = rand(100000, 999999);

    // Update the code in the database
    $updateSql = "UPDATE user_employee SET code = :code WHERE email = :email";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bindParam(":code", $randomCode);
    $updateStmt->bindParam(":email", $email);

    if ($updateStmt->execute()) {
        // Send the verification code via email
        $mail = new PHPMailer(true);
        try {
            // Server settings
            $mail->SMTPDebug = 0; // Set to 2 for debugging
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; // Add your SMTP host
            $mail->SMTPAuth   = true;
            $mail->Username   = 'kisa.compo.coc@phinmaed.com'; // Add your SMTP username
            $mail->Password   = 'wagdoeendjdtndea'; // Add your SMTP password
            $mail->SMTPSecure = 'ssl';
            $mail->Port       = 465;

            // Recipients
            $mail->setFrom('kisa.compo.coc@phinmaed.com'); // Add your email and name
            $mail->addAddress($email);

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Verification Code';
            $mail->Body    = 'Your verification code is: ' . $randomCode;

            $mail->send();

            $returnValue = array("success" => true, "code" => $randomCode);
        } catch (Exception $e) {
            $returnValue = array("success" => false, "error" => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo);
        }
    } else {
        $returnValue = array("success" => false, "error" => "Failed to update the verification code");
    }
}

echo json_encode($returnValue);
?>
