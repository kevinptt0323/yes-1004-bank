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
		return $list;
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobseekerList());

?>

