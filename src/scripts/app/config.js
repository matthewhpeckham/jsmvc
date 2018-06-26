/*global define, console, require */
define("Config", ["Router"], function (Router) {
    "use strict";
    
    /**
     * App configuration
     */
    var config = {
        version: 8,
        debugMode: false,
        serviceUrl: "http://www.bestbuy.ca/api/v2/json/",
        rootDataParam: "departments",
        router: new Router({
            "/": "productCtrl",
            "categories/:category-id": "productCtrl",
            "product/:product-id": "productDetailCtrl"
        }, {
            routeMode: "html5"
        })
    }, handlebars = require('handlebars').default; // Require the handlebars templating library
    
    // Template rendering helper functions
    handlebars.registerHelper('list', function (context, options) {
        var ret = "",
            i = 0,
            j = context.length;

        for (i, j; i < j; i += 1) {
            context[i].cleanName = context[i].name.replace(/\s+/g, '-').toLowerCase().replace(/[,\s]+/g, "");
            context[i].urlSetting = options.data.root.urlSetting;
            ret = ret + options.fn(context[i]);
        }

        return ret;
    });
    
    return config;
});