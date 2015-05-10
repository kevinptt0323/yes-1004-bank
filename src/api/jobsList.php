<?php
require_once('include/include.php');
session_start();

function jobsList() {
	$db = getPDO();
	$favorite = isset($_GET['favorite']);
	$search = "";
	$search_array = array();
	if( isset($_GET['search']) ) {
		if( !empty($_GET['occupation_id']) ) {
			$search .= "and occupation_id=? ";
			array_push($search_array, escape($_GET['occupation_id']));
		}
		if( !empty($_GET['location_id']) ) {
			$search .= "and location_id=? ";
			array_push($search_array, escape($_GET['location_id']));
		}
		if( !empty($_GET['working_time']) ) {
			$search .= "and working_time=? ";
			array_push($search_array, escape($_GET['working_time']));
		}
		if( !empty($_GET['education']) ) {
			$search .= "and education=? ";
			array_push($search_array, escape($_GET['education']));
		}
		if( !empty($_GET['experience']) ) {
			$search .= "and experience=? ";
			array_push($search_array, escape($_GET['experience']));
		}
		if( !empty($_GET['salary']) ) {
			$search .= "and salary>=? ";
			array_push($search_array, escape($_GET['salary']));
		}
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
				$stat = $db->prepare("select REC.*,
					exists( select * from application APP where APP.recruit_id=REC.id and APP.user_id=? ) as apply,
					exists( select * from favorite FAV where FAV.recruit_id=REC.id and FAV.user_id=? ) as favorite
					from recruit REC inner join favorite FAV on FAV.recruit_id=REC.id
					where FAV.user_id=? $search
					order by $column $order");
				$prepare_array = array_merge(array($uid, $uid, $uid), $search_array);
			} else {
				$stat = $db->prepare("select REC.*,
					exists( select * from application APP where APP.recruit_id=REC.id and APP.user_id=? ) as apply,
					exists( select * from favorite FAV where FAV.recruit_id=REC.id and FAV.user_id=? ) as favorite
					from recruit REC
					where 1=1 $search
					order by $column $order");
				$prepare_array = array_merge(array($uid, $uid), $search_array);
			}
		} else {
			$stat = $db->prepare("select * from recruit REC where 1=1 $search order by $column $order");
			$prepare_array = $search_array;
		}
		$stat->execute($prepare_array);
		$list = $stat->fetchAll(PDO::FETCH_ASSOC);
		return new Message(Message::$SUCCESS, $list);
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobsList());

?>

