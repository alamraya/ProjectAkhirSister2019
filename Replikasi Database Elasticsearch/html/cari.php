<?php

	require_once 'app/init.php';

	if(isset($_GET['q'])) {
		$q = $_GET['q'];

		$query = $es->search([
			'body' => [
				'query' => [
					'bool' => [
						'should' => [
							'match' => ['title' => $q],
							'match' => ['body' => $q]
						]
					]
				]
			]

		]);


		if($query['hits']['total'] >= 1) {
			$results = $query['hits']['hits'];

		}


	}

?>