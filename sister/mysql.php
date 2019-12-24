<?php

require_once 'vendor/autoload.php';

 $dbhost = "localhost";
 $dbuser = "root";
 $dbpass = "";
 $db = "sister";
 $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);
 
$faker = Faker\Factory::create();

$datas = [];
for($i = 0; $i < 1000; $i++) {
$data = [
    'nama' => $faker->name(),
    'alamat' => $faker->address,
    'pekerjaan' => $faker->jobTitle,
    'cc' => $faker->creditCardNumber(),
];
mysqli_query($conn ,"INSERT INTO sister VALUES('$data[nama]', '$data[alamat]', '$data[pekerjaan]', '$data[cc]')");
// array_push($datas, $data);
}