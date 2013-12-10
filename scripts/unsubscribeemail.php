<?php
$pass = 'XL_?ngy-aur_';
$con = pg_connect("host=127.0.0.1 port=5432 dbname=kavenagh_visitors user=kavenagh_luke password=" . $pass);
$query = "DELETE FROM \"MTAAlertEmails\" WHERE \"EmailAddress\" = '" . $_POST["email"] . "'";
$result = pg_query($con, $query);
echo "Unsubscribed " . $_POST["email"];
pg_close($con);
?>
