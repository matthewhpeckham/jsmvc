// Learn more about configuring this file at <https://theintern.github.io/intern/#configuration>.
// These default settings work OK for most people. The options that *must* be changed below are the packages, suites,
// excludeInstrumentation, and (if you want functional tests) functionalSuites
define({
	// Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
	// specified browser environments in the `environments` array below as well. See
	// <https://theintern.github.io/intern/#option-capabilities> for links to the different capabilities options for
	// different services.
	//
	// Note that the `build` capability will be filled in with the current commit ID or build tag from the CI
	// environment automatically
    baseUrl: '.',
	capabilities: {
		//'selenium-version': '2.53.1'
        platform: [ 'Linux', 'Mac OS 10.12' ],
        browserName: 'chrome'
	},

	// Browsers to run integration testing against. Options that will be permutated are browserName, version, platform,
	// and platformVersion; any other capabilities options specified for an environment will be copied as-is. Note that
	// browser and platform names, and version number formats, may differ between cloud testing systems.
	environments: [
		//{ browserName: 'internet explorer', version: '11', platform: 'WIN8' },
		//{ browserName: 'internet explorer', version: '10', platform: 'WIN8' },
		//{ browserName: 'internet explorer', version: '9', platform: 'WINDOWS' },
		//{ browserName: 'firefox', version: '37', platform: [ 'WINDOWS', 'MAC' ] },
		{ browserName: 'chrome', version: '54', platform: [ 'MAC' ] }
		//{ browserName: 'safari', version: '10', platform: 'MAC' }
	],

	// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
	maxConcurrency: 1,

	// Name of the tunnel class to use for WebDriver tests.
	// See <https://theintern.github.io/intern/#option-tunnel> for built-in options
    tunnel: 'NullTunnel',
    tunnelOptions: {
        drivers: [ 'chrome' ]
    },
    webdriver: {
        host: '0.0.0.0',
        port: 4444
    },

	// Configuration options for the module loader; any AMD configuration options supported by the AMD loader in use
	// can be used here.
	// If you want to use a different loader than the default loader, see
	// <https://theintern.github.io/intern/#option-useLoader> for more information.
	loaderOptions: {
		// Packages that should be registered with the loader in each testing environment
        map: {
            '*': {
                'Router': '/src/scripts/app/components/core/router/router.js',
                'MainCtrl': '/src/scripts/app/components/core/home/mainController.js',
                'ProductCtrl': '/src/scripts/app/components/core/product/productController.js',
                'ProductModel': '/src/scripts/app/components/core/product/productsModel.js',
                'ProductDetailCtrl': '/src/scripts/app/components/core/product/productDetailController.js'
            }
            // Functional Test Mapping
            /*'*': {
                'Router': '../../../../../../src/scripts/app/components/core/router/router.js',
                'MainCtrl': '../../../../../../src/scripts/app/components/core/home/mainController.js',
                'ProductCtrl': '../../../../../../src/scripts/app/components/core/product/productController.js',
                'ProductModel': '../../../../../../src/scripts/app/components/core/product/productsModel.js',
                'ProductDetailCtrl': '../../../../../../src/scripts/app/components/core/product/productDetailController.js'
            }*/
        }
	},

	// Unit test suite(s) to run in each browser
	suites: ['tests/unit/services',
             'tests/unit/router'],

	// Functional test suite(s) to execute against each browser once unit tests are completed
	//functionalSuites: [ /* 'myPackage/tests/functional' */ ],
    functionalSuites: ['tests/functional/template'],

	// A regular expression matching URLs to files that should not be included in code coverage analysis. Set to `true`
	// to completely disable code coverage.
	excludeInstrumentation: true///^(?:tests|node_modules)\//
});