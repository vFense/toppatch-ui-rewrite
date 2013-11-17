define(
    ['jquery.mockjax'],
    function (mockjax) {
        'use strict';
        _.extend($.mockjaxSettings,  {
            status:        200,
            statusText:     'OK',
            responseTime:  0,
            isTimeout:     false,
            contentType:   'application/json',
            response:      '',
            responseText:  '',
            responseXML:   '',
            proxy:         '',
            lastModified:  null,
            etag:          ''
        });
        return $.mockjax;
    }
);