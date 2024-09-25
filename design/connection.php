<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://flutter-login-api.netlify.app"); // Specify your Netlify domain
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = '152.42.243.189';
$dbusername = 'waterworks';
$dbpassword = 'Waterworks2024!';
$database = 'flutter_login';

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $dbusername, $dbpassword);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connection Successful!";
} catch(PDOException $e) {
    die(json_encode(["error" => "Error: " . $e->getMessage()]));
}
?>
