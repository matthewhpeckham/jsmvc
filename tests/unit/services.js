define([
    'intern!object',
    'intern/chai!assert',
    'intern/chai!expect',
    "intern/dojo/request",
    'intern/chai!config',
    "./config.test",
    '../../deploy/js/lib/jquery-1.10.2.min',
    "../../src/scripts/app/app",
    "../../src/scripts/app/components/core/data/dataService"
], function (registerSuite, assert, expect, request, chaiConfig, Config, $, app, DataService) {
    registerSuite({
        name: 'Data Services',
        setup: function () {
            window.app = new app(Config, null, DataService);
            console.log(Config);
            dataService = new DataService();
        },
        before: function () {
            var iDiv = document.createElement('div');
            iDiv.id = 'block';
            iDiv.className = 'block';
            var elem = document.getElementsByTagName('body')[0].appendChild(iDiv);
            elem.style.backgroundColor = "#EAEAEA";
            $(elem).css("border", "1px solid #999");
            $(elem).css("padding", "20px");
            $(elem).css("width", "400px");
            $(elem).css("margin", "100px auto 0px auto");
            $(elem).css("textAlign", "center");

            iDiv.innerHTML = "Please wait while API Services are tested.<br/>There is a 10 second timeout per call.";
        },
        'Verify Required Functions': function () {
            expect(dataService, "dataService should be defined").to.not.be.undefined;
            assert.isFunction(dataService.getDepartments, 'dataService.getDepartments() should be a function');
            assert.isFunction(dataService.getProducts, 'dataService.getProducts() should be a function');
            assert.isFunction(dataService.getProductDetails, 'dataService.getProductDetails() should be a function');
            assert.isFunction(dataService.callService, 'dataService.callService() should be a function');
        },
        'Verify Departments Service Request Success (with parameters)': function () {            
            var dfd = this.async(10000);
            dataService.callService(window.app.config.serviceUrl + window.app.config.departmentsUrl, "jsonp",                     dfd.callback(function(result) {
                            expect(result, "Result is not an object").to.be.a('object');
                            window.app.categoryId = result.subCategories[0].id;
                        }));
        },
        'Verify Product Service Request Success (with parameters)': function () {            
            var dfd = this.async(10000);
            dataService.callService(window.app.config.serviceUrl + window.app.config.productsUrl + window.app.categoryId, "jsonp",                    dfd.callback(function(result) {
                            expect(result, "Result is not an object").to.be.a('object');
                            window.app.productId = result.products[0].sku;
                        }));
        },
        'Verify Product Detail Service Request Success (with parameters)': function () {
            var dfd = this.async(10000);
            dataService.callService(window.app.config.serviceUrl + window.app.config.productDetailUrl + window.app.productId, "jsonp",                    dfd.callback(function(result) {
                            expect(result, "Result is not an object").to.be.a('object');
                        }));
        }
    });
});