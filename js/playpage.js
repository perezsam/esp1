// global variables
var player;
var timeoutMillsec = 0;
var timer;
var stopTime = -1;
var startTime = -1;
var subClicked = false;
var v_id;
var v_id_arr;
var s_id = -1; // colored sub id
var url;
var repeat = false;
var subtitleControls = false;

// get video id
request_url = window.location.href;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

p_id = getParameterByName('playlist_id',request_url);

v_id = getParameterByName('video_id',request_url);
if(p_id != null && v_id == null){
    get_1st_id(p_id);
}

// load video subtitles
var content = null;
var spanishContent = null;
var es_cc = null;

// initial youtube iframe api
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: v_id,
        playerVars: {playsinline: 1},        
        events: {
            //'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    
}

function onPlayerStateChange(event) {
    clearTimeout(timer);
    if (event.data == YT.PlayerState.PLAYING) {
        var currentTime = player.getCurrentTime();
        
        if (currentTime * 1000 >= startTime && currentTime * 1000 <= stopTime) {
            
            timeoutMillsec = stopTime - currentTime * 1000;

            if (subClicked) {
                if (repeat) {
                    timer = setTimeout(repeatVideo, timeoutMillsec);
                } else {
                    timer = setTimeout(pauseVideo, timeoutMillsec);
                }
            }
        } else {
            subClicked = false;

            id = whichSub(currentTime * 1000);
            stopTime = content[id]["end_time"];
            timeoutMillsec = stopTime - currentTime * 1000;

            // current subtitle
            currentSubtitle(id);
            CC_Button();            

            colorSub(id);
            scrollSub(id);
            timer = setTimeout(function() { sequenceSub(id + 1); }, timeoutMillsec);
        }
        
    }
}

// turn on/off english subtitles
$(document).on('click', '#hideshow_en', function() {
    $('#en_caption').fadeToggle();
    //console.log(this)
    $(this).toggleClass("default-color");
    
});

// turn on/off spanish subtitles
$(document).on('click', '#hideshow_es', function() {
    $('#es_caption').fadeToggle();
    //console.log(this)
    $(this).toggleClass("default-color");
});

// load en/es subtitle controls
function CC_Button () {    
    if (subtitleControls == false) {
        //if (spanishContent.length == content.length){
        if (es_cc == 1){
            console.log("es_cc = 1")
            var divContent =  
                    '<button type="button" class="btn btn-default btn-xs" id="hideshow_en">' +
                        '<span class="glyphicon glyphicon-subtitles" aria-hidden="true"></span> ES' +
                    '</button> ' +                
                    '<button type="button" class="btn btn-default btn-xs btn-xs" id="hideshow_es">' +
                        '<span class="glyphicon glyphicon-subtitles" aria-hidden="true"></span> 中文' +
                    '</button>';
            $("#cc_buttons").append(divContent);
            subtitleControls = true;
    
        }else{            
            console.log("es_cc != 1")
            var divContent = 
                '<button type="button" class="btn btn-default btn-xs" id="hideshow_en">' +
                    '<span class="glyphicon glyphicon-subtitles" aria-hidden="true"></span> ES' +
                '</button> ';
            $("#cc_buttons").append(divContent);
            subtitleControls = true;
        }
    }        
}

// listen if subtitle is clicked
$(document).on('click', '.subtitle', function() {
    startTime = content[this.id]["start_time"]
    stopTime = content[this.id]["end_time"]
    subClicked = true;
    colorSub(this.id);

    currentSubtitle(this.id);

    scrollSub(this.id);   

    clearTimeout(timer);
    player.pauseVideo();
    player.seekTo(startTime / 1000);
    player.playVideo();
});

// Dinamic video script loading on scroll
var container = '#items';
var limit = 20;
var start = 1;

function loadData(start) {
    var data = content;
    //console.log(content)

    for ( var i = start * limit - limit,j = i + limit; i < j; i++ ) {
        var item = data[i];

        if (item) {
            //console.log(item)
            $("#items").append("<tr><td>" + "<a id='" + i + "'' class='subtitle' href='#' >" + "<i class='far fa-play-circle fa-lg'></i>" + "</a></td>" + "<td><a id='" + i + "'' class='subtitle' href='#' ><span id='subtitle_text_" + i + "' >" + content[i].text + "</span></a></td></tr>");
        } else {
            break;
        }
        
    }
    start++;
    //console.log(start);
    if ( $(container).height() < $('.test').height() ) {
        loadData(start);
    }
    
}


// listen if video transcript div is scrolled
$(".test").scroll(function () {
    var wrap = this;

    if (wrap.scrollTop + wrap.clientTop >= wrap.offsetHeight/4) {
        //console.log('Add more captions');
        start++;
        loadData(start);
    } 

});

// print current subtitle below video player
function currentSubtitle (subtitleId){    
    
    $("#en_caption").html('<big>' + content[subtitleId].text + '</big>');

    //handles spanish subtitles printing 
    //if(spanishContent.length == content.length){
    if(es_cc == 1){
        $("#es_caption").html('<big>' + spanishContent[subtitleId].text + '</big>');
    }  
   
}

// handle subtitles highlighting color
function colorSub(new_id) {
    if (s_id != -1) {
        $("#subtitle_text_" + s_id).css("background-color", "");
    }
    $("#subtitle_text_" + new_id).css("background-color", "#ccc");
    s_id = new_id;
}

// pause video
function pauseVideo() {
    player.pauseVideo();
    subClicked = false;
}

// repeat video
function repeatVideo() {
    player.pauseVideo();
    player.seekTo(startTime / 1000);
    player.playVideo();
}

// find sub id by time
function whichSub(currentTime) {
    var time = 0;
    var id = 0;
    while (time < currentTime) {
        time = content[id]["end_time"];
        id += 1;
    }
    id -= 1;
    return id
}

// sequency change sub color by time
function sequenceSub(id) {

    startTime2 = player.getCurrentTime()*1000;

    startTime = content[id]["start_time"];    

    stopTime = content[id]["end_time"];
    

    timeoutMillsec = stopTime - startTime2;
    
    currentSubtitle(id);

    //console.log(id)
    //console.log(typeof(id))
    colorSub(id);
    scrollSub(id.toString());
    timer = setTimeout(function() { sequenceSub(id + 1); }, timeoutMillsec);    
}

// scroll sub to top
function scrollSub(id) {
    //console.log("Inside scroll function");
    var test = $(".test");
    var topPos = document.getElementById(id).parentNode.parentNode.offsetTop;
    

    test.animate({
        scrollTop: topPos*0.995
    }, 250);
}

function yHandler(){	
    var wrap = $('.test');    
    var contentHeight = wrap.offsetHeight;    
    var yOffset = wrap[0].scrollTop + wrap[0].clientTop;
	if(yOffset >= contentHeight){
		// Ajax call to get more dynamic data goes here
		//console.log('Add more data')
	}	
}

// adding subtitles dinamically
function queryJSON(id) {
    
    $.ajax({ 
        url: "../queryJSON.php",
        type: "GET",
        data: {
            video_id: id,
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            //debugger;
            //if do not contain this video info in server, then back to home page
            if (msg.title === null) {
                window.location = "../index.php";
            } else {
                $("#video_title").html(msg.title);
                document.title = msg.title;

                content = jQuery.parseJSON(msg.json);

                //console.log(content.length);
                
                /*

                content.forEach(function(element, index) {
                    $(".test").append("<tr><td>" + "<a id='" + index + "'' class='subtitle' href='#' >" + "<i class='far fa-play-circle fa-lg'></i>" + "</a></td>" + "<td><a id='" + index + "'' class='subtitle' href='#' ><span id='subtitle_text_" + index + "' >" + element["text"] + "</span></a></td></tr>");
                });
                
                */                
                
                for (i = 0; i < 20; i++) {
                    $("#items").append("<tr><td>" + "<a id='" + i + "'' class='subtitle' href='#' >" + "<i class='far fa-play-circle fa-lg'></i>" + "</a></td>" + "<td><a id='" + i + "'' class='subtitle' href='#' ><span id='subtitle_text_" + i + "' >" + content[i].text + "</span></a></td></tr>");
                }
                
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            //debugger;
            alert(xhr.status);
            alert(xhr.responseText);
        }
    });
}

function testGETjson(id) {        
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/espixl/cc/main/es/" + id + ".json",
        dataType: "json",
        //data: { 'pageCounter': page},
        success: function(data) {
            
            content = data.json
            es_cc = data.zh

            $("#video_title").html(data.title);
            document.title = data.title;

            for (i = 0; i < 20; i++) {
                $("#items").append("<tr><td>" + "<a id='" + i + "'' class='subtitle' href='#' >" + "<i class='far fa-play-circle fa-lg'></i>" + "</a></td>" + "<td><a id='" + i + "'' class='subtitle' href='#' ><span id='subtitle_text_" + i + "' >" + content[i].text + "</span></a></td></tr>");
            }

            // rer es cc if verified
            if(es_cc == 1){             

                $.getJSON("https://raw.githubusercontent.com/espixl/cc/main/zh/" + id + ".json", function(json) {     
                    //console.log(json); // this will show the info it in firebug console
                    spanishContent = json.json                                         
                });

            }

        },
        error: function(data) {
        //if there is an error
            console.log(data.responseText);
        }
    });    
    
}

// request spanish subtitles
function queryES(id) {
    
    $.ajax({ 
        url: "../queryES.php",
        type: "GET",
        data: {
            video_id: id,
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            //debugger;
            //if do not contain this video info in server, then back to home page
            if (msg.title === null) {
                window.location = "../index.php";
            } else {                

                spanishContent = jQuery.parseJSON(msg.json);
                //console.log(spanishContent.length);               
                
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            //debugger;
            alert(xhr.status);
            alert(xhr.responseText);
        }
    });
}

function queryLIST(id) {
    debugger;
    $.ajax({
        url: "../queryLIST.php",
        type: "GET",
        data: {
            playlist_id: id,
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            debugger;
            //if do not contain this video info in server, then back to home page
            if (msg.playlist_title === null) {
                window.location = "../index.php";
            } else {
                //$("#video_title").html(msg.video_titles[0]);
                v_id_arr = msg.video_ids;
                debugger;
                //document.title = msg.title;
                console.log(msg);
                playlistInfo = msg;
                var playingId = 0;
                var listLength = playlistInfo['video_ids'].length;
                for (var i = 0; i < listLength; i++) {
                    if (playlistInfo['video_ids'][i] == v_id) {
                        playingId = i;
                        $("#playlist-block").append("<tr id='list-" + i + "' class='playing videos'><td>" + (i+1) + "</td><td><img src='http://img.youtube.com/vi/" + playlistInfo['video_ids'][i] + "/0.jpg' class='img-responsive'></td><td><p class='video-title'>" + playlistInfo['video_titles'][i] + "</p></td></tr>");

                    } else {

                        $("#playlist-block").append("<tr id='list-" + i + "'class='videos'><td>" + (i+1) + "</td><td><img src='http://img.youtube.com/vi/" + playlistInfo['video_ids'][i] + "/0.jpg' class='img-responsive'></td><td><p class='video-title'>" + playlistInfo['video_titles'][i] + "</p></td></tr>");
                    }
                }

                // move to the playing video
                var topPos = document.getElementById("list-"+playingId).parentNode.parentNode.offsetTop;
                //debugger;
                console.log("playing: topPos: "+topPos);
                $("#playlist-container").animate({
                    scrollTop: topPos
                }, 250)
                //debugger                
                ;
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            debugger;
            alert(xhr.status);
            alert(xhr.responseText);
        }
    });
}

function get_1st_id(id) {
    $.get("../queryLIST.php", { playlist_id: id})
    .done(function(data) {
        v_id = data.video_ids[0];
    });
    
}

// listen if subtitle is clicked
$(document).on('click', '.videos', function() {
    var index = this.id;
    debugger;
    index = index.split('-')[1];
    change_video(v_id_arr[index]);
});

function change_video(v_id){
    debugger;
    window.location = window.location.href.split('?')[0] + "?playlist_id=" + p_id + "&video_id=" + v_id;
}

$(document).ready(function() {
    if (p_id !== null){
        queryLIST(p_id);
    }

    testGETjson(v_id);   
});

