<?php
  header("Access-Control-Allow-Origin:*");
  include 'connection.php';

  $barangayId = $_POST['barangayId'];
  
  $sql = "SELECT
    a.zone_id,
    a.zone_name,
    b.barangay_name
    FROM address_zone a
    INNER JOIN address_barangay b ON a.barangayId = b.barangay_id
    WHERE a.barangayId = :barangay_Id 
    ORDER BY zone_name";
    
  $stmt = $conn->prepare($sql);
  $stmt->bindParam(":barangay_Id", $barangayId);
  $stmt->execute();
  
  $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : 0;

  echo json_encode($returnValue);
?>