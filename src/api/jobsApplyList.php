<?php
require_once('include/include.php');
session_start();

function jobsApplyList() {
	if( !isset($_SESSION['user']['type']) || $_SESSION['user']['type'] != "employer" ) {
		return new Message(Message::$ERROR, "Permission denied.");
	}
	$db = getPDO();
	try {
		$stat = $db->prepare("select * from recruit where employer_id=?");
		$stat->execute(array($_SESSION['user']['id']));
		$list = $stat->fetchAll(PDO::FETCH_ASSOC);

		$app_stat = $db->prepare("select id, account, education, expected_salary, phone, gender, age, email
			from user inner join application A on A.user_id=user.id
			where A.recruit_id=?");
		$user_spe_stat = $db->prepare("select specialty_id from user_specialty where user_id=?");
		foreach($list as &$job) {
			$app_stat->execute(array($job['id']));
			$job['applicant'] = $app_stat->fetchAll(PDO::FETCH_ASSOC);
			foreach($job['applicant'] as &$jobsk) {
				$user_spe_stat->execute(array($jobsk['id']));
				$jobsk['specialty'] = $user_spe_stat->fetchAll(PDO::FETCH_COLUMN, 0);
			}
		}
		return new Message(Message::$SUCCESS, $list);
	} catch (PDOException $e) {
		return new Message(Message::$ERROR, $e->getMessage() . "<br />Please contact administrator.");
	}
}

echo json_encode(jobsApplyList());

?>


