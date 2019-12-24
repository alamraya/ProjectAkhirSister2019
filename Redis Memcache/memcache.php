<?php

public function memcache()
{
	$m = new Memcache;
	$m->addServer('192.168.137.3', 11211);
	$awal = microtime(true);
	$m->get('data');
	$akhir = microtime(true) - $awal;
	print_r($akhir);
}