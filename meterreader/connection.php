<?php
 header('Content-Type: application/json');
 header("Access-Control-Allow-Origin: *");
 
 $host = '128.199.232.132';
 $dbusername = 'waterworks';
 $dbpassword = 'Waterworks2024!';
 $database = 'waterbilling';


 date_default_timezone_set('Asia/Manila');

  try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $dbusername, $dbpassword);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Connection Successful!";
  } catch(PDOException $e) {
    die("Error: " . $e->getMessage());
  }
?>