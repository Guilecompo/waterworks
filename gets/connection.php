<?php
 header('Content-Type: application/json');
 header("Access-Control-Allow-Origin: *");
 
 $host = 'localhost';
 $dbusername = 'sql6682408';
 $dbpassword = 'U4WyJWDAnY';
 $database = 'sql6682408';

  try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $dbusername, $dbpassword);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Connection Successful!";
  } catch(PDOException $e) {
    die("Error: " . $e->getMessage());
  }
?>