<?php
require_once('include/include.php');
session_start();

function status() {
	$status = array(
		'isLogin' => isset($_SESSION['user']),
	);
	if( $status["isLogin"] ) {
		$status["user"] = $_SESSION['user'];
	}
	return $status;
}

echo json_encode(status());

?>
