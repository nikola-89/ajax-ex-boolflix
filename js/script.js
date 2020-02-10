$(document).ready(function() {
    // ***************************
    printerResult = Handlebars.compile($('#result').html());
    printerNoResult = Handlebars.compile($('#error').html());
    // ***************************
    focusInput();
    // ***************************
    $(document).on('click', '.search button', function() {
        if ($('.search input').val().trim().length != 0) {
            reqMovie($('.search input').val());
            reqTv($('.search input').val());
            cleanResult();
            focusInput();
        } else {
            focusInput();
        }
    });
    // ***************************
    $(document).on('keypress', $('.search input').is(':focus'), function(e) {
            if (e.which == 13) {
                if ($('.search input').val().trim().length != 0) {
                    reqMovie($('.search input').val());
                    reqTv($('.search input').val());
                    cleanResult();
                    focusInput();
                } else {
                    focusInput();
                }
            }
        }
    );
});
// ***************************
// *-------*function*--------*
// ***************************
function reqMovie(value) {
    $.ajax(
        {
            url: "https://api.themoviedb.org/3/search/movie",
            method: "GET",
            data: {
                api_key : 'af0ae7e4040a70eef7c834e5f942b6b8',
                query : value,
                language : 'it-IT',
                include_adult : false,
                page : 1
            },
            success: function (data, status) {
                if (status == 'success') {
                    console.log(data);
                    print(data.results, 'movie');
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
function reqTv(value) {
    $.ajax(
        {
            url: "https://api.themoviedb.org/3/search/tv",
            method: "GET",
            data: {
                api_key : 'af0ae7e4040a70eef7c834e5f942b6b8',
                query : value,
                language : 'it-IT',
                include_adult : false,
                page : 1
            },
            success: function (data, status) {
                if (status == 'success') {
                    console.log(data);
                    print(data.results, 'tv');
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
function print(data) {
    if (data.length != 0) {
        for (var i = 0; i < data.length; i++) {
            $('.result').append(printerResult(cfgResult(data[i])));
        }
    } else {
        var cfgNoResult = {
            str : 'La ricerca non ha prodotto risultati.'
        }
        $('.result').append(printerNoResult(cfgNoResult));
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
function cleanResult() {
    $('.result .title').remove();
    $('.search input').val('');
}
// ***************************
function focusInput() {
    $('.search input').focus();
}
// ***************************
function stars(number) {
    var result = [];
    var num = Math.round(number / 2);
    var full =
        '<span><i class="fas fa-star" style="color:#F9AE0E"></i></span>';
    var empty =
        '<span><i class="far fa-star" style="color:#F9AE0E"></i></span>';
    while (result.length <= 4) {
        if (result.length < num) {
            result.push(full);
        } else {
            result.push(empty);
        }
    }
    return result.join('');
}
// ***************************
function flags(str) {
    var flagUnd = 'https://i.imgur.com/1JDXdUN.png';
    var flagsIcon = {
        'en': 'https://i.imgur.com/GZt9HJg.png',
        'fr': 'https://i.imgur.com/DN4BNIF.png',
        'de': 'https://i.imgur.com/UOTuePK.png',
        'it': 'https://i.imgur.com/cErhoOe.png',
        'es': 'https://i.imgur.com/6tybsuv.png',
        'nl': 'https://i.imgur.com/ohiZCWn.png',
        'fi': 'https://i.imgur.com/qPW6byZ.png',
        'cs': 'https://i.imgur.com/wDGjO4J.png',
        'ja': 'https://i.imgur.com/oN6voqV.png',
        'pt': 'https://i.imgur.com/BNK4P8C.png',
        'pl': 'https://i.imgur.com/KQhtyoS.png',
        'tr': 'https://i.imgur.com/YU2f1oi.png',
        'zh': 'https://i.imgur.com/1IslcLy.png',
        'ar': 'https://i.imgur.com/kwlErfp.png',
        'ko': 'https://i.imgur.com/T5I6fRo.png',
        'he': 'https://i.imgur.com/MXKjzsa.png',
        'nb': 'https://i.imgur.com/QnbadVG.png',
        'ru': 'https://i.imgur.com/DBGM3ov.png',
        'hu': 'https://i.imgur.com/y1rLdRi.png'
    }
    for (var key in flagsIcon) {
        if (key === str) {
            return flagsIcon[key];
        }
    }
    return flagUnd;
}
// ******************************************************
function cfgResult(data, type) {
    var fullImg = 'https://image.tmdb.org/t/p/w185' + data.poster_path;
    if (data.poster_path == null) {
        // fullImg = 'https://i.imgur.com/WoA9AF9.png';
        fullImg = 'https://i.imgur.com/n8DkWVY.png';
    }
    if (type == 'tv') {
        // Config SerieTV
        var cfgResult = {
            cover : fullImg,
            title : data.name,
            originalTitle : data.original_name,
            iconFlag : flags(data.original_language),
            popularity : data.popularity,
            stars : stars(data.vote_average)
        }
    } else {
        // Config Film
        var cfgResult = {
            cover : fullImg,
            title : data.title,
            originalTitle : data.original_title,
            iconFlag : flags(data.original_language),
            popularity : data.popularity,
            stars : stars(data.vote_average)
        }
    }
    return cfgResult;
}
