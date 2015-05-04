<?php
require_once('include/include.php');
session_start();

function jobsList() {
	$db = getPDO();
	if( isset($_GET['column']) && isset($_GET['order']) ) {
		$column = $_GET['column'];
		if( $column != "salary" ) {
			return new Message(Message::$ERROR, "Invalid Parameters.");
		}
		if( $_GET['order'] == "ascending" ) {
			$order = "asc";
		} else if( $_GET['order'] == "descending" ) {
			$order = "desc";
		} else {
			return new Message(Message::$ERROR, "Invalid Parameters.");
		}
	} else {
		$column = "id";
		$order = "asc";
	}
	try {
		$list = $db->query("select * from `recruit` order by $column $order")->fetchAll(PDO::FETCH_ASSOC);
		return new Message(Message::$SUCCESS, $list);
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobsList());

?>

