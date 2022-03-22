<?php
$target_dir = "uploads/";$date = new DateTime();
$target_dir = $target_dir . basename($_SERVER['REMOTE_ADDR']) . "-" . basename($date->getTimestamp()) . ".png";

$data=json_decode(file_get_contents('php://input'),1);
$data = $data['image'];
list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);
$data = base64_decode($data);

file_put_contents($target_dir, $data);

echo("http://esteempy.duckdns.org/pixel-art-maker/" . $target_dir);
?>