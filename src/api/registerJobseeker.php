<?php
require_once('include/include.php');
session_start();

function signupJobseeker($data) {
	if( empty($data['username']) || empty($data['password']) || empty($data['phone']) || empty($data['gender']) || empty($data['age']) || empty($data['email']) || empty($data['salary']) || empty($data['education']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$query_user = $db->prepare("select count(*) from `user` where `account` = :username");
	try {
		$query_user->execute(array(':username' => $data['username']));
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}

	if( $query_user->fetch()[0] == 1 ) {
		return new Message(Message::$ERROR, "User Existed");
	} else {
		$insert = $db->prepare("insert into `user` (`account`, `password`, `phone`, `gender`, `age`, `email`, `expected_salary`, `education`) values (:username, sha2(:password, 256), :phone, :gender, :age, :email, :salary, :education)");
		try {
			$insert->execute(array(
				':username'  => $data['username'],
				':password'  => $data['password'].SALT,
				':phone'     => $data['phone'],
				':gender'    => $data['gender'],
				':age'       => $data['age'],
				':email'     => $data['email'],
				':salary'    => $data['salary'],
				':education' => $data['education']
			));
			return new Message(Message::$SUCCESS, "Register jobseeker \"$data[username]\" successfully.");
		} catch (PDOException $e) {
			return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
		}
	}
}

echo json_encode(signupJobseeker($_POST));


?>
