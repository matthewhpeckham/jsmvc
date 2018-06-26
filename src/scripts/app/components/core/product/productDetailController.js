/*global define, jQuery, console, app, performance */
define('ProductDetailCtrl', [], function () {
    "use strict";
    
    var productDetailController = function (templates, productModel, dataService) {
        var self = this;
        
        this.productModel = productModel;
        this.dataService = dataService;
        this.templates = templates;
        
        this.init = function (templates, dataService) {
            app.debug("productDetailController: init()");
        };
        
        /**
         * Call dataService to get the necessary information required to render
         * the data to the view.
         *
         * @param args String/Number - id used to retrieve data from API
         */
        this.render = function (args) {
            app.debug("productDetailController.js: render(): ", args);
            
            var product = self.productModel.get(args[0]);
            
            if (product !== null) {
                app.debug("productDetailController.js: product click event: product from model: ", product);
                self.renderProductDetails(product);
            } else {
                self.dataService.getProductDetails(self.onProductDetailsLoaded, args[0]);
            }
        };
        
        /**
         * Callback for when the product details have loaded
         *
         * @param data Object - data to be rendered to view
         */
        this.onProductDetailsLoaded = function (data) {
            app.debug("productDetailController.js: onProductDetailsLoaded(): product details: ", data);
            app.debug(self.productModel);
            
            // Gather and save to product model
            var saveData = {
                "id": data.sku,
                "associatedCategoryId": (typeof data.categoryId !== "undefined") ? data.categoryId : null,
                "thumbnailImage": data.thumbnailImage,
                "name": data.name,
                "description": data.shortDescription
            };
            
            self.productModel.set(saveData);
            self.renderProductDetails(saveData);
        };
        
        /**
         * Render the data in the template to the view. Assign required events.
         *
         * @param product Object - Data from API to be rendered
         *
         */
        this.renderProductDetails = function (product) {
            app.debug("productDetailController.js: renderProductDetails()", product);
            
            var arr = [],
                source;
            
            // Handlebars requires us to feed it an array of objects.
            arr.push(product);
            
            source = this.templates.productDetails({data: arr});
            
            // Render html to DOM
            document.getElementById("product-details").innerHTML = source;
            
            // Add click listener
            jQuery("#product-modal button#close").click(function (evt) {
                // Hide rendered content
                jQuery("#product-modal").removeClass("active");
                
                // if we know what the previous route was before we clicked on the product detail,
                // take us back to that page (route), otherwise take us back to the root
                if (typeof app.config.router.previousRoute !== "undefined" && typeof app.config.router.previousRoute.routeURL !== "undefined") {
                    app.debug("productDetailController.js: close button click: ", app.config.router.previousRoute.routeURL);
                    app.config.router.goTo(app.config.router.previousRoute.routeURL);
                } else {
                    app.config.router.goTo("/");
                }
                
                return false;
            });
            
            // Show rendered content
            jQuery("#product-modal").addClass("active");
        };
    };
    
    return productDetailController;
});