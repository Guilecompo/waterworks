<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php'; // Ensure this file correctly establishes a PDO connection

// Retrieve query parameters
$branchId = isset($_POST['branch_id']) ? $_POST['branch_id'] : null;

try {
    // Base SQL query
    $query = "
        SELECT
            a.pay_id, a.or_num,
            b.firstname AS emp_firstname, b.middlename AS emp_middlename, b.lastname AS emp_lastname,
            c.user_id, c.meter_no,
            c.firstname AS con_firstname, c.middlename AS con_middlename, c.lastname AS con_lastname,
            d.zone_name, e.barangay_name,
            f.municipality_name,
            DATE_FORMAT(a.pay_date, '%M %d, %Y') AS pay_date,
            a.pay_amount, a.branchId, a.pay_balance
        FROM payment a
        INNER JOIN user_employee b ON a.pay_employeeId = b.user_id
        INNER JOIN user_consumer c ON a.pay_consumerId = c.user_id
        INNER JOIN address_zone d ON c.addressId = d.zone_id
        INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
        INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
    ";
    
    // Add filtering conditions
    $conditions = [];
    $params = [];

    if ($branchId) {
        $conditions[] = "a.branchId = :branchId";
        $params[':branchId'] = $branchId;
    }

    // Append conditions to the query
    if (count($conditions) > 0) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }

    // Add ordering
    $query .= " ORDER BY a.or_num";

    // Debugging: Print query and parameters
    error_log("SQL Query: " . $query);
    error_log("Parameters: " . print_r($params, true));
    
    // Prepare and execute the statement
    $stmt = $conn->prepare($query);
    
    // Bind parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, PDO::PARAM_INT);
    }
    
    $stmt->execute();
    
    // Fetch the results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if data exists and return the JSON response
    if (!empty($results)) {
        echo json_encode($results);
    } else {
        echo json_encode(["error" => "No records found for the specified criteria"]);
    }
} catch (PDOException $e) {
    // Log the error for internal review
    error_log("Database error: " . $e->getMessage());
    
    // Provide a generic error message to the user
    echo json_encode(["error" => "A database error occurred."]);
}
?>
