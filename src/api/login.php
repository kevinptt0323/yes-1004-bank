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
		$jobseeker = $query_jobseeker->fetch();
		$employer  = $query_employer->fetch();
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
	if( $jobseeker ) {
		$_SESSION['user'] = array(
			'name' => $jobseeker["account"],
			'type' => "jobseeker"
		);
		return new Message(Message::$SUCCESS, "Login successful as jobseeker.");
	} else if( $employer ) {
		$_SESSION['user'] = array(
			'name' => $employer["account"],
			'type' => "employer"
		);
		return new Message(Message::$SUCCESS, "Login successful as employer.");
	} else {
		return new Message(Message::$ERROR, "User \"$data[username]\" is not existed or password is incorrect.");
	}
}

echo json_encode(login($_POST));

?>
