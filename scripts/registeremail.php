<?php
$pass = 'XL_?ngy-aur_';
$con = pg_connect("host=127.0.0.1 port=5432 dbname=kavenagh_visitors user=kavenagh_luke password=" . $pass);
$query = "SELECT \"ID\" FROM \"MTALineNames\" WHERE \"Name\" = '" . $_POST["line"] . "'";
$result = pg_query($con, $query);
$result = pg_fetch_row($result);
$query = "SELECT count(*) AS Count FROM \"MTAAlertEmails\" WHERE \"EmailAddress\" = '" . $_POST["email"] . "' AND \"MTALineNamesID\" = " . $result[0];
$result1 = pg_query($con, $query);
$result1 = pg_fetch_row($result1);
if ($result1[0] == 0) { 
	$query = "INSERT INTO \"MTAAlertEmails\" (\"EmailAddress\", \"MTALineNamesID\") VALUES ('" . $_POST["email"] . "', " . $result[0] . ")";
	pg_query($con, $query);
	echo "Entry created for " . $_POST["email"] . " for line " . $_POST["line"];
} else {
	echo "Entry already exists!";
}
pg_close($con);
?>
