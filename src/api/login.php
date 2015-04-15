<?php
require_once('include/include.php');
session_start();

function login($data) {
	if( empty($data['username']) || empty($data['password']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$query_jobseeker = $db->prepare("select * from `user` where `account` = :username and `password` = sha2(:password, 256)");
	$query_employer  = $db->prepare("select * from `employer` where `account` = :username and `password` = sha2(:password, 256)");
	try {
		$query_jobseeker -> execute(array(':username' => $data['username'], ':password' => $data['password'].SALT));
		$query_employer  -> execute(array(':username' => $data['username'], ':password' => $data['password'].SALT));
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}

	if( $query_jobseeker->fetch()[0] ) {
		$_SESSION['username'] = $data['username'];
		$_SESSION['type'] = "jobseeker";
		return new Message(Message::$SUCCESS, "Login successful as jobseeker.");
	} else if( $query_employer->fetch()[0] ) {
		$_SESSION['username'] = $data['username'];
		$_SESSION['type'] = "employer";
		return new Message(Message::$SUCCESS, "Login successful as employer.");
	} else {
		return new Message(Message::$ERROR, "User \"$data[username]\" is not existed or password is incorrect.");
	}
}

echo json_encode(login($_POST));

?>
