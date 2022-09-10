$(document).ready(function() {    
    var pageCounter = 0; //for counting now page
    var loadMoreVideoLock = false; //lock function when now is loading
    function loadMoreVideo() {
        //lock when loading new video
        loadMoreVideoLock = true;
        $.ajax({
            type: "POST",
            url: "data.php",
            dataType: "json",
            data: { 'pageCounter': pageCounter },
            success: function(data) {
                var back = data;               
                
                for (var i = back.length - 1; i >= 0; i--) {                    

                    var videoTags = JSON.parse(back[i]["video_tags"]);                  
                    
                    // thumbnail link, video title link and viwcount info
                    var appendText = "<div class='col-sm-3 col-xs-12'>"
                        + "<div class='thumbnail'>"
                        +   "<a href='./video/watch.php?video_id=" + back[i]["video_id"] + "'><img src='http://img.youtube.com/vi/" + back[i]["video_id"] + "/0.jpg' class='img-responsive'></a>"
                        +   "<div class='caption'>"
                        +       "<div class='caption-title' data-toggle='tooltip' title='" + escapeHtml(back[i]["title"]) + "' >"
                        +           "<p>" + '<a href="./video/watch.php?video_id=' + back[i]["video_id"] + '">' + back[i]["title"] + "</a></p>"
                        +       "</div>"
                        +       "<p><span class='glyphicon glyphicon-headphones' aria-hidden='true'></span> " + back[i]["viewcount"] + "</p><p>";
                    
                    videoTags.forEach(function(element, index) {                   

                        switch(element) {
                            case "Basic":
                                appendText = appendText + "<p><span class='label label-success'>" + "Básico" + "</span>";
                                break;
                            case "Int":
                                appendText = appendText + "<p><span class='label label-primary'>" + "Intermedio" + "</span>";
                                break;
                            case "Advanced":
                                appendText = appendText + "<p><span class='label label-default'>" + "Avanzado" + "</span>";
                                break;
                            case "US":
                            case "UK":
                            case "AU":
                            case "Other":
                                appendText = appendText + "<span class='label label-warning'>" + element + "</span>";                                
                                break;
                            default:                                
                                console.log("No tags available")
                        }

                    });                                

                    appendText = appendText + "</p></div></div></div>";
                    $("#thumbnail-container").append(appendText);                    

                }

                // enable tooltip when finishing redering html
                enableTooltip();
            },
            error: function(data) {
                //if there is error
                console.log(data.responseText);
            }
        });
        //after loading new page, update the page counter
        pageCounter = pageCounter + 1;
        //unlock when loading end
        loadMoreVideoLock = false;
    };    

    // enable full-title tooltip
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

    //init page with same function
    loadMoreVideo();    

    // click event listener for button if scrolling not working
    $("#more-video").click(function() {
        loadMoreVideo();
    });   
    

    // load more video when scroll to page bottom 
    $(window).scroll(function() {
        var footerHeight = $(".nb-footer").height();
        
        last = $("body").height() - $(window).height() - (footerHeight * 1.) - 50 
        if ($(window).scrollTop() >= last) {
            //lock the function before the loading end
            if (!loadMoreVideoLock) {
                loadMoreVideo();
            }
        }
    })
});
