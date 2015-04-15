<?php
require_once('include/include.php');
session_start();

function registerEmployer($data) {
	if( empty($data['username']) || empty($data['password']) || empty($data['phone']) || empty($data['email']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$query_jobseeker = $db->prepare("select count(*) from `user` where `account` = :username");
	$query_employer = $db->prepare("select count(*) from `employer` where `account` = :username");
	try {
		$query_jobseeker->execute(array(':username' => $data['username']));
		$query_employer->execute(array(':username' => $data['username']));
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}

	if( $query_jobseeker->fetch()[0] || $query_employer->fetch()[0] ) {
		return new Message(Message::$ERROR, "Username \"$data[username]\" existed.");
	} else {
		$insert = $db->prepare("insert into `employer` (`account`, `password`, `phone`, `email`) values (:username, sha2(:password, 256), :phone, :email)");
		try {
			$insert->execute(array(
				':username' => $data['username'],
				':password' => $data['password'].SALT,
				':phone'    => $data['phone'],
				':email'    => $data['email']
			));
			return new Message(Message::$SUCCESS, "Register employer \"$data[username]\" successfully.");
		} catch (PDOException $e) {
			return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
		}
	}
}

echo json_encode(registerEmployer($_POST));


?>
