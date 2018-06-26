/*global define, console, app, performance */
define('MainApp', ['MainCtrl', 
                   'ProductCtrl'], function (MainCtrl, ProductCtrl) {
    "use strict";
    
    /**
     * MainApp constructor
     */
    var MainApp = function (config, templates, DataService) {
        var self = this;
        
        this.config = config;
        this.controllers = [];
        this.init = function () {
            this.debug("app.js: init()");
            
            var dataService = new DataService(),
                mainCtrl = new MainCtrl(),
                productCtrl = new ProductCtrl();
            
            mainCtrl.init(templates, dataService, this.onControllerReady);
            productCtrl.init(templates, dataService);
            
            this.controllers.count = 0;
            this.controllers.mainCtrl = mainCtrl;
            this.controllers.productCtrl = productCtrl;
        };
        
        /**
         * Wait for mainCtrl to load before routing.
         */
        this.onControllerReady = function () {
            self.config.router.navigate();
        };
        
        /**
         * This function will pass through data that the controller
         * will then use to render to the view.
         * 
         * @param ctrl String - The controller we want data loaded from and 
         *               rendered to the view
         * @param args String/Number - id used to retrieve data from API
         */
        this.loadController = function (ctrl, args) {
            this.controllers[ctrl].render(args);
        };
        
        /**
         * Application local log function. For the purpose of controlling
         * the log output in a more efficient way.
         *
         * @param msg String - Message to log out
         * @param obj Object - Object to log out  
         */
        this.debug = function (msg, obj) {
            if (config.debugMode === true) {
                if (typeof obj !== 'undefined') {
                    console.log(msg, obj);
                } else {
                    console.log(msg);
                }
            }
        };
    };

    return MainApp;
});