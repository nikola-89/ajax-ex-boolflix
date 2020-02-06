$(document).ready(function() {
    // ***************************
    printer_result = Handlebars.compile($('#result').html());
    printer_noresult = Handlebars.compile($('#error').html());
    $('.search input').focus();
    $(document).on('click', '.search button', function() {
        if ($('.search input').val().trim().length != 0) {
            $('.result .title').remove();
            request($('.search input').val());
            $('.search input').val('');
            $('.search input').focus();
        } else {
            $('.search input').focus();
        }
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
    if (response.length != 0) {
        response.sort(function(b, a) {
            return parseFloat(a.vote_average) - parseFloat(b.vote_average);
        });
        $('.result').append(printer_result(response));
    } else {
        var cfg_noresult = {
            str : 'La ricerca non ha prodotto risultati.'
        }
        $('.result').append(printer_noresult(cfg_noresult));
    }
}
// ***************************
function error() {
    var printer_error = Handlebars.compile($('#result').html());
    var cfg_error = {
        str : 'Impossibile elaborare la richiesta.'
    }
    $('.result').append(printer_noresult(cfg_error));
}
// ***************************
