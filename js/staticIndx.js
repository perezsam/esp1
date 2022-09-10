// Scroll navbar
function checkScroll() {
    var startY = $('.navbar').height() * 2; //The point where the navbar changes in px

    if ($(window).scrollTop() > startY) {
        $('.navbar').addClass("scrolled");
    } else {
        $('.navbar').removeClass("scrolled");
    }
}

if ($('.navbar').length > 0) {
    $(window).on("scroll load resize", function() {
        checkScroll();
    });
}


//carousel
$(window).resize(function() {
        console.log('resize called');
        var width = $(window).width();
        if (width >= 768) {
            $('.carousel-add').addClass('carousel-inner');
        } else {
            $('.carousel-add').removeClass('carousel-inner');
        }
    })
    .resize();

$('.carousel').carousel({
    interval: false
})

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Called when adding a new video or playlist

$("#add-new-video").click(function() {
    //console.log($("#new-video-href").val());
    // get video id
    var value = $("#new-video-href").val();
    console.log(value);
    var video_id = getParameterByName('v', value);
    var playlist_id = getParameterByName('list', value);
    console.log(video_id);
    console.log(playlist_id);
    var id_JSON = JSON.stringify({
        v: video_id,
        p: playlist_id
    });
    $.ajax({
        type: "POST",
        url: "youtubeAPI.php",
        data: id_JSON,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        processData: false,
        success: function(data) {
            console.log(data);
            debugger;
            //if do not contain this video info in server, then back to home page
            if (data.legal == false) {
                alert('Not a valid youtube video or playlist url. \n This request will be IGNORED');
            } else {
                if (data.title === null || data.status === "failed...") {
                    window.location = "index.html";
                } else {
                    if (playlist_id == null) {
                        window.location = "videopage/playpage.html?video_id=" + video_id;
                    } else {
                        window.location = "videopage/playlist.html?playlist_id=" + playlist_id + "&video_id=" + video_id;
                    }
                }
            }
        },
        error: function() {
            console.log("error");
        }
    });
});

function loadHomeVid() {
    var homeList = "https://raw.githubusercontent.com/espixl/cc/main/all/pg1.json";    

    $.getJSON(homeList, function(vidList) {
        var back = vidList;

        //console.log(back.length)       

        for (var i = 0; i < back.length; i++) {

            var fullTitle = back[i]["title"];
            var divideTitle = fullTitle.split(" | ");
            
            var chapter = "第" + (i+1).toString() + "集 ";
            
            var appendText = '<div class="col-lg-3 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="100">'
                + '<div class="member">'
                +   '<div class="member-img">'
                +       '<a href="./video/watch.html?video_id=' + back[i]["video_id"] + '"><img src="https://i.ytimg.com/vi/' + back[i]["video_id"] + '/hqdefault.jpg" class="img-fluid" alt=""></a>'
                +           '<div class="social">'                  
                +               '<a href="./video/watch.html?video_id=' + back[i]["video_id"] + '"><i class="icofont-ui-video-play"></i></a>'                  
                +           '</div>'                
                +   '</div>'
                +   '<div class="member-info">'
                +       '<h7>' + divideTitle[0] + '<br />' + chapter + divideTitle[1] + '</h7>'                        
                +   '</div>'
                + '</div>'
            + '</div>';

            $("#homevids").append(appendText);            
        }
        
    });

};

// enable full title tooltip
function enableTooltip(){
    $('[data-toggle="tooltip"]').tooltip({
        placement : 'top'
    });
};

// replace single and double quotes
function escapeHtml(text) {
    var map = {          
      '"': '&quot;',
      "'": '&#039;'
    };
  
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// pagination button
$("#all-videos").click(function() {
    //location.href="./all";
    location.href="./all/index.html";
});

// render homepg
$(document).ready(function() {
    loadHomeVid();    
});
