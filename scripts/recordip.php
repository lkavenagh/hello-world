<?php
$pass = 'XL_?ngy-aur_';
$date = date('Y-m-d H:i:s');
$caller = explode("/",$_SERVER['HTTP_REFERER']);
	$caller = end($caller);
if (empty($caller)) {
	$caller = "index.html";
}
$con = mysqli_connect("localhost", "kavenagh_luke", $pass, "kavenagh_visitors");
$query = "INSERT INTO `Visitors` (`TimeStamp`, `PageName`, `IPAddress`) VALUES ('" . $date . "'," . "'" . $caller . "'," . "INET_ATON('" . $_SERVER['REMOTE_ADDR'] . "'))";
echo $query;
$result = mysqli_query($con, $query);
mysqli_close($con);
?>
