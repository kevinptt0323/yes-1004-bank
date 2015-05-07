<?php
require_once('include/include.php');
session_start();

function jobsApplyList() {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "employer" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	$db = getPDO();
	try {
		$uid = $_SESSION['user']['id'];
		$list = $db->query("select * from recruit where employer_id=$uid")->fetchAll(PDO::FETCH_ASSOC);
		foreach($list as &$job) {
			$job['applicant'] = $db->query("select U.id, U.account, U.education, U.expected_salary, U.phone, U.gender, U.age, U.email
			from application A inner join user U on A.user_id=U.id
			where recruit_id=$job[id]")->fetchAll(PDO::FETCH_ASSOC);
			foreach($job['applicant'] as &$jobsk) {
				$jobsk['specialty'] = $db->query("select specialty_id from user_specialty where user_id=$jobsk[id]")->fetchAll(PDO::FETCH_COLUMN, 0);
			}
		}
		return new Message(Message::$SUCCESS, $list);
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobsApplyList());

?>


