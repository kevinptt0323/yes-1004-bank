<?php
require_once('include/include.php');
session_start();

function status() {
	$status = array(
		'isLogin' => isset($_SESSION['user']),
		'jobs' => array()
	);
	$db = getPDO();
	$status["jobs"]["all"] = $db->query("select count(*) from `recruit`")->fetch()[0];
	if( $status["isLogin"] ) {
		$status["user"] = $_SESSION['user'];
		switch ($status["user"]["type"]) {
			case "employer":
				$query = $db->prepare("select phone, email from `employer` where `account` = :username");
				$status["jobs"]["my"] = $db->query("select count(*) from `recruit` where `employer_id` = " . $status["user"]["id"])->fetch()[0];
				$status["jobseekers"] = array();
				$status["jobseekers"]["all"] = $db->query("select count(*) from `user`")->fetch()[0];
				break;
			case "jobseeker":
				$query = $db->prepare("select phone, email from `user` where `account` = :username");
				break;
		}
		$query->execute(array(':username' => $status["user"]["name"]));
		$status["user"] = array_merge($status["user"], $query->fetch(PDO::FETCH_ASSOC));
	}
	return new Message(Message::$SUCCESS, $status);
}

echo json_encode(status());

?>
