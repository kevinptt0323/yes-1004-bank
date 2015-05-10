<?php
require_once('include/include.php');
session_start();

function newFavorite($data) {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "jobseeker" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	if( empty($data['rid']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$insert = $db->prepare("insert into favorite (user_id, recruit_id) values (?, ?)");
	$find_stat = $db->prepare("select count(*) from favorite where user_id=? and recruit_id=?");
	try {
		$find_stat->execute(array($_SESSION['user']['id'], $data['rid']));
		if( $find_stat->fetch()[0] != 0 ) {
			return new Message(Message::$ERROR, "You've added this job as favorite.");
		} else {
			$insert->execute(array($_SESSION['user']['id'], $data['rid']));
		}
		return new Message(Message::$SUCCESS, "Add new favorite job successfully.");
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

function deleteFavorite($data) {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "jobseeker" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	if( empty($data['rid']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$insert = $db->prepare("delete from favorite where user_id=? and recruit_id=?");
	try {
		$insert->execute(array($_SESSION['user']['id'], $data['rid']));
		return new Message(Message::$SUCCESS, "Remove favorite job successfully.");
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

if( isset($_GET['new']) ) {
	echo json_encode(newFavorite($_POST));
} else if( isset($_GET['delete']) ) {
	echo json_encode(deleteFavorite($_POST));
}

?>


