<?php

require_once 'vendor/autoload.php';

$redis = new Predis\Client();



$faker = Faker\Factory::create();

$datas = [];
for($i = 0; $i < 1000; $i++) {
$data = [
    'nama' => $faker->name(),
    'alaat' => $faker->address,
    'pekerjaan' => $faker->jobTitle,
    'CC' => $faker->creditCardNumber(),
];
array_push($datas, $data);
}

// print_r($datas);
print_r(json_decode($redis->get('all')));