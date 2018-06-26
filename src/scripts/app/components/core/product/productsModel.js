/*global define */
define('ProductModel', [], function () {
    "use strict";
    
    var productsModel = function () {
        
        // Array of product information
        this.data = [];
        var mydata = [];
        
        /**
         * Set the product into the data array for future reference.
         * This will avoid unecessary calls to the API
         *
         * @param data Object - Product data to be saved
         */
        this.set = function (data) {
            this.data[data.id] = data;
        };
        
        /**
         * Retrieve product information according to the 
         * product identifier
         *
         * @param Number - Product ID
         */
        this.get = function (productId) {
            if (typeof this.data[productId] !== "undefined") {
                return this.data[productId];
            } else {
                return null;
            }
        };
    };

    return productsModel;
});