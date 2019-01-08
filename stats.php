<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$servername = "localhost";
$username = "wecitizens_user";
$password = "iChF05zndU";

try {
    $conn = new PDO("mysql:host=$servername;dbname=wecitizens_poldir", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


    $sql =  "SELECT
    CONCAT('2018_be_municipal_be_', replace(localite_menu.postcodes_principal,'.000','')) AS segment_key,
    'electoral_list' AS segment_type,
    CONCAT('be_', replace(e.district,'BE',''), '_', lower(replace(replace(party.abbr,'! &',''),' ','_'))) AS list_key,
    CONCAT('be_politician_', p.id) AS politician_key,
    p.id AS politician_id,
    CONCAT(p.name, ' ', p.surname) AS full_name,
    pic.full_path as img,
    party.abbr AS party,
    e.place as position,
    e.status as status,
    e.questionnaire as has_answered,
    e.id_election AS id_election,
    p.completeness_of_profile AS completeness,
    a.opinion_total_sent AS total_questions,
    a.opinion_total_received AS total_received
FROM
    politician_election e
        JOIN
    politician_job j ON j.id_politician = e.id_politician
        JOIN
    politician p ON p.id = e.id_politician
        LEFT JOIN
    party party ON party.id = e.roll
        LEFT JOIN
    politician_photos pic ON pic.id_politician = e.id_politician
        JOIN
    election ON election.id = e.id_election  
        LEFT JOIN
    localite_menu ON localite_menu.id_gps = election.id_gps 
        LEFT JOIN
    opinions_answers a ON a.id_politician = e.id_politician    
WHERE
    e.id_election >= 16
GROUP BY e.id_politician";


	echo "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css' />";

    foreach($conn->query($sql) as $key => $row) {

        if($key == 0){
            echo "
            <table class='table table-bordered'><tr>";
                        foreach($row as $key => $value){
                            echo "<td>".$key."</td>";
                        }
            echo "</tr>";
        }

		echo "<tr>";
		foreach($row as $key => $value){
			echo "<td>".$value."</td>";
		}
		echo "</tr>";
	}

	echo "</table>";
}
catch(PDOException $e)
{
    echo "Connection failed: " . $e->getMessage();
}