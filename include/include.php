<?php
require_once("auth.php");
function getPDO() {
	return new PDO("mysql:host=127.0.0.1;charset=UTF8;dbname=".DB, DBUSER, DBPASSWD, array(PDO::ATTR_PERSISTENT=>true));
}
?>
