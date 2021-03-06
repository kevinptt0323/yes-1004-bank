<?php
require_once('include/include.php');
session_start();

function newApply($data) {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "jobseeker" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	if( empty($data['rid']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$insert = $db->prepare("insert into application (user_id, recruit_id) values (?, ?)");
	$find_stat = $db->prepare("select count(*) from application where user_id=? and recruit_id=?");
	try {
		$find_stat->execute(array($_SESSION['user']['id'], $data['rid']));
		$find = $find_stat->fetch();
		if( !$find || $find[0] != 0 ) {
			return new Message(Message::$ERROR, "You've applied this recruit, please be patient.");
		} else {
			$insert->execute(array($_SESSION['user']['id'], $data['rid']));
		}
		return new Message(Message::$SUCCESS, "Apply new job successfully.");
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

function deleteApply($data) {
}

if( isset($_GET['new']) ) {
	echo json_encode(newApply($_POST));
} else if( isset($_GET['delete']) ) {
	echo json_encode(deleteApply($_POST));
}

?>


