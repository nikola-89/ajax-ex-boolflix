$(document).ready(function() {
    // ***************************
    // Endpoint
    // ***************************
    var apiSlider = 'https://api.themoviedb.org/3/movie/now_playing';
    var apiGetQuery = 'https://api.themoviedb.org/3/search/';
    var myApiKey = 'af0ae7e4040a70eef7c834e5f942b6b8';
    // ***************************
    // Handlebars
    // ***************************
    var printerResult = Handlebars.compile($('#result').html());
    var printerSlider = Handlebars.compile($('#slider_img').html());
    var printerNoResult = Handlebars.compile($('#error').html());
    var printerError = Handlebars.compile($('#result').html());
    // ***************************
    // var
    // ***************************
    var query = $('#search input');
    // ***************************
    // apiRequests(apiSlider, myApiKey, printerSlider, 0, 'slider');
    focusInput(query);
    // ***************************
    $(document).on('keypress', query.is(':focus'), function(e) {
            if (e.which == 13) {
                if (query.val().trim().length != 0) {
                    reqMovie(query.val());
                    reqTv(query.val());
                    cleanResult(query);
                    focusInput(query);
                } else {
                    focusInput(query);
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
            $('.row .type').css({
                'transform': 'translate(9px, -50px)',
                'transition': '250ms all'
            });
            $(this).find('.info').fadeIn(400);
        } else {
            $('.row .type').css({
                'transform': '',
                'transition': '250ms all'
            });
            $(this).find('.info').fadeOut(300);;
        }
    });
});
// ***************************
// *-------*function*--------*
// ***************************
function apiRequests(url, apiKey, handlebars, value, type) {
    // ***************************
    $.ajax(
        {
            url: typeUrl(url, type),
            method: "GET",
            data: typeCall(apiKey, value, type),
            success: function (data, status) {
                if (status == 'success') {
                    print(data.results, handlebars, type);
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
function print(data, handlebars, type) {
    if (data.length != 0) {
        if (type == 'slider') {
            for (var i = 0; i < data.length; i++) {
                $('.slider').append(handlebars(cfgResult(data[i])));
            }
        } else {
            for (var i = 0; i < data.length; i++) {
                $('.result').append(handlebars(cfgResult(data[i])));
            }
        }
    } else {
        $('.result').append(handlebars({
            str : 'La ricerca non ha prodotto risultati.'
        }));
    }
}
// ***************************
function error() {
    var printerError = Handlebars.compile($('#result').html());
    var cfgError = {
        str : 'Impossibile elaborare la richiesta.'
    }
    $('.result').append(printerError(cfgError));
}
// ***************************
// CUSTOM function for .title
// response.sort(sortTitleAlph);
// ***************************
function sortTitleAlph(b, a) {
    if(a.title === b.title) {
        return 0;
    } else if (a.title < b.title) {
        return 1;
    } else {
        return -1;
    }
}
// ***************************
// sortFloatNumb(response, 'popularity');
// ***************************
function sortFloatNumb(obj, objKeyString) {
    obj.sort(function(a, b) {
        return parseFloat(a.objKeyString) - parseFloat(b.objKeyString);
    });
}
// ***************************
function cleanResult(input) {
    $('.result .title').remove();
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
    var cover = 'https://image.tmdb.org/t/p/w185' + data.poster_path;
    if (data.poster_path == null) {
        cover = 'https://i.imgur.com/n8DkWVY.png';
    }
    if (type == 'tv') {
        // Config SerieTV
        var cfgResult = {
            cover : cover,
            title : data.name,
            originalTitle : data.original_name,
            iconFlag : flags(data.original_language),
            popularity : data.popularity,
            stars : stars(data.vote_average)
        }
    } else if (type == 'movie') {
        // Config Film
        var cfgResult = {
            cover : cover,
            title : data.title,
            originalTitle : data.original_title,
            iconFlag : flags(data.original_language),
            popularity : data.popularity,
            stars : stars(data.vote_average)
        }
    } else {
        // Config Slider
        var cfgResult = {
            backdropPath : data.backdrop_path,
            originalTitle : data.original_title,
        }
    }
    return cfgResult;
}
// ***************************
function typeUrl(url, type) {
    // ***************************
    switch (type) {
        case 'slider':
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
    if (type == 'slider') {
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
