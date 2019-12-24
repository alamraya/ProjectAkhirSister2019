<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Pencarian</title>
	<link rel="stylesheet" type="text/css" href="css/main.css">
</head>
<body>
	<form action="index.php" method="get" autocomplete="off">
		<label>
			Cari sesuatu? 
			<input type="text" name="q">
		</label>

		<input type="submit" value="cari">
		
	</form>

	<?php

		require_once 'cari.php';

		if(isset($results)) {
			foreach($results as $r) {
			?>

				<div class="result">
					<a href="#<?php echo $r['_id']; ?>"><?php echo $r['_source'] ['title']; ?></a>
					<div class="result-keywords"><?php echo implode(', ', $r['_source']['keywords'] ); ?></div>
				</div>

			<?php
			}
		}

	?>

</body>
</html>