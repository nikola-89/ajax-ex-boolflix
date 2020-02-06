$(document).ready(function() {
    // ***************************
    builder = Handlebars.compile($('#result').html());
    $('.search input').focus();
    $(document).on('click', '.search button', function() {
        request($('.search input').val());
        $('.search input').val('');
        $('.search input').focus();
    });
});
// ***************************
// *-------*function*--------*
// ***************************
function request(key) {
    $.ajax(
        {
            url: "https://api.themoviedb.org/3/search/movie",
            method: "GET",
            data: {
                api_key : 'af0ae7e4040a70eef7c834e5f942b6b8',
    	        query : key,
            	language : 'it-IT',
            	page : 1
            },
            success: function (data, status) {
                if (status == 'success') {
                    console.log(data);
                    print(data.results);
                } else {
                    error();
                }
            },
            error: function (data, status) {
                error();
            }
        }
    );
}
// ***************************
function print(response) {
$('.result').append(builder(response));
}
// ***************************
function error() {
    $('.result').append(builder({title : 'Impossibile processare la richiesta.'}));
}
// ***************************
