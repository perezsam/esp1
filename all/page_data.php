<?php
//connect config file
include "../connect.php";
//how many videos in one page
$length = 16;
$pageCounter = $_POST['pageCounter'] ;

$start_from = ($pageCounter * $length) - $length;

// Check connection
if ($conn->connect_error) {
    var_dump($conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}else{    
    //$sql = "SELECT * FROM videos WHERE title <> '' and title NOT LIKE '%porn%' ORDER BY video_id DESC LIMIT " . ($_POST['pageCounter'] * $length).",". $length;
         
    $count_videos_sql = "SELECT COUNT(video_id) as total FROM videos ";
    $rows_result = $conn->query($count_videos_sql);

    if (!$rows_result) {
        printf("Errormessage: %s\n", $conn->error);
    }else{
    //there is more than one result
        $total_videos = array();    

        if ($rows_result->num_rows > 0) {
        // get the total videos from the returned row
            while($ount_records = $rows_result->fetch_assoc()) {          
                $total_videos = $ount_records;
            }
        }    
    }

    $sql = "SELECT video_id, title, viewcount, video_tags FROM videos LIMIT " . $start_from . "," . $length;
    $result = $conn->query($sql);

    if (!$result) {
        printf("Errormessage: %s\n", $conn->error);
    }else{
    //there is more than one result
        $send_back_video_info = array();

    if ($result->num_rows > 0) {
    // output data from each row
        while($row = $result->fetch_assoc()) {
          array_push($send_back_video_info, $row);
        }
    }    
        
    }    
}
$conn->close();

// generate server response
$current_page = array('videos' => $send_back_video_info, 'meta' => $total_videos);
echo json_encode($current_page);

?>