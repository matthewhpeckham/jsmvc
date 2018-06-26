define("templates", function() { var Handlebars = require("handlebars"); var templates = []; 
 templates["categoryListing"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "    <li>\r\n        <a data-id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" data-name=\""
    + alias2(alias1((depth0 != null ? depth0.cleanName : depth0), depth0))
    + "\" href=\""
    + alias2(alias1((depth0 != null ? depth0.urlSetting : depth0), depth0))
    + "categories/"
    + alias2(alias1((depth0 != null ? depth0.cleanName : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</a>\r\n    </li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul>\r\n"
    + ((stack1 = (helpers.list || (depth0 && depth0.list) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),{"name":"list","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});
templates["productDetails"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "    <h2>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</h2>\n    <img src=\""
    + alias2(alias1((depth0 != null ? depth0.thumbnailImage : depth0), depth0))
    + "\" alt=\"\"/>\n    <h2>Description</h2> \n    <p id=\"desc\">"
    + alias2(alias1((depth0 != null ? depth0.description : depth0), depth0))
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<button id=\"close\">Close</button>\n"
    + ((stack1 = (helpers.list || (depth0 && depth0.list) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),{"name":"list","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates["productListing"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "    <li>\n        <a data-id=\""
    + alias2(alias1((depth0 != null ? depth0.sku : depth0), depth0))
    + "\" href=\""
    + alias2(((helper = (helper = helpers.urlSetting || (depth0 != null ? depth0.urlSetting : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"urlSetting","hash":{},"data":data}) : helper)))
    + "product/"
    + alias2(alias1((depth0 != null ? depth0.sku : depth0), depth0))
    + "\">\n            <img src=\""
    + alias2(alias1((depth0 != null ? depth0.thumbnailImage : depth0), depth0))
    + "\" alt=\"\"/>\n            <span>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</span>\n        </a>\n    </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "<ul class=\"product-listing\" id=\"product-list-"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = (helpers.list || (depth0 && depth0.list) || alias2).call(alias1,(depth0 != null ? depth0.data : depth0),{"name":"list","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true}); return templates; });