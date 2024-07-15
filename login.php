<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");


include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    $userInfo = null;

    // Check for consumers
    $stmt = $conn->prepare("SELECT 
        a.user_id, a.branchId,a.propertyId,
        a.firstname, a.middlename,
        a.lastname,
        a.phone_no, c.property_name, a.email,
        d.zone_name, e.barangay_name, e.barangay_id,
        f.municipality_name, a.meter_no,
        a.password, g.branch_name, h.position_name
    FROM
    user_consumer a
    INNER JOIN property c ON a.propertyId = c.property_id
    INNER JOIN address_zone d ON a.addressId = d.zone_id
    INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
    INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
    INNER JOIN branch g ON a.branchId = g.branch_id
    INNER JOIN position h ON a.positionId = h.position_id
    WHERE a.meter_no = ? AND a.password = ?");
    
    $stmt->execute([$username, md5($password)]);
    $consumerResult = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($consumerResult) > 0) {
        // User is a consumer
        $consumerInfo = $consumerResult[0];
        $userType = "Consumer";

        // Build the response for consumers
        $response = array(
            "success" => true,
            "usertype" => $userType,
            "userDetails" => $consumerInfo,
            "userId" => $consumerInfo['user_id'], // No need for null check here
        );
            
        // Set session variable indicating user is logged in
        $_SESSION['accountId'] = $consumerInfo['user_id'];
    } else {
        // If the user is not a consumer, check for employee types

        // Get the valid employee positions from the database
        $stmt = $conn->prepare("SELECT DISTINCT position_name FROM position");
        $stmt->execute();
        $positionResult = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $userType = "unknown"; // Initialize to an unknown user type
        $userInfo = null;

        foreach ($positionResult as $position) {
            $stmt = $conn->prepare("SELECT 
                a.*, g.position_name,
                h.*, a.branchId,
                i.user_status, 
                j.barangayId AS barangayIds
            FROM
                user_employee a
                INNER JOIN position g ON a.positionId = g.position_id
                INNER JOIN branch h ON a.branchId = h.branch_id
                INNER JOIN user_status i ON a.statusId = i.status_id
                INNER JOIN address_zone j ON h.locationId = j.zone_id

            WHERE a.email = ? AND a.password = ? AND g.position_name = ?");
            // Assuming you are using plain text passwords (not recommended)
            $stmt->execute([$username, md5($password), $position]);

            $employeeResult = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($employeeResult) > 0) {
                // User is an employee of the current position
                $userInfo = $employeeResult[0];
                $userType = $position;
                break; // Exit the loop when a match is found
            }
        }

        if ($userType !== "unknown") {
            // Build the response based on user type
            $response = array(
                "success" => true,
                "usertype" => $userType,
                "userDetails" => $userInfo,
                "userId" => $userInfo['user_id'], // No need for null check here
            );
            
            // Set session variable indicating user is logged in
            $_SESSION['accountId'] = $userInfo['user_id'];
            
        } else {
            // Check for consumers in user_consumer_branch table
            $stmt = $conn->prepare("SELECT 
                a.user_id, a.branchId,a.propertyId,
                a.firstname, a.middlename,
                a.lastname,
                a.phone_no, c.property_name, a.email,
                d.zone_name, e.barangay_name, e.barangay_id,
                f.municipality_name, a.meter_no,
                a.password, g.branch_name, h.position_name
            FROM
            user_consumer_branch a
            INNER JOIN property c ON a.propertyId = c.property_id
            INNER JOIN address_zone d ON a.addressId = d.zone_id
            INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
            INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
            INNER JOIN branch g ON a.branchId = g.branch_id
            INNER JOIN position h ON a.positionId = h.position_id
            WHERE a.meter_no = ? AND a.password = ?");
            
            $stmt->execute([$username, md5($password)]);
            $consumerBranchResult = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($consumerBranchResult) > 0) {
                // User is a consumer in user_consumer_branch
                $consumerBranchInfo = $consumerBranchResult[0];
                $userType = "Consumer";

                // Build the response for consumers in user_consumer_branch
                $response = array(
                    "success" => true,
                    "usertype" => $userType,
                    "userDetails" => $consumerBranchInfo,
                    "userId" => $consumerBranchInfo['user_id'], // No need for null check here
                );
                    
                // Set session variable indicating user is logged in
                $_SESSION['accountId'] = $consumerBranchInfo['user_id'];
            } else {
                // User does not exist or credentials are incorrect
                $response = array("success" => false, "message" => "Invalid username or password");
                
                // Ensure accountId session variable is empty on failed login
                $_SESSION['accountId'] = 0; // Change this to null to clear session
                
            }
        }
    }

    // Convert the response to JSON and send it back
    echo json_encode($response);
} else {
    // Redirect to login page if accessed directly without POST request
    header('Location: /index.html');
    exit;
}
?>
