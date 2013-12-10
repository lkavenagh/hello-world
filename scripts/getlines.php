<?php
$pass = 'XL_?ngy-aur_';
$con = pg_connect("host=127.0.0.1 port=5432 dbname=kavenagh_visitors user=kavenagh_luke password=" . $pass);
$query = "SELECT \"Name\" FROM \"MTALineNames\"";
echo "<select name='lines'>";
$result = pg_query($con, $query);
while ($row = pg_fetch_row($result)) {
	echo "<option value='" . $row[0] . "'>" . $row[0] . "</option>";
}
echo "</select>";
pg_close($con);
?>
