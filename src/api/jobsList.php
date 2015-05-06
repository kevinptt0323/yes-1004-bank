<?php
require_once('include/include.php');
session_start();

function jobsList() {
	$db = getPDO();
	$favorite = isset($_GET['favorite']);
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
		if( isset($_SESSION['user']['type']) && $_SESSION['user']['type'] == "jobseeker" ) {
			$uid = $_SESSION['user']['id'];
			if( $favorite ) {
				$list = $db->query("select REC.*,
					exists( select * from application APP where APP.recruit_id=REC.id and APP.user_id=$uid) as apply,
					exists( select * from favorite FAV where FAV.recruit_id=REC.id and FAV.user_id=$uid) as favorite
					from favorite FAV inner join recruit REC on FAV.recruit_id=REC.id
					where FAV.user_id=$uid
					order by $column $order")->fetchAll(PDO::FETCH_ASSOC);
			} else {
				$list = $db->query("select *,
					exists( select * from application APP where APP.recruit_id=REC.id and APP.user_id=$uid) as apply,
					exists( select * from favorite FAV where FAV.recruit_id=REC.id and FAV.user_id=$uid) as favorite
					from recruit REC order by $column $order")->fetchAll(PDO::FETCH_ASSOC);
			}
		} else {
			$list = $db->query("select * from recruit REC order by $column $order")->fetchAll(PDO::FETCH_ASSOC);
		}
		return new Message(Message::$SUCCESS, $list);
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobsList());

?>

