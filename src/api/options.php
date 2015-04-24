<?php
require_once('include/include.php');
session_start();

function options() {
	$db = getPDO();
	$options = array();
	$options["occupation"] = array();
	foreach($db->query("select * from `occupation` order by `id`")->fetchAll(PDO::FETCH_ASSOC) as $row) {
		$options["occupation"][$row["id"]] = $row["occupation"];
	}
	$options["location"] = array();
	foreach($db->query("select * from `location` order by `id`")->fetchAll(PDO::FETCH_ASSOC) as $row) {
		$options["location"][$row["id"]] = $row["location"];
	}
	//$options["occupation"] = $db->query("select * from `occupation` order by `id`")->fetchAll(PDO::FETCH_ASSOC);
	//$options["location"] = $db->query("select * from `location` order by `id`")->fetchAll(PDO::FETCH_ASSOC);
	$options["working_time"] = array(
		'Morning',
		'Afternoon',
		'Night'
	);
	$options["education"] = array(
		'Graduate School',
		'Undergraduate School',
		'Senior High School',
		'Junior High School',
		'Elementary School'
	);
	return $options;
}

echo json_encode(options());

?>
