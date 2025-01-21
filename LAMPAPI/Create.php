<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");
	header("Access-Control-Allow-Credentials: true");

    $inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
	$phoneNum = $inData["phoneNum"];
    $email = $inData["email"];
    $userId = $inData["userId"];

	$conn = new mysqli("localhost", "messenger", "WeLoveCOP4331", "UserData");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error);
	}
	 else 
	 {
		$stmt = $conn->prepare("INSERT INTO Contacts (First, Last, Email, Phone, UserID) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phoneNum, $email, $userId);  
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>