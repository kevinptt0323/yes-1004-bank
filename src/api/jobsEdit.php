<?php
require_once('include/include.php');
session_start();

function newJob($data) {
	if( $_SESSION['user']['type'] != "employer" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	if( empty($data['occupation']) || empty($data['location']) || empty($data['working_time']) || empty($data['education']) || empty($data['experience']) || empty($data['salary']) ) {
		return new Message(Message::$ERROR, "Cannot have empty field.");
	}
	$db = getPDO();
	$insert = $db->prepare("insert into `recruit`
	(`employer_id`, `occupation_id`, `location_id`, `working_time`, `education`, `experience`, `salary`) values
	(:emp_id, :occ_id, :loc_id, :work, :edu, :exp, :sal)");
	try {
		$insert->execute(array(
			':emp_id' => $_SESSION['user']['id'],
			':occ_id' => $data['occupation'],
			':loc_id' => $data['location'],
			':work'   => $data['working_time'],
			':edu'    => $data['education'],
			':exp'    => $data['experience'],
			':sal'    => $data['salary']
		));
		return new Message(Message::$SUCCESS, "Insert job successfully.");
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}
function editJob($data) {
}

if( isset($_GET['new']) ) {
	echo json_encode(newJob($_POST));
} else if( isset($_GET['edit']) ) {
	echo json_encode(editJob($_POST));
}

?>

