<?php
require_once('include/include.php');
session_start();

function jobsList() {
	$db = getPDO();
	$list = $db->query("select * from `recruit` order by `id`")->fetchAll(PDO::FETCH_ASSOC);
	return $list;
}

echo json_encode(jobsList());

?>

