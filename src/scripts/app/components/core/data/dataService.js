/*global app,define,$,console */
define('DataService', [], function () {
    "use strict";
    
    function DataService() {
        this.init();
    }
    
    DataService.prototype.init = function () {
        app.debug("dataService.js: init()");
    };
    
    DataService.prototype.getDepartments = function (callback) {
        app.debug("dataService.js: getDepartments()");
        
        this.callService(app.config.serviceUrl + "category/Departments", "jsonp", callback);
    };
    
    DataService.prototype.getProducts = function (callback, categoryId) {
        app.debug("dataService.js: getProducts()");
        
        this.callService(app.config.serviceUrl + "search?categoryid=" + categoryId, "jsonp", callback, categoryId);
    };
    
    DataService.prototype.getProductDetails = function (callback, skuId, categoryId) {
        app.debug("dataService.js: getProductDetails()");
        
        this.callService(app.config.serviceUrl + "product/" + skuId, "jsonp", callback, categoryId);
    };
    
    /**
     * Call the API with a url, dataType, and callback.
     * 
     * @param url String - URL endpoint of API
     * @param dataType String - The response format we expect to receive
     * @param callback Function - function to call once the response has finished
     * @param categoryId (optional) String/Number - a category id for reference afterwards
     */
    DataService.prototype.callService = function (url, dataType, callback, categoryId) {
        app.debug("dataService.js: callService(): categoryId: " + categoryId);
        
        $.ajax({
            url: url,
            dataType: dataType,
            success: function (data) {
                if (typeof categoryId !== "undefined") {
                    data.categoryId = categoryId[0];
                }
                return callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                return callback(textStatus);
            }
        });
    };
    
    return DataService;
});