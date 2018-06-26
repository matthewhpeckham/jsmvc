define([
    'intern!object',
    'intern/chai!assert',
    'intern/chai!expect',
    "intern/dojo/request",
    'intern/chai!config',
    "./config.test",
    '../../deploy/js/lib/jquery-1.10.2.min',
    "../../src/scripts/app/app"
], function (registerSuite, assert, expect, request, chaiConfig, Config, $, app) {    
    registerSuite({
        name: 'Router',
        'Test Routing Expression': function () {
            
            // First testing expression woot
            var r = 0,
                routes = Config.router.routes;
            expect(routes).to.not.be.undefined;
            
            for (r in routes) {
                var result = r.match(Config.router.matchExpression);
                
                if (r !== "" && r !== "/") {
                    expect(result).to.not.be.null;
                }
            }
        },
        'Test Push State Detection': function () {
            assert.isBoolean(Config.router.isPushStateAvailable(), "isPushStateAvailable should return value of type Boolean");
        }
    });
});