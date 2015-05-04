<?php
require_once('include/include.php');
session_start();

function jobsList() {
	$db = getPDO();
	try {
		if( isset($_GET['row']) && isset($_GET['order']) ) {
			if( $_GET['order'] == "ascending" ) {
				$order = "asc";
			} else if( $_GET['order'] == "descending" ) {
				$order = "desc";
			}
			$list = $db->query("select * from `recruit` order by $_GET[row] $order")->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$list = $db->query("select * from `recruit` order by `id`")->fetchAll(PDO::FETCH_ASSOC);
		}
		return new Message(Message::$SUCCESS, $list);
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobsList());

?>

