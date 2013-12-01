<?php
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $_POST['address']);
    echo curl_exec($ch);
    curl_close($ch);
?>