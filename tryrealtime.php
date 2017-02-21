<?php
	//include "database.php";
	//include "databaseManagement.php";
$servername = "mysql9.000webhost.com";
$username = "a4676563_root";
$password= "root123";
$dbname = "a4676563_intime";
$width="100px";
$height="100px";
$conn = mysqli_connect($servername,$username,$password);
 if(!mysqli_select_db($conn,$dbname))
 {
	 echo 'Sorry, there is a error in database';
 }





//	if (!empty($_GET['latitude']) && !empty($_GET['longitude']) &&
//		!empty($_GET['time']) &&
//		!empty($_GET['speedOTG'])) {

		//function getParameter($par, $default = null){
		//	if (isset($_GET[$par]) && strlen($_GET[$par])) return $_GET[$par];
		//	elseif (isset($_POST[$par]) && strlen($_POST[$par])) 
		//		return $_POST[$par];
		//	else return $default;
		//}

		//$file = 'gps.txt';
	//	$lat = getParameter("latitude");
	//	$lon = getParameter("longitude");
	//	$time = getParameter("time");
	//	$speed = getParameter("speedOTG");
	//	$userId = getParameter("userId");
	//	$person = $lat.",".$lon.",".$time.",".$speed."%";
    $lat=$_GET['latitude'];
    $lon=$_GET['longitude'];

    // $lat = 234789;
    // $lon = 64726;

    echo $lat;
    echo $lon;

    $lat1 = floatval($lat);
    $lon1 = floatval($lon);

    $lat2 = $lat1/100;
    $lon2 = $lon1/100;

    echo $lat2;
    echo $lon2;
        
        
		$sql="INSERT INTO Train1 (lat,lon,speed) VALUES ('$lat2','$lon2','60') ";
        if (mysqli_query($conn,$sql))
            echo "new record inserted";
            else
        echo "eror";

// $result=mysqli_query($conn,$sql);
		//echo "
			///DATA:\n
			//Latitude: ".$lat."\n
			//Longitude: ".$lon."\n
			//Time: ".$time."\n
			//Satellites: ".$sat."\n
			//Speed OTG: ".$speed."\n
			//Course: ".$course;
		
		//if (!file_put_contents($file, $person, FILE_APPEND | LOCK_EX))
			//echo "\n\t Error saving Data\n";
		//else echo "\n\t Data Save\n";
//echo $person;
		//$databaseManagement="databaseManagement";
		//$databaseManagement::insertIntoLocation($userId, $person);
		//$databaseManagement::updateLocationDetails($userId, $person);//insertIntoLocation
		//echo "soooooooooooooooooooooo cold";
	//}
    ?>