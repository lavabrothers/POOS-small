<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    
    $inData = getRequestInfo();

    $searchQuery = isset($inData["searchQuery"]) ? "%" . $inData["searchQuery"] . "%" : "%";
    $userId = $inData["userId"];
    
    $searchResults = [];
    $searchCount = 0;
    
    $conn = new mysqli("localhost", "messenger", "WeLoveCOP4331", "UserData");
    
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
 
    
        $stmt = $conn->prepare(" SELECT First, Last, Phone, Email FROM Contacts WHERE UserID = ? AND (First LIKE ? OR Last LIKE ? OR Phone LIKE ? OR Email LIKE ? OR ContID ?) ");
        $stmt->bind_param("isssss", $userId, $searchQuery, $searchQuery, $searchQuery, $searchQuery, $searchQuery);
        $stmt->execute();
    
        $result = $stmt->get_result();
    
        while ($row = $result->fetch_assoc()) {
            $searchCount++;
            $searchResults[] = $row;
        }
    
        if ($searchCount == 0) {
            returnWithError("No Records Found");
        } else {
            returnWithInfo($searchResults);
        }
    
        $stmt->close();
        $conn->close();
    }
    
    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }
    
    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError($err) {
        $retValue = '{"results":[],"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
    function returnWithInfo($searchResults) {
        $retValue = '{"results":' . json_encode($searchResults) . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
