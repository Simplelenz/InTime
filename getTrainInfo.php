<?php
    header('Access-Control-Allow-Origin: *');
    // header('Content-Type: application/json');
    //open connection to mysql db
    $connection = mysqli_connect("mysql9.000webhost.com","a4676563_root","root123","a4676563_intime") or die("Error " . mysqli_error($connection));

    //fetch table rows from mysql db
    $sql = "SELECT * FROM Train1 ORDER BY Train1.id DESC LIMIT 1";
    $result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

    //create an array
    $train1 = array();

    $trainLat;
    $trainLong;
    $trainSpeed;

    while($row =mysqli_fetch_assoc($result))
    {
        $train1[] = $row;
        $trainLat = $row['lat'];
        $trainLong = $row['lon'];
        $trainSpeed = $row['speed'];
    }
    // echo $trainLat;
    // echo json_encode($train1);
    // echo '{"name":"Hello","version":"World"}';

    //close the db connection
    mysqli_close($connection);

    // $postdata = file_get_contents("php://input");
    // if (isset($postdata)) {
    // $request = json_decode($postdata);
    // $trainStationLat = $request->trainStationLat;
    // $trainStationLong = $result->trainStationLong;
    // }

    $trainStationLat = 6.8622284;
    $trainStationLong = 79.908797;

    function distance($lat1, $lon1, $lat2, $lon2, $unit) {

    $theta = $lon1 - $lon2;
    $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
    $dist = acos($dist);
    $dist = rad2deg($dist);
    $miles = $dist * 60 * 1.1515;
    $unit = strtoupper($unit);

    if ($unit == "K") {
        return ($miles * 1.609344);
    } else if ($unit == "N") {
        return ($miles * 0.8684);
        } else {
            return $miles;
        }
    }
    
    $distance = distance($trainLat, $trainLong, $trainStationLat, $trainStationLong, "K");
    $timeToReach = $distance / $trainSpeed;

    echo '{"id":"01","distance":'; echo round($distance,2); echo ',"timeToReach":';
    echo round($timeToReach,2); echo '}';
    // if ($username != "") {
    // echo "Server returns: " . $username;
    // }
    // else {
    // echo "Empty username parameter!";
    // }
    // }
    // else {
    // echo "Not called properly with username parameter!";
    // }
?>