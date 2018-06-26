/*global console, define*/
define([
    'intern!object',
    'intern/chai!assert',
    'intern/chai!expect',
    "intern/dojo/request",
    'intern/chai!config',
    "./config.test",
    "../../src/scripts/app/app",
    "../../deploy/js/tpl/templates"
], function (registerSuite, assert, expect, request, chaiConfig, Config, app, tpls) {
    "use strict";
    
    registerSuite({
        name: 'Templates',
        'Test Template': function () {
            /*return this.remote
                .get('../../deploy/index.html')
                .setFindTimeout(5000)*/
        }
    });
});