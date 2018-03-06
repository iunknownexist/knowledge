/* global $, jQuery, easyXDM */
/* eslint-disable complexity */

jQuery(function () {
    'use strict';

    var rpc = new easyXDM.Rpc({
        remote: window.CAS_HOST + 'provider/'
    }, {
        remote: {
            request: {}
        }
    });
   
    $('#sso-login-form').on('submit', function () {
        var submitBtn = $('#sso-login-btn'),
            me = $(this);
        var serviceValue = $('#id_service').val();
        var username = $('#id_username').val();
        var password = $('#id_password').val();
        var loginData = {
            format: 'json',
            service: serviceValue,
            username: username,
            password: password
        };

        me.find('.errorlist').empty();

        if (!username) {
            $('#username-error').html('用户名不能为空');
            $('#id_username').focus();
            return false;
        }

        if (!password) {
            $('#password-error').html('密码不能为空');
            $('#id_password').focus();
            return false;
        }

        if (submitBtn.hasClass('loading')) {
            return false;
        }

        submitBtn.addClass('loading');

        rpc.request({
            url: '/login/',
            method: 'POST',
            data: loginData
        }, function (resp) {
            var data = JSON.parse(resp.data);
            //var urls = data.cross_domain_urls;

            if (data.state) {
                window.location = window.location.href;
            } else {
                $('#posted-error').html(data.error);
                submitBtn.removeClass('loading');
            }
        }, function () {
            $('#posted-error').html('登录失败，请稍后再试');
            submitBtn.removeClass('loading');
        });

        return false;
    });
});

