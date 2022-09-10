var pageCounter = 1;
var totalRecords = 0;    
var displayRecords = [];
var recPerPage = 16;    
var totalPages = 0;
var $pagination = $('#pagination');    
 
// start page rendering the first results
firstPage(pageCounter);

// generate pagination function
function apply_pagination() {
    $pagination.twbsPagination({
        totalPages: totalPages,
        visiblePages: 6,
        onPageClick: function (event, page) {
            console.info(page + ' (from options)'); 
        }
    }).on('page', function (event, page) {
        console.info(page + ' (from event listening)');
        window.scrollTo(0, 0);
        newPage(page)
    });
}

// Enable tooltip to show complete video title
function enableTooltip(){
    $('[data-toggle="tooltip"]').tooltip({
        placement : 'top'
    });
};

// Replace single and double quotes
function escapeHtml(text) {
    var map = {          
      '"': '&quot;',
      "'": '&#039;'
    };
  
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// on page loading, render the initial page
function firstPage(page) {        
    $.ajax({
        type: "POST",
        url: "./page_data.php",
        dataType: "json",
        data: { 'pageCounter': page},
        success: function(data) {
            var back = data;          

            totalRecords = back.meta.total;
            totalPages = Math.ceil(totalRecords / recPerPage);            
            displayRecords = back.videos;            
            
            renderPage(displayRecords);
            apply_pagination();

        },
        error: function(data) {
        //if there is an error
            console.log(data.responseText);
        }
    });
    
}

function newPage(page){
    $.ajax({
        type: "POST",
        url: "./page_data.php",
        dataType: "json",
        data: { 'pageCounter': page},
        success: function(data) {
            var back = data;
            displayRecords = back.videos;
            
            renderPage(displayRecords);

        },
        error: function(data) {
        //if there is an error
            console.log(data.responseText);
        }
    });
}

function renderPage(videos) {
        
    $("#thumbnail-container").html('');
                   
    for (var i = 0; i < displayRecords.length; i++) {
        var videoTags = JSON.parse(displayRecords[i]["video_tags"]);

            // thumbnail link, video title link and viwcount info
            var appendText = "<div class='col-sm-3 col-xs-12'>"
            + "<div class='thumbnail'>"
            +   "<a href='../video/watch.php?video_id=" +displayRecords[i]["video_id"] + "'><img src='http://img.youtube.com/vi/" + displayRecords[i]["video_id"] + "/0.jpg' class='img-responsive'></a>"
            +   "<div class='caption'>"
            +       "<div class='caption-title' data-toggle='tooltip' title='" + escapeHtml(displayRecords[i]["title"]) + "' >"
            +           "<p>" + '<a href="../video/watch.php?video_id=' + displayRecords[i]["video_id"] + '">' + displayRecords[i]["title"] + "</a></p>"
            +       "</div>"
            +       "<p><span class='glyphicon glyphicon-headphones' aria-hidden='true'></span> " + displayRecords[i]["viewcount"] + "</p><p>";
        
            // render video accent and level tags
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

    enableTooltip();

}

