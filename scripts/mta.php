<?php
$opts = array('http'=>array('header' => "User-Agent:Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.75 Safari/537.1\r\n"));
$context = stream_context_create($opts);
$header = file_get_contents($_POST['address'],false,$context);
echo $header;
?>