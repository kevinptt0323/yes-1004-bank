<?php
require_once('include/include.php');
session_start();

function registerJobseeker($data) {
	if( empty($data['username']) || empty($data['password']) || empty($data['phone']) || empty($data['gender']) || empty($data['age']) || empty($data['email']) || empty($data['salary']) || empty($data['education']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	escape($data);
	$db = getPDO();
	if( isset($data['specialty']) && !empty($data['specialty']) ) {
		$specialty = array();
		foreach($db->query("select * from `specialty` order by `id`")->fetchAll(PDO::FETCH_ASSOC) as $row) {
			$specialty[$row["id"]] = $row["specialty"];
		}
		for($i=0, $len=count($data['specialty']); $i<$len; $i++) {
			if( $data['specialty'][$i] && !$specialty[$data['specialty'][$i]] ) {
				return new Message(Message::$ERROR, "Invalid specialty id $data[speciailty][$i].");
			}
		}
	}
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
		$insert = $db->prepare("insert into `user` (`account`, `password`, `phone`, `gender`, `age`, `email`, `expected_salary`, `education`) values (:username, sha2(:password, 256), :phone, :gender, :age, :email, :salary, :education)");
		$insert_spe = $db->prepare("insert into `user_specialty` (`user`, `specialty_id`) VALUE (:username, :sid)");
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
			if( isset($data['specialty']) && !empty($data['specialty']) ) {
				for($i=0, $len=count($data['specialty']); $i<$len; $i++) {
					if( $data['specialty'][$i] ) {
						$insert_spe->execute(array(
							':username' => $data['username'],
							':sid'      => $data['specialty'][$i]
						));
					}
				}
			}
			return new Message(Message::$SUCCESS, "Register jobseeker \"$data[username]\" successfully.");
		} catch (PDOException $e) {
			return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
		}
	}
}

echo json_encode(registerJobseeker($_POST));


?>
