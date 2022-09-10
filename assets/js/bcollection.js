function loadEbooks() {
    var homeList = "./assets/json/books.json";

    $.getJSON(homeList, function (bookList) {
        var myBooks = bookList.books;

        //console.log(myBooks)

        var dataDelay = 100;

        for (var i = 0; i < myBooks.length; i++) {

            var appendText = '<div class="col-lg-3 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="' + dataDelay + '">' +
                '<div class="member">' +
                    '<div class="member-img">' +
                        '<img src="./assets/img/books/' + myBooks[i]['id'] + '.jpg" class="img-fluid" alt="">' +
                        '<div class ="social">' +
                        '<a href="./book.html?b_id='+ myBooks[i]['id'] +'"><i class ="icofont-book-alt"></i></a>' +
                        '<a href="./book.html?b_id='+ myBooks[i]['id'] +'"><i class ="icofont-audio"></i></a>' +
                        '<a href="./book.html?b_id='+ myBooks[i]['id'] +'"><i class ="icofont-headphone"></i></a>' +
                        '<a href="./book.html?b_id='+ myBooks[i]['id'] +'"><i class ="icofont-ebook"></i></a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="member-info">' +
                        //'<h4>' + myBooks[i]['title'] + '</h4>' +
                        '<h4><a href="./book.html?b_id=' + myBooks[i]['id'] + '">' + myBooks[i]['title'] + '</a></h4>' +
                        '<span>' + myBooks[i]['author'] + '</span>' +                        
                    '</div>' +
                '</div>' +
            '</div>';

            $("#homebooks").append(appendText);
            dataDelay += 100
        }

    });

};

// render book list
$(document).ready(function () {
    loadEbooks();
});
