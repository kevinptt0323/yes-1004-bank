<?php
require_once('include/include.php');
session_start();

function options() {
	$db = getPDO();
	$options = array();
	$options["occupation"] = $db->query("select `occupation` from `occupation` order by `id`")->fetchAll(PDO::FETCH_COLUMN, 0);
	$options["location"] = $db->query("select `location` from `location` order by `id`")->fetchAll(PDO::FETCH_COLUMN, 0);
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
