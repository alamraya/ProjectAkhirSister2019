<?php

require_once 'vendor/autoload.php';

public function query()
{
	$faker = Faker\Factory()::create();

	$datas = [];

	for ($i=0; $i < 7000 ; $i++) { 
		$data = [
			'nama' => $faker->name,
			'alamat' => $faker->address,
			'email' => $faker->email,
		];
	
		array_push($datas, $data);
	}

	$m = new Memcached;
	$m->addServer('192.168.137.3', 11211);
	$m->set('data', json_encode($datas));

	$redis = new \Predis\Client('192.168.137.2');
	$redis->set('data', json_encode($datas));
}