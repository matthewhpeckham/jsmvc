/*global define, jQuery, console, app, performance */
define('MainCtrl', [], function () {
    "use strict";
    
    var mainController = function () {
        var self = this;
        
        this.init = function (templates, dataService, callback) {
            app.debug("mainController: init()", dataService);
            
            this.dataService = dataService;
            this.templates = templates;
            this.callback = callback;
            
            this.render();
        };
        
        this.greet = function (name) {
            return (typeof name !== "undefined") ? "Hello " + name + "!" : "Hello World!";
        };
        
        /**
         * Call dataService to get the necessary information required to render
         * the data to the view.
         */
        this.render = function () {
            // Retrieve the departments from the api and pass a callback
            this.dataService.getDepartments(this.onDepartmentsLoaded);
        };
        
        /**
         * Callback for when we have the department data 
         *
         * @param data Object - Data from API to be rendered
         */
        this.onDepartmentsLoaded = function (data) {
            app.debug("MainController: onDepartmentsLoaded()", data);
            
            // Compile the new data into the handlebars template and render it on the DOM
            self.renderCategories(data);
        };
        
        /**
         * Render the data in the template to the view. Assign required events.
         *
         * @param data Object - Data from API to be rendered
         *
         */
        this.renderCategories = function (data) {
            app.debug("app.js: renderCategories()", data);
            app.debug("app.config.router.routeMode: ", app.config.router.routeMode);
            
            var url = (app.config.router.routeMode === "html5") ? "/" : "/#",
                source = this.templates.categoryListing({data: data.subCategories, urlSetting: url}),
                d0,
                d1;

            document.getElementById("categories").innerHTML = source;
            
            // Click event for all categories
            jQuery("#categories ul li a").click(function (evt) {
                var data = {
                    "id": jQuery(this).attr('href').substring(1),
                    "pageTitle": "Category ID - " + jQuery(this).attr('href'),
                    "href": jQuery(this).attr('href'),
                    "dataid": jQuery(this).attr('data-id')
                };
                
                app.config.router.navigate(data);
                return false;
            });
            
            // Fire callback signaling that this controller has finished rendering
            if (this.callback) {
                this.callback();
                delete this.callback;
            }
        };
    };
    
    return mainController;
});