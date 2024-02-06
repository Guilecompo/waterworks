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

// 3. Define SQL statement for user_consumer
$sqlConsumer = "SELECT * FROM user_consumer ";
$sqlConsumer .= "WHERE email = :email";

// 4. define prepared statement for user_consumer
$stmtConsumer = $conn->prepare($sqlConsumer);
$stmtConsumer->bindParam(":email", $email);

// 5. execute the command for user_consumer
$returnValue = 0;
$stmtConsumer->execute();

if ($stmtConsumer->rowCount() > 0) {
    // Email is correct, generate a 6-digit random code
    $randomCode = rand(100000, 999999);

    // Update the code in the database for user_consumer
    $updateSqlConsumer = "UPDATE user_consumer SET code = :code WHERE email = :email";
    $updateStmtConsumer = $conn->prepare($updateSqlConsumer);
    $updateStmtConsumer->bindParam(":code", $randomCode);
    $updateStmtConsumer->bindParam(":email", $email);

    if ($updateStmtConsumer->execute()) {
        // Send the verification code via email
        $mail = new PHPMailer(true);
        try {
            // Server settings
            $mail->SMTPDebug = 0; // Set to 2 for debugging
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; // Add your SMTP host
            $mail->SMTPAuth   = true;
            $mail->Username   = 'kisa.compo.coc@phinmaed.com'; // Add your SMTP username
            $mail->Password   = 'ymyubmbnfwuuiwry'; // Add your SMTP password
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
        $returnValue = array("success" => false, "error" => "Failed to update the verification code for user_consumer");
    }
} else {
    // If not found in user_consumer, check in user_employee
    // Define SQL statement for user_employee
    $sqlEmployee = "SELECT * FROM user_employee ";
    $sqlEmployee .= "WHERE email = :email";

    // Define prepared statement for user_employee
    $stmtEmployee = $conn->prepare($sqlEmployee);
    $stmtEmployee->bindParam(":email", $email);

    // Execute the command for user_employee
    $stmtEmployee->execute();

    if ($stmtEmployee->rowCount() > 0) {
        // Email is correct, generate a 6-digit random code for user_employee
        $randomCode = rand(100000, 999999);

        // Update the code in the database for user_employee
        $updateSqlEmployee = "UPDATE user_employee SET code = :code WHERE email = :email";
        $updateStmtEmployee = $conn->prepare($updateSqlEmployee);
        $updateStmtEmployee->bindParam(":code", $randomCode);
        $updateStmtEmployee->bindParam(":email", $email);

        if ($updateStmtEmployee->execute()) {
            // Send the verification code via email for user_employee
            $mail = new PHPMailer(true);
            try {
                // Server settings
                $mail->SMTPDebug = 0; // Set to 2 for debugging
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com'; // Add your SMTP host
                $mail->SMTPAuth   = true;
                $mail->Username   = 'kisa.compo.coc@phinmaed.com'; // Add your SMTP username
                $mail->Password   = 'ymyubmbnfwuuiwry'; // Add your SMTP password
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
            $returnValue = array("success" => false, "error" => "Failed to update the verification code for user_employee");
        }
    } else {
        $returnValue = array("success" => false, "error" => "Email not found in user_consumer and user_employee");
    }
}

echo json_encode($returnValue);
?>
