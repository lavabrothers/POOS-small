<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");
	header("Access-Control-Allow-Credentials: true");

    $inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNum = $inData["phoneNum"];
    $userId = $inData["userId"];

	$conn = new mysqli("localhost", "messenger", "WeLoveCOP4331", "UserData");
	if ($conn->connect_error) {
		returnWithError("Database connection failed: " . $conn->connect_error);
		exit();
	} else {
		
		$stmt = $conn->prepare("INSERT INTO Contacts (First, Last, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phoneNum, $email, $userId);  

		
		if ($stmt->execute()) {
			returnWithInfo($conn->insert_id);
		} else {
			returnWithError("Unable to create contact.");
		}

		$stmt->close();
		$conn->close();
	}

	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($id)
	{
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}

?>