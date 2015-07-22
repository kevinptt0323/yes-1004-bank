<?php
require_once('include/include.php');
session_start();

function status() {
	$status = array(
		'isLogin' => isset($_SESSION['user']),
	);
	if( $status["isLogin"] ) {
		$status["user"] = $_SESSION['user'];
		$db = getPDO();
		switch ($status["user"]["type"]) {
			case "employer":
				$query = $db->prepare("select phone, email from `employer` where `account` = :username");
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
