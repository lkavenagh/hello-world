<?php
$startingCount = 100;
$pass = 'XL_?ngy-aur_';
$ip = $_SERVER['REMOTE_ADDR'];
$caller = explode("/",$_SERVER['HTTP_REFERER']);
$caller = end($caller);
if (empty($caller)) {
	$caller = "index.html";
}
$con = pg_connect("host=127.0.0.1 port=5432 dbname=kavenagh_visitors user=kavenagh_luke password=" . $pass);
$query = "SELECT COUNT(DISTINCT \"IPAddress\") AS Count FROM \"public\".\"Visitors\"";
$result1 = pg_query($con, $query);
$result1 = pg_fetch_row($result1);
$query = "SELECT COUNT(*) AS Count FROM \"public\".\"Visitors\" WHERE \"PageName\" = '" . $caller . "' AND \"IPAddress\" = '" . $ip . "'";
$result2 = pg_query($con, $query);
$result2 = pg_fetch_row($result2);
$query = "SELECT COUNT(DISTINCT \"IPAddress\") AS Count FROM \"public\".\"Visitors\" WHERE \"PageName\" = '" . $caller . "'";
$result3 = pg_query($con, $query);
$result3 = pg_fetch_row($result3);
echo json_encode(array("all" => intval($result1[0]) + $startingCount,
			"user" => intval($result2[0]),
			"page" => intval($result3[0]) + $startingCount));
pg_close($con);
?>
