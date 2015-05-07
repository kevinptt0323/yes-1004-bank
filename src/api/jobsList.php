<?php
require_once('include/include.php');
session_start();

function jobsList() {
	$db = getPDO();
	$favorite = isset($_GET['favorite']);
	$search = "and 1=1";
	if( isset($_GET['search']) ) {
		$search = "";
		if( !empty($_GET['occupation_id']) )
			$search .= "and occupation_id=" . escape($_GET['occupation_id']) . " ";
		if( !empty($_GET['location_id']) )
			$search .= "and location_id=" . escape($_GET['location_id']) . " ";
		if( !empty($_GET['working_time']) )
			$search .= "and working_time='" . escape($_GET['working_time']) . "' ";
		if( !empty($_GET['education']) )
			$search .= "and education='" . escape($_GET['education']) . "' ";
		if( !empty($_GET['experience']) )
			$search .= "and experience=" . escape($_GET['experience']) . " ";
		if( !empty($_GET['salary']) )
			$search .= "and salary=" . escape($_GET['salary']) . " ";
	}
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
					where FAV.user_id=$uid $search
					order by $column $order")->fetchAll(PDO::FETCH_ASSOC);
			} else {
				$list = $db->query("select *,
					exists( select * from application APP where APP.recruit_id=REC.id and APP.user_id=$uid) as apply,
					exists( select * from favorite FAV where FAV.recruit_id=REC.id and FAV.user_id=$uid) as favorite
					from recruit REC
					where 1=1 $search
					order by $column $order")->fetchAll(PDO::FETCH_ASSOC);
			}
		} else {
			$list = $db->query("select * from recruit REC where 1=1 $search order by $column $order")->fetchAll(PDO::FETCH_ASSOC);
		}
		return new Message(Message::$SUCCESS, $list);
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobsList());

?>

