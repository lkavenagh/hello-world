<?php
$startingCount = 100;
$pass = 'XL_?ngy-aur_';
$ip = $_SERVER['REMOTE_ADDR'];
$caller = explode("/",$_SERVER['HTTP_REFERER']);
$caller = end($caller);
if (empty($caller)) {
	$caller = "index.html";
}
$con = mysqli_connect("localhost", "kavenagh_luke", $pass, "kavenagh_visitors");
$query = "SELECT COUNT(DISTINCT `IPAddress`) AS Count FROM `Visitors`";
$result1 = mysqli_query($con, $query);
$result1 = mysqli_fetch_array($result1);
$query = "SELECT COUNT(*) AS Count FROM `Visitors` WHERE PageName = '" . $caller . "' AND INET_NTOA(IPAddress) = '" . $ip . "'";
$result2 = mysqli_query($con, $query);
$result2 = mysqli_fetch_array($result2);
$query = "SELECT COUNT(DISTINCT `IPAddress`) AS Count FROM `Visitors` WHERE PageName = '" . $caller . "'";
$result3 = mysqli_query($con, $query);
$result3 = mysqli_fetch_array($result3);
echo json_encode(array("all" => intval($result1['Count']) + $startingCount,
			"user" => intval($result2['Count']),
			"page" => intval($result3['Count']) + $startingCount));
mysqli_close($con);
?>
