// global variables
var book_id;

// get book id
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

book_id = getParameterByName('b_id', request_url);

function loadChapters(id) {
    var bookInfoRequest = './assets/json/' + id + '.json';

    $.getJSON(bookInfoRequest, function (bookInfo) {

        var bookChapters = bookInfo.chapters;
        var bookTitle = bookInfo.book_title;
        var bookAuthor = bookInfo.author;
        var authorId = bookInfo.author_id;

        // set document title as the book title and author
        var pageTitle = bookTitle + ' - ' + bookAuthor;
        document.title = pageTitle;

        // add footer book title and author
        $("#footer_book_title").html(bookTitle);
        $("#footer_author").html(bookAuthor);

        // set the index title as book title
        $("#index_book_title").html(bookTitle);

        //console.log(pageTitle);     

        var chaptersElements = '';
        var dataDelay = 0;
        const chapters_url_arr = [];

        for (var i = 0; i < bookChapters.length; i++) {

            // generate chapter url
            var chapterURL = './vlib/' + authorId + '/ch' + bookChapters[i]['number'] + '.html';
            //console.log(chapterURL);
            chapters_url_arr.push(chapterURL);

            // define if collapse or not 
            if (i == 0) {
                var collapseParam = 'collapse show';

                // append btn to first chapter in nav bar
                var readChapterOne = '<a href="' + chapterURL + '" class="get-started-btn scrollto">Leer</a>';
                $("#page_navbar").append(readChapterOne);

            } else {
                var collapseParam = 'collapse';
            }

            // generate element id 
            var faqListId = i + 1;

            // generate number string to concatenate before title
            var chapterNumber = faqListId.toString() + ' - ';            

            var chapterIntro =
                '<li data-aos="fade-up">' +
                '<i class="bx bx-play-circle icon-help"></i> <a data-toggle="collapse" class="collapse" href="#faq-list-' + faqListId + '">' + chapterNumber + bookChapters[i]['title'] + ' <i class="bx bx-chevron-down icon-show"></i><i class="bx bx-chevron-up icon-close"></i></a>' +
                '<div id="faq-list-' + faqListId + '" class="' + collapseParam + '" data-parent=".faq-list">' +
                '<p>' + bookChapters[i]['start'] + '</p>' +
                '<div class="icon text-right"><a href="' + chapterURL + '">Seguir Leyendo</a></div>' +
                '</div>' +
                '</li>';

            chaptersElements += chapterIntro
            dataDelay += 100
        }

        var appendText = '<ul>' + chaptersElements + '</ul>'
        $("#bchapters").append(appendText);

        // populater footer indx chapters

        var appendFooterIndx1 = '<ul>' +
            '<li><i class="bx bx-chevron-right"></i> <a href="' + chapters_url_arr[0] + '">CAPÍTULO I</a></li>' +
            '<li><i class="bx bx-chevron-right"></i> <a href="' + chapters_url_arr[1] + '">CAPÍTULO II</a></li>' +
            '<li><i class="bx bx-chevron-right"></i> <a href="' + chapters_url_arr[2] + '">CAPÍTULO III</a></li>' +
            '<li><i class="bx bx-chevron-right"></i> <a href="' + chapters_url_arr[3] + '">CAPÍTULO IV</a></li>' +
            '<li><i class="bx bx-chevron-right"></i> <a href="' + chapters_url_arr[4] + '">CAPÍTULO V</a></li>' +
        '</ul>';

        $("#footerIndx1").append(appendFooterIndx1);

    })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
            window.location = "./";
        });
};

function renderChapters(id) {
    $.ajax({
        type: "GET",
        url: './assets/json/' + id + '.json',
        dataType: "json",
        //data: {'pageCounter': page},
        success: function (data) {
            content = data;
            console.log('inside ajax');
            console.log(content);
        },
        error: function (xhr) {
            //if there is an error
            //console.log(data.responseText);
            console.log(xhr.status);
            window.location = "./";
        }
    });

}

$(document).ready(function () {
    loadChapters(book_id);
    //renderChapters(book_id); 
});

