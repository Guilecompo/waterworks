<?php
 header('Content-Type: application/json');
 header("Access-Control-Allow-Origin: *");
 
 $host = '	sql303.infinityfree.com';
 $dbusername = '185.27.134.138';
 $dbpassword = 'S2gyyhJcalFV4';
 $database = 'if0_36105237_waterbilling';

  try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $dbusername, $dbpassword);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Connection Successful!";
  } catch(PDOException $e) {
    die("Error: " . $e->getMessage());
  }
?>