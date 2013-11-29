<?php
$opts = array('http'=>array('header' => "User-Agent:MyAgent/1.0\r\n"));
$context = stream_context_create($opts);
$header = file_get_contents($_POST['address'],false,$context);
echo $header;
?>