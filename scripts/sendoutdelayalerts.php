<?php
require_once "Mail.php";

$requesturl = 'http://web.mta.info/status/serviceStatus.txt';
$file = file_get_contents($requesturl);
$p = xml_parser_create();
xml_parse_into_struct($p, $file, $vals);
xml_parser_free($p);

$delayedlines = array();
$delayedtext = array();

foreach ($vals as $xml_elem) {
	$x_tag=$xml_elem['tag'];
	$x_level=$xml_elem['level'];
	$x_type=$xml_elem['type'];
	$x_value=$xml_elem['value'];
	if (strlen(trim($x_value))>0) {
		if ($x_tag == "NAME") {$thisname = trim($x_value);};
		if ($x_tag == "TEXT") {$thistext = trim($x_value);};
		if ($x_tag == "STATUS") {
			$thisstatus = trim($x_value);
			if ($thisstatus == "DELAYS") {
				$delayedlines[] = $thisname;
				$delayedtext[] = $thistext;
			}
		}
	}
}
print_r($delayedlines);

foreach ($delayedlines as $lineName) {
	$pass = 'XL_?ngy-aur_';
	$ip = $_SERVER['REMOTE_ADDR'];
	$caller = explode("/",$_SERVER['HTTP_REFERER']);
	$caller = end($caller);
	if (empty($caller)) {
		$caller = "index.html";
	}
	$con = pg_connect("host=127.0.0.1 port=5432 dbname=kavenagh_visitors user=kavenagh_luke password=" . $pass);
	$query = "SELECT \"EmailAddress\" 
		FROM \"public\".\"MTAAlertEmails\" AS a JOIN \"MTALineNames\" AS b 
		ON a.\"MTALineNamesID\" = b.\"ID\" 
		WHERE b.\"Name\" = '" . $lineName . "' 
		AND \"LastEmailTime\" <= now() - interval '1 hour'";
	$result = pg_query($con, $query);
	while ($row = pg_fetch_row($result)) {
		$query = "UPDATE \"MTAAlertEmails\" AS a 
			SET \"LastEmailTime\" = now()
			FROM \"MTALineNames\" AS b
			WHERE a.\"MTALineNamesID\" = b.\"ID\"
			AND \"EmailAddress\" = '" . $row[0] . "' 
			AND b.\"Name\" = '" . $lineName . "'";
		pg_query($con, $query); 
	
		$email = $row[0];
		$subject = "MTA update: The " . $lineName . " line is experiencing delays";
	
		$port = "465";
		$host = "ssl://mail.kavenagh.com";
		$username = "luke@kavenagh.com";
		$password = "Pector88";
	
		$headers = array('From' => "MTA Alert <luke@kavenagh.com>", 'To' => $email, 'Subject' => $subject);
		$smtp = Mail::factory('smtp', 
			array('host' => $host,
			'port' => $port,
			'auth' => true,
			'username' => $username,
			'password' => $password));
		$mail = $smtp->send($email, $headers, $body);
		if (PEAR::isError($mail)) {
		   echo("<p>" . $mail->getMessage() . "</p>");
		}
	}
	pg_close($con);
}
?>
