<?php

require_once 'vendor/autoload.php';

public function redis()
{
	$redis = new \Predis\Client('tcp://192.168.137.2');
	$awal = microtime(true);
	$redis->get('data');
	$akhir = microtime(true) - $awal;
	print_r($akhir);
}