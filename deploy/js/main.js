/*global define, console, app, performance */
define('MainApp', ['MainCtrl', 'ProductCtrl'], function (MainCtrl, ProductCtrl) {
    "use strict";
    
    /**
     * MainApp constructor
     */
    /*function MainApp(config) {
        this.init(config);
    }*/
    
    var MainApp = function (config, templates, DataService) {
        var self = this;
        
        this.config = config;
        this.controllers = [];
        this.init = function () {
            this.debug("app.js: init()");
            
            var dataService = new DataService(),
                mainCtrl = new MainCtrl(),
                productCtrl = new ProductCtrl();/*,
                productDetailCtrl = new ProductDetailCtrl();*/
            
            mainCtrl.init(templates, dataService, this.onControllerReady);
            productCtrl.init(templates, dataService);
            
            this.controllers.count = 0;
            this.controllers.mainCtrl = mainCtrl;
            this.controllers.productCtrl = productCtrl;
            //this.controllers.productDetailCtrl = productDetailCtrl;
            /*- productCtrl - contain list of products in model
                - needs to update when switching departments
            - departmentsListCtrl - list of departments in model
                - when an item is clicked, needs to render products from the productCtrl*/
        };
        
        this.onControllerReady = function () {
            self.config.router.navigate();
        };
        
        this.loadController = function (ctrl, args) {
            this.controllers[ctrl].render(args);
        };
        
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
/*global define, console, require */
define("Config", ["Router"], function (Router) {
    "use strict";
    
    var config = {
        version: 4,
        debugMode: true,
        serviceUrl: "http://www.bestbuy.ca/api/v2/json/",
        rootDataParam: "departments",
        router: new Router({
            "/": "productCtrl",
            "categories/:category-id": "productCtrl",
            "categories/:category-id/:product-id": "productDetailCtrl"
        })
    }, handlebars = require('handlebars').default; // Require the handlebars templating library
    
    // Template rendering helper functions
    handlebars.registerHelper('list', function (context, options) {
        var ret = "",
            i = 0,
            j = context.length;

        for (i, j; i < j; i += 1) {
            context[i].cleanName = context[i].name.replace(/\s+/g, '-').toLowerCase().replace(/[,\s]+/g, "");
            ret = ret + options.fn(context[i]);
        }

        return ret;
    });
    
    return config;
});
/*global app,define,$,console */
define('DataService', function () {
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
    
    DataService.prototype.getProductDetails = function (skuId, callback) {
        app.debug("dataService.js: getProductDetails()");
        
        //this.callService(app.config.serviceUrl + "product/" + skuId, "jsonp", callback);
    };
    
    DataService.prototype.callService = function (url, dataType, callback, categoryId) {
        app.debug("dataService.js: callService(): categoryId: " + categoryId);
        
        $.ajax({
            url: url,
            dataType: dataType,
            success: function (data) {
                if (typeof categoryId !== "undefined") {
                    data.categoryId = categoryId[0];
                }
                callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("oops");
                callback(textStatus);
            }
        });
    };
    
    return DataService;
});
/*global define, jQuery, console, app, performance */
define('ProductCtrl', function () {
    "use strict";
    
    var productController = function () {
        var self = this;
        
        this.init = function (templates, dataService) {
            app.debug("productController: init()");
            this.dataService = dataService;
            this.templates = templates;
        };
        
        this.render = function (args) {
            app.debug("RENDER: ", args);
            app.debug(args[0]);
            app.debug("element length: ", jQuery("ul#product-list-" + args[0]).length);
            if (jQuery("ul#product-list-" + args[0]).length > 0) {
                this.toggleProductListings(args[0]);
            } else {
                this.dataService.getProducts(this.onProductsLoaded, args);
            }
        };
        
        /**
         * 
         */
        this.onProductsLoaded = function (data) {
            app.debug("app.js: onProductsLoaded(): data: ", data);
            
            // Compile the new data into the handlebars template and render it on the DOM
            self.renderProducts(data);
        };
        
        /**
         *
         */
        this.renderProducts = function (data) {
            app.debug("productController.js: renderProducts(): data: ", data);
            var source = this.templates.productInfo({data: data.products, id: data.categoryId}),
                t0,
                t1,
                toggleListings = this.toggleProductListings(data.categoryId);
            
            // If we have successfully toggle the product listing,
            // then we do not need to render the HTML
            if (toggleListings === true) {
                return false;
            }

            // Performance - getElementById()
            t0 = performance.now();
            document.getElementById("products").innerHTML += source;
            jQuery("ul#product-list-" + data.categoryId).addClass("active");
            t1 = performance.now();

            app.debug('#products: Time to find element by Id: ' + (t1 - t0) + 'ms');
        };
        
        this.toggleProductListings = function (categoryId) {
            // Set currently view listing display value to none by removing the active class
            jQuery("ul.product-listing").removeClass("active");
            
            if (jQuery("ul#product-list-" + categoryId).length > 0) {
                jQuery("ul#product-list-" + categoryId).addClass("active");
                return true;
            } else {
                return false;
            }
        };
    };
    
    return productController;
});
/*global define, jQuery, console, app, performance */
define('MainCtrl', function () {
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
        
        /**
         *
         */
        this.render = function () {
            // TODO: if statement here. Check our model associated with mainCtrl for the data first.
            // if the data does not exist, then pull from API, otherwise just render the data on the page :)
            
            // Retrieve the departments from the api and pass a callback
            this.dataService.getDepartments(this.onDepartmentsLoaded);
        };
        
        /**
         *
         */
        this.onDepartmentsLoaded = function (data) {
            app.debug("MainController: onDepartmentsLoaded()", data);
            
            // Compile the new data into the handlebars template and render it on the DOM
            self.renderCategories(data);
        };
        
        /**
         *
         */
        this.renderCategories = function (data) {
            app.debug("app.js: renderCategories()", data);

            var source = this.templates.productDetails({data: data.subCategories}),
                d0,
                d1;

            // Performance - getElementById()
            d0 = performance.now();
            document.getElementById("categories").innerHTML = source;
            d1 = performance.now();
            app.debug('#categories: Time to find element by Id: ' + (d1 - d0) + 'ms');
            
            jQuery("#categories ul li a").click(function (evt) {
                var data = {
                    "id": jQuery(this).attr('href').substring(1),
                    "pageTitle": "Category ID - " + jQuery(this).attr('href'),
                    "href": jQuery(this).attr('href'),
                    "data-id": jQuery(this).attr('data-id')
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
/*global define, jQuery, console, app, performance */
define('Router', function () {
    "use strict";
    
    var router = function (routes) {
        var self = this;
        
        // matchWord matches the window.location.href to the corresponding route name
        this.matchWord = /^[a-zA-Z\-]+$/;
        // matchExpression matches custom expression used when defining routes to indicate dynamic parameters
        this.matchExpression = /:(.*?\/)/g;
        // Keep only letters, numbers, and slashes. Discard everything else.
        this.cleanse = /[^a-zA-Z0-9\/ ]/g;
        // Maintain routes object
        this.routes = routes;
        
        /**
         * Convert any dynamic route keynames to generic string
         */
        this.getCleansedRoutes = function () {
            var r = 0,
                cleansedRoutes = {},
                controller,
                newkey,
                match;
            
            for (r in routes) {
                if (routes.hasOwnProperty(r)) {
                    controller = routes[r];
                    
                    r = (r !== "/") ? r + "/" : r;
                    newkey = r.replace(this.matchExpression, ":id/");
                    match  = r.match(this.matchExpression);

                    cleansedRoutes[newkey] = controller;
                    self.routes = cleansedRoutes;
                }
            }
        };
        
        /**
         * Configure routing object and set the current route
         */
        this.init = function () {
            console.log("router.js: init()");
            
            this.getCleansedRoutes();
        };
        
        /**
         * Retrieve the current url path (route)
         */
        this.getRoute = function () {
            console.log("router.js: getRoute(): ", decodeURI(window.location.pathname.slice(1)).replace(this.cleanse, ""));
            
            // Use push state if available
            if (this.isPushStateAvailable() === true) {
                return decodeURI(window.location.pathname.slice(1));
            } else {
                // Otherwise, use hash
                return decodeURI(location.hash.slice(1));
            }
        };
        
        /**
         * Set the current route everytime the url hash changes, then navigate to the new route.
         * @param data - hash data
         */
        this.onHashChange = function (data) {
            app.debug(data);
            self.currentRoute = self.getRoute();
            self.navigate();
        };
        
        /**
         *
         */
        this.navigate = function (data) {
            app.debug("router.js: navigate()");
            
            if (typeof data !== "undefined") {
                app.debug("=============");
                app.debug("id: ", data.id);
                app.debug("pageTitle: ", data.pageTitle);
                app.debug("href: ", data.href);
                app.debug("=============");
                window.history.pushState({"id": data.id, "pageTitle": data.pageTitle}, "", data.href);
                this.currentRoute = this.getRoute();
                app.debug("router.js: navigate(): this.currentRoute: ", this.currentRoute);
            } else {
                this.currentRoute = this.getRoute();
                window.history.replaceState({"id": this.currentRoute, "pageTitle": "Category ID - " + this.currentRoute}, "", "/" + this.currentRoute);
            }
            
            // Get the keyword from the url, exclude empty cases
            var temp = this.currentRoute.split('/').filter(function (el) {return el.length !== 0; }),
                arrLength = temp.length,
                matchKeyword = (arrLength > 0) ? temp[0].match(this.matchWord) : null,
                self = this,
                i = 0,
                args = [],
                converted,
                cleanName,
                cleanId;
            
            // Confirm there was a match for the first index of the route.
            if (matchKeyword !== null) {
                app.debug("router.js: keyword: " + matchKeyword);
                app.debug("router,js: temp: ", temp);
                
                for (i; i < arrLength; i += 1) {
                    app.debug("router.js: args array pre: ", temp[i]);
                    if (temp[i] !== matchKeyword[0]) {
                        cleanName = temp[i].replace(self.cleanse, "");
                        cleanId = jQuery('#categories ul li a[data-name="' + temp[i] + '"]').attr('data-id');
                        
                        if (typeof cleanId !== 'undefined') {
                            args.push(cleanId);
                        }
                        
                        converted = cleanName.replace(cleanName, ":id/");
                        self.currentRoute = self.currentRoute.replace(temp[i], converted);
                    }
                }
                
                this.loadController(args);
            } else {
                app.debug("router.js: Root or bad route");
                this.goToRoot();
            }
        };
        
        this.loadController = function (args) {
            app.debug("router.js: this.currentRoute: ", this.currentRoute);
            app.debug("args: ", args);
            
            if (args.length > 0 && typeof this.routes[this.currentRoute] !== 'undefined') {
                app.debug("router.js: loadController(): we have args: ", args);
                app.debug("router.js: loadController(): routes object: ", this.routes);
                app.debug("router.js: loadController(): route: ", this.currentRoute);
                app.debug("router.js: loadController(): controller: ", this.routes[this.currentRoute]);
                app.loadController(this.routes[this.currentRoute], args);
            } else {
                app.debug("router.js: loadController(): No route available");
                self.goToRoot();
            }
        };
        
        /**
         * 
         */
        this.goToRoot = function () {
            app.debug("router.js: goToRoot()");
            
            this.currentRoute = "/";
            
            if (this.isPushStateAvailable() === true) {
                window.history.pushState({"pageTitle": "All Departments"}, "", "/");
            } else {
                window.location.hash = "";
            }
            
            app.loadController(this.routes[this.currentRoute], app.config.rootDataParam);
        };
        
        // Listen on hash change
        window.addEventListener('hashchange', this.onHashChange);
        
        // Handle the back and forward browser buttons
        window.onpopstate = function (evt) {
            app.debug(evt);
            
            var state = evt.state;
            
            if (state) {
                self.currentRoute = evt.state.id;
                self.navigate();
            } else {
                self.goToRoot();
            }
        };
        
        this.isPushStateAvailable = function () {
            return !!(typeof window !== 'undefined' && window.history && window.history.pushState);
        };

        this.isHashChangeAPIAvailable = function () {
            return !!(typeof window !== 'undefined' && window.hasOwnProperty('onhashchange') === true);
        };
        
        this.init();
    };
    
    return router;
});