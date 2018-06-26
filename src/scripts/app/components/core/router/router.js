/*global define, jQuery, console, app, performance */
define('Router', [], function () {
    "use strict";
    
    var router = function (routes, options) {
        var self = this;
        
        // matchWord matches the window.location.href to the corresponding route name
        this.matchWord = /^[a-zA-Z\-]+$/;
        // matchExpression matches custom expression used when defining routes to indicate dynamic parameters
        this.matchExpression = /:(.*?\/)/g;
        // Maintain routes object
        this.routes = routes;
        // Check to see if a route mode has been explicity specified in the options
        this.routeMode = (typeof options !== "undefined" && options.routeMode !== null) ? options.routeMode : "hash";
        // previous route
        this.previousRoute = "";
        
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
            
            return self.routes;
        };
        
        /**
         * Configure routing object and set the current route
         */
        this.init = function () {
            console.log("router.js: init()");
            
            // In the event that html5 mode has been set, we still need to account for older browsers and
            // ensure that they will work with html5. If not, we have to fall back to using hash
            if (this.isPushStateAvailable() === false) {
                this.routeMode = "hash";
            }
            
            this.getCleansedRoutes();
        };
        
        /**
         * Retrieve the current url path (route)
         *
         * @params String (optional) href - The route we want to navigate to 
         */
        this.getRoute = function (href) {
            app.debug("router.js: getRoute(): this.routeMode: ", this.routeMode);
            
            if (this.isPushStateAvailable() === true && this.routeMode === "html5") {
                return decodeURI(window.location.pathname.slice(1));
            } else {
                if (typeof href !== "undefined") {
                    return href.substr(2);
                } else {
                    // Otherwise, use hash
                    return decodeURI(location.hash.slice(1));   
                }
            }
        };
        
        /**
         * Go to a specific route 
         */
        this.goTo = function (route) {
            app.debug("router.js: goTo: route: " + route);
            app.debug("router.js: goTo: this.routeMode: " + this.routeMode);
            
            var newRoute;
            newRoute = (route.length > 1) ? "/" + route : "/";
            
            if (this.isPushStateAvailable() === true && this.routeMode === "html5") {
                window.history.pushState({"id": 0, "pageTitle": ""}, "", newRoute);
            } else {
                newRoute = (newRoute !== "/") ? newRoute.substr(1) : newRoute;
                window.location.href = (newRoute === "/") ? newRoute + "#" : newRoute;
            }
            
            this.navigate();
        };
        
        /**
         * Navigate to a route via a data object containing the route info. 
         * Otherwise call getRoute() and navigate to the route URL returned.
         *
         * @param data Object - The route object
         * @param useId Boolean - true/false if using id or string for route
         */
        this.navigate = function (data, useId) {
            app.debug("router.js: navigate(): data:", data);
            app.debug("router.js: navigate(): ", this.previousRoute);
            
            if (typeof data !== "undefined") {                
                if (this.isPushStateAvailable() === true) {
                    window.history.pushState({"id": data.id, "pageTitle": data.pageTitle}, "", data.href);
                } else {
                    window.location.href = data.href;    
                }
                
                this.currentRoute = this.getRoute(data.href);
            } else {
                this.currentRoute = this.getRoute();
                
                if (this.isPushStateAvailable() === true && this.routeMode === "html5") {
                    window.history.replaceState({
                        "id": this.currentRoute || "/", 
                        "href": this.previousRoute.data,
                        "pageTitle": "" + this.currentRoute
                    }, "", "/" + this.currentRoute);
                }
            }
            
            app.debug("router.js: navigate(): this.currentRoute: ", this.currentRoute);
            
            // Get the keyword from the url, exclude empty cases
            var temp = this.currentRoute.split('/').filter(function (el) {return el.length !== 0; }),
                arrLength = temp.length,
                matchKeyword = (arrLength > 0) ? temp[0].match(this.matchWord) : null,
                self = this,
                i = 0,
                args = [],
                converted,
                cleanName,
                cleanId,
                rawArgs,
                previousData;
            
            // Confirm there was a match for the first index of the route.
            if (matchKeyword !== null) {
                app.debug("router.js: keyword: " + matchKeyword);
                app.debug("router,js: temp: ", temp);
                
                // Loop through the data in currentRoute and if matches a keyword, push the id
                // into an arguments array. This will represent the route arguments.
                for (i; i < arrLength; i += 1) {
                    app.debug("router.js: args array: ", temp[i]);
                    
                    if (temp[i] !== matchKeyword[0]) {
                        cleanName = temp[i].replace(self.cleanse, "");
                        
                        if (typeof useId !== "undefined" && useId === true) {
                            cleanId = data.dataid;
                        } else {
                            cleanId = jQuery('#' + temp[0] + ' ul li a[data-name="' + temp[i] + '"]').attr('data-id');
                        }
                        
                        if (typeof cleanId !== 'undefined') {
                            args.push(cleanId);
                        } else {
                            args.push(cleanName);
                        }
                        
                        converted = cleanName.replace(cleanName, ":id/");
                        rawArgs = self.currentRoute;
                        self.currentRoute = self.currentRoute.replace(temp[i], converted);
                    }
                }

                // Set the previous route data for reference when returning to a route in the future
                previousData = this.previousRoute.data || this.previousRoute.routeURL;
                this.previousRoute = {
                    routeURL: previousData,
                    data: (this.routeMode === "html5") ? rawArgs : "/#" + rawArgs,
                    route: this.currentRoute
                };
                
                // Load the routes associated controller
                this.loadController(args);
            } else {
                app.debug("router.js: Root or bad route");
                
                // Set the previous route data for reference when returning to a route in the future
                previousData = this.previousRoute.data;
                this.previousRoute = {
                    routeURL: "/",
                    data: null,
                    route: this.currentRoute
                };
                
                // Go the the root document if no route was found
                this.goToRoot();
            }
        };
        
        /**
         * Load the associated routes controller, passing through the args.
         * 
         * @param args Array - Array of arguments to tell the controller what data to load 
         */
        this.loadController = function (args) {
            app.debug("router.js: this.currentRoute: ", this.currentRoute);
            app.debug("router.js: args: ", args);
            
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
         * Go to the root document
         */
        this.goToRoot = function () {
            app.debug("router.js: goToRoot()");
            
            this.currentRoute = "/";
            
            if (this.isPushStateAvailable() === true) {
                window.history.pushState({"pageTitle": "All Departments"}, "", "/");
            }
            
            app.loadController(this.routes[this.currentRoute], app.config.rootDataParam);
        };
        
        // Handle the back and forward browser buttons
        /*window.onpopstate = function (evt) {
            app.debug(evt);
            
            var state = evt.state;
            
            if (state !== null) {
                console.log(state.id);
                self.currentRoute = evt.state.id;
                self.navigate(state);
            } else {
                self.goToRoot();
            }
        };*/
        
        // Check if push state is available
        this.isPushStateAvailable = function () {
            return !!(typeof window !== 'undefined' && window.history && window.history.pushState);
        };
        
        this.init();
    };
    
    return router;
});