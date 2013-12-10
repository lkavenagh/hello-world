<?php
$pass = 'XL_?ngy-aur_';
$date = date('Y-m-d H:i:s');
$caller = explode("/",$_SERVER['HTTP_REFERER']);
	$caller = end($caller);
if (empty($caller)) {
	$caller = "index.html";
}
$con = pg_connect("host=127.0.0.1 port=5432 dbname=kavenagh_visitors user=kavenagh_luke password=" . $pass);
$query = "INSERT INTO \"public\".\"Visitors\" (\"TimeStamp\", \"PageName\", \"IPAddress\") VALUES ('" . $date . "'," . "'" . $caller . "'," . "'" . $_SERVER['REMOTE_ADDR'] . "')";
echo $query;
$result = pg_query($con, $query);
pg_close($con);
?>
