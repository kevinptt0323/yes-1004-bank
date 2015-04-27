<?php
require_once('include/include.php');
session_start();

function jobseekerList() {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "employer" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	$db = getPDO();
	try {
		$list = $db->query("select `id`, `account`, `education`, `expected_salary`, `phone`, `gender`, `age`, `email` from `user` order by `id`")->fetchAll(PDO::FETCH_ASSOC);
		$specialty_list = $db->query("select user, specialty_id from user_specialty order by id")->fetchAll(PDO::FETCH_ASSOC);
		for($i=0, $j=0, $len1=count($list), $len2=count($specialty_list); $i<$len1 && $j<$len2; $j++) {
			while( $i<$len1 && $list[$i]["account"] != $specialty_list[$j]["user"] ) $i++;
			if( !isset($list[$i]["specialty"]) ) {
				$list[$i]["specialty"] = array();
			}
			array_push($list[$i]["specialty"], $specialty_list[$j]["specialty_id"]);
		}
		return new Message(Message::$SUCCESS, $list);
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobseekerList());

?>

