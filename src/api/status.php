<?php
require_once('include/include.php');
session_start();

function status() {
	$status = array(
		'isLogin' => isset($_SESSION['username']),
	);
	if( $status["isLogin"] ) {
		$status["user"] = array(
			'username' => $_SESSION['username'],
			'type' => $_SESSION['type']
		);
	}
	return $status;
}

echo json_encode(status());

?>
