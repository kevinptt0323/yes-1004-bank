<?php
require_once('include/include.php');
session_start();

function signupEmployer($data) {
	var_dump($data);
}

echo signupEmployer($_POST);


?>
