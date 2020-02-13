$(document).ready(function() {
    // ***************************
    // Endpoint
    // ***************************
    var apiNow = 'https://api.themoviedb.org/3/movie/now_playing';
    var apiGetQuery = 'https://api.themoviedb.org/3/search/';
    var myApiKey = 'af0ae7e4040a70eef7c834e5f942b6b8';
    // ***************************
    // var
    // ***************************
    var input = $('.search input');
    // ***************************
    apiRequests(apiNow, myApiKey, 0, 'start');
    focusInput(input);
    // ***************************
    $(document).on('keypress', input.is(':focus'), function(e) {
            if (e.which == 13) {
                if (input.val().trim().length != 0) {
                    apiRequests(apiGetQuery, myApiKey, input.val(), 'movie');
                    apiRequests(apiGetQuery, myApiKey, input.val(), 'tv');
                    cleanResult(input);
                    focusInput(input);
                } else {
                    focusInput(input);
                }
            }
        }
    );
    $(document).on("mouseenter mouseleave", ".nav", function(e) {
        // ***************************
        if (e.type == "mouseenter") {
            $('.nav .logo h3:nth-child(2)').removeClass('hidden');
            $('.nav .logo h3:nth-child(3)').removeClass('hidden');
        } else {
            $('.nav .logo h3:nth-child(2)').addClass('hidden');
            $('.nav .logo h3:nth-child(3)').addClass('hidden');
        }
    });
    $(document).on("mouseenter mouseleave", ".row .item", function(e) {
        // ***************************
        if (e.type == "mouseenter") {
            if ($(this).index() == 1) {
                $('.row .type').css({
                    'transform': 'translate(9px, -50px)',
                    'transition': '250ms all'
                });
            }
            $(this).find('.info').fadeIn(400);
        } else {
            if ($(this).index() == 1) {
                $('.row .type').css({
                    'transform': '',
                    'transition': '250ms all'
                });
            }
            $(this).find('.info').fadeOut(300);;
        }
    });
});
// ***************************
// *-------*function*--------*
// ***************************
function apiRequests(url, apiKey, value, type) {
    // ***************************
    $.ajax(
        {
            url: typeUrl(url, type),
            method: "GET",
            data: typeCall(apiKey, value, type),
            success: function (data, status) {
                if (status == 'success') {
                    console.log(data.results);
                    print(data.results, type);
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
function print(data, type) {
    var printType = Handlebars.compile($('#type').html());
    var printItem = Handlebars.compile($('#item').html());
    var printError = Handlebars.compile($('#error').html());
    if (data.length != 0) {
        if (type == 'start') {
            $('.wrapper').append(printType({type : 'ora al cinema'}));
        } else {
            $('.wrapper').append(printType({type : type}));
        }
        for (var i = 0; i < data.length; i++) {
            $('.wrapper .row').append(printItem(cfgResult(data[i], type)));
        }
    } else {
        $('.wrapper').append(printError({str : 'La ricerca ' + type + ' non ha prodotto risultati.'}));
    }
}
// ***************************
function cleanResult(input) {
    $('.wrapper .row').remove();
    $('.wrapper .error').remove();
    input.val('');
}
// ***************************
function focusInput(input) {
    input.focus();
}
// ***************************
function stars(number) {
    // ***************************
    var result = [];
    var num = Math.round(number / 2);
    while (result.length <= 4) {
        if (result.length < num) {
            // full star
            result.push('<span><i class="fas fa-star" style="color:#F9AE0E"></i></span>');
        } else {
            // empty star
            result.push('<span><i class="far fa-star" style="color:#F9AE0E"></i></span>');
        }
    }
    return result.join('');
}
// ***************************
function flags(str) {
    // ***************************
    var flagsIcon = {
        en : 'https://i.imgur.com/GZt9HJg.png',
        fr : 'https://i.imgur.com/DN4BNIF.png',
        de : 'https://i.imgur.com/UOTuePK.png',
        it : 'https://i.imgur.com/cErhoOe.png',
        es : 'https://i.imgur.com/6tybsuv.png',
        nl : 'https://i.imgur.com/ohiZCWn.png',
        fi : 'https://i.imgur.com/qPW6byZ.png',
        cs : 'https://i.imgur.com/wDGjO4J.png',
        ja : 'https://i.imgur.com/oN6voqV.png',
        pt : 'https://i.imgur.com/BNK4P8C.png',
        pl : 'https://i.imgur.com/KQhtyoS.png',
        tr : 'https://i.imgur.com/YU2f1oi.png',
        zh : 'https://i.imgur.com/1IslcLy.png',
        ar : 'https://i.imgur.com/kwlErfp.png',
        ko : 'https://i.imgur.com/T5I6fRo.png',
        he : 'https://i.imgur.com/MXKjzsa.png',
        nb : 'https://i.imgur.com/QnbadVG.png',
        ru : 'https://i.imgur.com/DBGM3ov.png',
        hu : 'https://i.imgur.com/y1rLdRi.png',
        sv : 'https://i.imgur.com/OXMAOxr.png'
    }
    for (var key in flagsIcon) {
        if (key === str) {
            return flagsIcon[key];
        }
    }
    return str;
}
// *******************************
function cfgResult(data, type) {
    // ***************************
    var cover = 'https://image.tmdb.org/t/p/w500' + data.poster_path;
    if (data.poster_path == null) {
        cover = 'https://i.imgur.com/PGliIqs.png';
    }
    if (type == 'tv') {
        var cfgResult = {
            cover : cover,
            title : data.name,
            synopsis : data.overview,
            originalTitle : data.original_name,
            iconFlag : flags(data.original_language),
            stars : stars(data.vote_average)
        }
    } else {
        var cfgResult = {
            cover : cover,
            title : data.title,
            synopsis : data.overview,
            originalTitle : data.original_title,
            iconFlag : flags(data.original_language),
            stars : stars(data.vote_average)
        }
    }
    return cfgResult;
}
// ***************************
function typeUrl(url, type) {
    // ***************************
    switch (type) {
        case 'start':
            return url;
        case 'movie':
            return url + type;
        case 'tv':
            return url + type;
    }
}
// ***************************
function typeCall(key, query, type) {
    // ***************************
    var params;
    if (type == 'start') {
        query = null;
        params = {
            api_key : key,
            language : 'it-IT',
            region : 'IT',
            page : 1
        }
    } else {
        params = {
            api_key : key,
            query : query,
            language : 'it-IT',
            include_adult : false,
            page : 1
        }
    }
    return params;
    // ***************************
}
