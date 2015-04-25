<?php
require_once('include/include.php');
session_start();

function newJob($data) {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "employer" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	if( empty($data['occupation_id']) || empty($data['location_id']) || empty($data['working_time']) || empty($data['education']) || empty($data['experience']) || empty($data['salary']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$insert = $db->prepare("insert into `recruit`
	(`employer_id`, `occupation_id`, `location_id`, `working_time`, `education`, `experience`, `salary`) values
	(:eid, :oid, :lid, :work, :edu, :exp, :sal)");
	try {
		$insert->execute(array(
			':eid'  => $_SESSION['user']['id'],
			':oid'  => $data['occupation_id'],
			':lid'  => $data['location_id'],
			':work' => $data['working_time'],
			':edu'  => $data['education'],
			':exp'  => $data['experience'],
			':sal'  => $data['salary']
		));
		return new Message(Message::$SUCCESS, "Insert job successfully.");
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}
function editJob($data) {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "employer" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	if( empty($data['rid']) || empty($data['occupation_id']) || empty($data['location_id']) || empty($data['working_time']) || empty($data['education']) || empty($data['experience']) || empty($data['salary']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$query = $db->prepare("select * from `recruit` where `id` = :rid and `employer_id` = :eid");
	try {
		$query->execute(array(
			':rid' => $data['rid'],
			':eid' => $_SESSION['user']['id']
		));
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
	if( !$query->fetch() ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	$update = $db->prepare("
		update `recruit`
		set occupation_id = :oid,
				location_id = :lid,
				working_time = :work,
				education = :edu,
				experience = :exp,
				salary = :sal
		where id = :rid");
	try {
		$update->execute(array(
			':rid'  => $data['rid'],
			':oid'  => $data['occupation_id'],
			':lid'  => $data['location_id'],
			':work' => $data['working_time'],
			':edu'  => $data['education'],
			':exp'  => $data['experience'],
			':sal'  => $data['salary']
		));
		return new Message(Message::$SUCCESS, "Update job $data[rid] successfully.");
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}
function delete1($data) {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "employer" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	if( empty($data['rid']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$query = $db->prepare("select * from `recruit` where `id` = :rid and `employer_id` = :eid");
	try {
		$query->execute(array(
			':rid' => $data['rid'],
			':eid' => $_SESSION['user']['id']
		));
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
	if( !$query->fetch() ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}

	$delete_sql = $db->prepare("delete from `recruit` where `id` = :rid");
	try {
		$delete_sql->execute(array(':rid' => $data['rid']));
		return new Message(Message::$SUCCESS, "Delete job $data[rid] successfully.");
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

if( isset($_GET['new']) ) {
	echo json_encode(newJob($_POST));
} else if( isset($_GET['edit']) ) {
	echo json_encode(editJob($_POST));
} else if( isset($_GET['delete']) ) {
	echo json_encode(delete1($_POST));
}

?>

