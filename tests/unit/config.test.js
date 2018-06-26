/*global define, console, require */
define(["Router"], function (Router) {
    "use strict";
    
    /**
     * App configuration
     */
    var config = {
        version: 8,
        debugMode: false,
        serviceUrl: "http://www.bestbuy.ca/api/v2/json/",
        departmentsUrl: "category/Departments",
        productsUrl: "search?categoryid=",
        productDetailUrl: "product/",
        rootDataParam: "departments",
        router: new Router({
            "/": "productCtrl",
            "categories/:category-id": "productCtrl",
            "product/:product-id": "productDetailCtrl"
        }, {
            routeMode: "html5"
        })
    };
    
    return config;
});