<?php
header("Content-Type:application/json; charset=utf-8");
//$POST = json_decode(file_get_contents("php://input"));

//$video_id = $POST->v;
$video_id = '5MgBikgcWnY';



function youtube_Timetext($id) {
    //$url = "http://video.google.com/timedtext?lang=en&v=" . $id;

    $url = 'http://192.168.220.147:3000/api/captions/'.$id.'/en';

    $video_Timetext = file_get_contents($url);

    //echo $video_Timetext;

    if($video_Timetext){
        $subtitles = array();
        $index = 1;

        $xml = json_decode($video_Timetext);        

        foreach($xml as $line){
            $start = floatval($line->start) * 1000;

            //echo $start;

            $end = $start + floatval($line->dur) * 1000; 

            //echo $end;

            $subtitle = array("index"=> $index, "start_time"=> $start, "end_time" => $end, "text" => $line->text);
            array_push($subtitles, $subtitle);
            $index += 1;
        }

        $subtitle_json = json_encode($subtitles);

        echo $subtitle_json;

        $subtitle_array = json_decode($subtitle_json,TRUE);
        
        return $subtitle_array;
    } else {
        return false;
    }    
    
}

function youtube_Title($id) {
	// $id = 'YOUTUBE_ID';
    // returns a single line of JSON that contains the video title.
    $url  =  "https://www.googleapis.com/youtube/v3/videos?id=".$id."&key=AIzaSyC8O_VAWWHLHbStWbX-2wNzr8FrRTkI16w&fields=items(id,snippet(title),statistics)&part=snippet,statistics"; 
    $ch  = curl_init();  
    curl_setopt( $ch , CURLOPT_URL, $url );  
    curl_setopt( $ch , CURLOPT_SSL_VERIFYPEER, false);  
    curl_setopt( $ch , CURLOPT_SSL_VERIFYHOST, false);  
    curl_setopt( $ch , CURLOPT_RETURNTRANSFER, 1);  
    $videoTitle  = curl_exec( $ch );  
	if ($videoTitle) {
		$json = json_decode($videoTitle, true);
		return $json['items'][0]['snippet']['title'];
	} else {
		return false;
	}
}

$title = youtube_Title($video_id);
$timetext = youtube_Timetext($video_id);

/*

$filename = 'json/'.$video_id.'.json';
$fp = fopen($filename, 'w');
fwrite($fp, json_encode($timetext, JSON_PRETTY_PRINT));
fclose($fp);

*/


$status = "Success";
$arr = array('video_id'=> $video_id, 'title'=> $title, 'file' => $video_id.'.json', 'json'=>json_encode($timetext, JSON_PRETTY_PRINT), 'status'=>$status);
//echo json_encode($arr);

// var_dump($title);
// var_dump($timetext);
// var_dump(json_encode($timetext, JSON_PRETTY_PRINT));

/*
$xml = simplexml_load_string($xmlstring);
$json = json_encode($xml);
$array = json_decode($json,TRUE);
var_dump($array);*/

//echo $xml->text[1]['start'];
?>