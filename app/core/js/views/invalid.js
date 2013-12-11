define(
    ['core/js/views/template', 'core/template/http_status_code'],
    function (templateView, template) {
        'use strict';
        var i18n = {
            '404': {
                'status-code': '404',
                'status-message': 'Sorry. The page you requested does not exist.',
                'what-cause': 'What could have caused this?',
                'cause': [
                    'We may have removed, or renamed, the page.',
                    'The link you clicked might be old and does not work anymore.',
                    'You may have accidentally typed the wrong URL.'
                ],
                'what-action': 'What can you do?',
                'action': [
                    'Try retyping the URL.',
                    'Go to the RemediationVault <a href="/">homepage</a>.'
                ],
                'trouble': 'Still having trouble?',
                'contact': 'Please contact us, and <a href="http://toppatch.com/top-patch-contact-us/" target="_blank">let us know what went wrong.</a>'
            }
        };
        return templateView.extend({
            template: template,
            code: '404',
            setCode: function (code) {
                this.code = code;
                if (this.isClosed !== false) {
                    this.render();
                }
            },
            getData: function () {
                return i18n[this.code];
            }
        });
    }
);
