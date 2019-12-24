<?php

	require_once 'app/init.php';

    $link = mysqli_connect("localhost","root","","sister");
    //var_dump($link);
    if (!$link){
        die("Koneksi gagal: " . mysqli_connect_error());
    }

	if(!empty($_POST)) {
		if(isset($_POST['title'], $_POST['body'], $_POST['keywords'])) {

			$title = $_POST['title'];
			$body = $_POST['body'];
			$keywords = explode(',', $_POST['keywords']);

			$indexed = $es->index([
				'index' => 'articles',
				'type' => 'article',
				'body' => [
					'title' => $title,
					'body' => $body,
					'keywords' => $keywords

				]

			]);

			if($indexed) {
				print_r($indexed);
			}
		}
	}

    if(isset($_POST["submit"])) {
		$title = $_POST["title"];
		$body = $_POST["body"];
		$keywords = $_POST["keywords"];

		$query = "INSERT INTO coba VALUES ('$title', 'body', '$keywords')";

		mysqli_query($link, $query);

		if(mysqli_affected_rows($link) > 0 )
			echo "<script>alert('Data berhasil disimpan!');history.go(-1);</script>";
		else
			echo "<script>alert('Data Gagal Disimpan!');history.go(-1);</script>";
    }

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Tambah</title>

	<link rel="stylesheet" type="text/css" href="css/main.css">
</head>
<body>
	<form action="add.php" method="post" autocomplete="off">
		<label>
			Title : 
			<input type="text" name="title">
		</label>
		<br><br>
		<label>
			Body : 
			<textarea name="body" rows="8"></textarea>
		</label>
		<br><br>
		<label>
			Keywords : 
			<input type="text" name="keywords" placeholder="masukkan kata kunci">
		</label>
		<br>
		<input type="submit" name="submit" value="add">
		
	</form>

</body>
</html>