define(
    ['jquery.mockjax'],
    function () {
        'use strict';
        _.extend($.mockjaxSettings,  {
            logging:       false,
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
