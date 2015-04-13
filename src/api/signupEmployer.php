<?php
require_once('include/include.php');
session_start();

function signupJobseeker($data) {
	if( empty($data['username']) || empty($data['password']) || empty($data['phone']) || empty($data['email']) ) {
		return new Message(Message::$ERROR, "不能有空白");
	}
	$db = getPDO();
	$query_user = $db->prepare("select count(*) from `employer` where `account` = :username");
	try {
		$query_user->execute(array(':username' => $data['username']));
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage());
	}

	if( $query_user->fetch()[0] == 1 ) {
		return new Message(Message::$ERROR, "User Existed");
	} else {
		$insert = $db->prepare("insert into `employer` (`account`, `password`, `phone`, `email`) values (:username, sha2(:password, 256), :phone, :email)");
		try {
			$insert->execute(array(
				':username' => $data['username'],
				':password' => $data['password'].SALT,
				':phone'    => $data['phone'],
				':email'    => $data['email']
			));
			return new Message(Message::$SUCCESS, "");
		} catch (PDOException $e) {
			return new Message(Message::$ERROR, $e->getMessage());
		}
	}
}

echo json_encode(signupJobseeker($_POST));


?>