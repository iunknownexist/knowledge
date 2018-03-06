/* global $, easyXDM */
/* eslint-disable complexity, no-alert, no-unused-vars */

var ssoLogout = new easyXDM.Rpc({
    remote: window.CAS_HOST + 'provider/'
}, {
    remote: {
        request: {}
    }
});

// 退出
function otherWebLogout(urls) {
    'use strict';

    var time = 0, i;
    var logoutCallback = function () {
        time = time + 1;
        selfLogout(time, urls.length);
    };

    for (i = 0; i < urls.length; i++) {
        $.ajax({
            url: urls[i],
            dataType: 'jsonp',
            method: 'GET',
            timeout: 5000,
            complete: logoutCallback
        });
    }
}

function selfLogout(time, urlsCount) {
    'use strict';

    var jumpHref = '';

    if (+time === +urlsCount) {
        jumpHref = window.location.protocol + '//' + window.location.host + '/accounts/logout/?next=/';
        window.location.href = jumpHref;
    }
}

function logout() {
    'use strict';

    var service = window.location.protocol + '//' + window.location.host + '/';

    $('.logout-load').show();
    ssoLogout.request({
        url: '/crossdomains/',
        data: {service: service},
        method: 'GET'
    }, function (resp) {
        var data = JSON.parse(resp.data);
        var crossdomains = data.crossdomains;
        var i;

        for (i = 0; i < crossdomains.length; i++) {
            crossdomains[i] = crossdomains[i] + '/accounts/logout/';
        }

        if (crossdomains.length) {
            otherWebLogout(crossdomains);
        } else {
            selfLogout(1, 1);
        }
    }, function () {
        $('.logout-load').hide();
        alert('退出失败，请稍后再试');
    });
}

