<?php
require_once("auth.php");
function getPDO() {
	try {
		$db = new PDO("mysql:host=127.0.0.1;charset=UTF8;dbname=".DB, DBUSER, DBPASSWD, array(PDO::ATTR_PERSISTENT=>true));
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $db;
	} catch (PDOException $e) {
		echo 'Connection failed: ' . $e->getMessage();
	}
}
function escape(&$data) {
	foreach( $data as &$key ) {
		if( is_string($key) ) {
			$key = htmlspecialchars($key);
		}
	}
}

class Message {
	public $state, $success, $message;
	public static $SUCCESS = "success";
	public static $ERROR = "error";
	public function __construct($_state, $_message) {
		$this->state = $_state;
		$this->success = $_state==self::$SUCCESS;
		$this->message = $_message;
		return $this;
	}
};

?>
