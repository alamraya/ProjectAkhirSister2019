<?php

require_once 'vendor/autoload.php';

$redis = new Predis\client();

$faker = Faker\Factory::create();

$datas = [];
for($i = 0; $i < 100000; $i++) {
    $data = [
        'email' => $faker->email(),
        'safeEmail' => $faker->safeEmail(),

    ];
    array_push($datas, $data);
}
print_r(json_decode($redis->get('all')));
