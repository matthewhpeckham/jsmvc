/*global define, jQuery, console, app, performance */
define('ProductCtrl', ['ProductModel',
                       'ProductDetailCtrl'], function (ProductModel, ProductDetailCtrl) {
    "use strict";
    
    var productController = function () {
        var self = this;
        
        this.init = function (templates, dataService) {
            app.debug("productController: init()");
            
            this.dataService = dataService;
            this.templates = templates;
            this.productModel = new ProductModel();
            
            // Create the product detail controller as this will be needed to show detail product information
            app.controllers.productDetailCtrl = new ProductDetailCtrl(this.templates, this.productModel, this.dataService);
        };
        
        /**
         * Call dataService to get the necessary information required to render
         * the data to the view.
         *
         * @param args String/Number - id used to retrieve data from API
         */
        this.render = function (args) {
            app.debug("productController.js: render(): args: ", args);
            
            // Set the active state on the corresponding category in the menu as we know
            // We will load a category at this point.
            jQuery('#categories ul li a').removeClass('active');
            jQuery('#categories ul li a[data-id="' + args[0] + '"]').addClass('active');
            
            if (jQuery("ul#product-list-" + args[0]).length > 0) {
                this.toggleProductListings(args[0]);
            } else {
                this.dataService.getProducts(this.onProductsLoaded, args);
            }
        };
        
        /**
         * Callback for when the products have loaded
         *
         * @param data Object - data to be rendered to view
         */
        this.onProductsLoaded = function (data) {
            app.debug("app.js: onProductsLoaded(): data: ", data);
            
            // Compile the new data into the handlebars template and render it on the DOM
            self.renderProducts(data);
        };
        
        /**
         * Render the data in the template to the view. Assign required events.
         *
         * @param data Object - Data from API to be rendered
         *
         */
        this.renderProducts = function (data) {
            app.debug("productController.js: renderProducts(): data: ", data);
            
            var url = (app.config.router.routeMode === "html5") ? "/" : "/#",
                source = this.templates.productListing({data: data.products, id: data.categoryId, urlSetting: url}),
                t0,
                t1,
                toggleListings = this.toggleProductListings(data.categoryId),
                self = this;
            
            // If we have successfully toggled the product listing,
            // then we do not need to render the HTML
            if (toggleListings === true) {
                return false;
            }

            document.getElementById("products").innerHTML = source;
            jQuery("ul#product-list-" + data.categoryId).addClass("active");
            
            // Add click listener
            jQuery("ul.product-listing li a").click(function (evt) {
                var data = {
                    "id": jQuery(this).attr('href').substring(1),
                    "pageTitle": "Category ID - " + jQuery(this).attr('href'),
                    "href": jQuery(this).attr('href'),
                    "dataid": jQuery(this).attr('data-id')
                };
                
                app.debug("productController.js: renderProducts(): data: ", data);
                app.config.router.navigate(data, true);
                
                return false;
            });
        };
        
        /**
         * Callback for when we have the product details data
         *
         * @param data Object - Data from API to be rendered
         */
        this.onProductDetailsLoaded = function (data) {
            app.debug("productController.js: onProductDetailsLoaded(): product details", data);
            app.debug(self.productModel);
            
            // Gather and save to product model
            var saveData = {
                "id": data.sku,
                "thumbnailImage": data.thumbnailImage,
                "name": data.name,
                "description": data.shortDescription
            };
            
            // Set the data to the corresponding product id in the model
            self.productModel.set(saveData);
            // Render the details according to the data
            self.renderProductDetails(saveData);
        };
        
        /**
         * Render the details of the product to the view
         *
         * @param product Object - Contains the product details and information
         */
        this.renderProductDetails = function (product) {
            app.debug("productController.js: renderProductDetails()", product);
            
            var arr = [],
                source;
            
            // Handlebars requires us to feed it an array of objects.
            arr.push(product);
            
            // Rendered HTML from handlebars template
            source = this.templates.productDetails({data: arr});
            
            // Render html to DOM
            document.getElementById("product-details").innerHTML = source;
            
            // Add click listener
            jQuery("#product-modal button#close").click(function (evt) {
                // hide rendered content
                jQuery("#product-modal").removeClass("active");
                return false;
            });
            
            // Show rendered content
            jQuery("#product-modal").addClass("active");
        };
        
        /**
         * Determine if there is already a product listing for a category.
         * If so, remove any active category from being displayed and set
         * the category (according to the category id) to active. Also
         * set the corresponding menu item active state to indicate
         * the category has been selected
         * 
         * @param categoryId
         */
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