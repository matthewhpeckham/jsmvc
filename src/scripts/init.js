/**
 * Require JS files with dependencies
 */
/*global requirejs, require, console*/
require.config({
    baseUrl: '/deploy/js',
    paths: {
        // Configure alias to full paths
        "jQuery": "lib/jquery-1.10.2.min",
        "handlebars": "lib/handlebars.min",
        "templates": "tpl/templates",
        "main": "main.min"
    },
    shim: {
        "templates": {
            exports: "",
            deps: ["main", "handlebars"]
        },
        "main": {
            exports: "main",
            deps: ["jQuery", "handlebars"]
        }
    }
});

/**
 * Handle main application initialization. Prepare main interface by requiring 
 * all necessary modules needed for the application to run.
 */
function onAppReady(obj) {
    "use strict";
    
    console.log("init.js: onAppReady");
    
    require(["MainApp", "Router", "Config", "DataService", "handlebars", "templates"], function (MainApp, Router, Config, DataService, handlebars, templates) {
        window.app = new MainApp(Config, templates, DataService);
        window.app.init();
    });
}

// Start app once required files have loaded
require(["main"], onAppReady);