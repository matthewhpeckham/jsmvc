================================================================================
-- Setup
================================================================================

1. To install this application, please install git and node package manager (NPM).
2. Navigate into the _build/ directory, open git bash and type "npm install". This will install
the required dependencies for the application.
3. Setup a local server environment and configure a virtual host for this application.
4. Set the directory of the virtual host to the deploy/ directory of this application.
5. Visit virtual host address to view and test the application.

================================================================================
-- Design Decisions
================================================================================

I utilized the module pattern in order to contain scope and provide private and 
public accessors/methods. This allowed me to create a separation of concerns 
and in doing so I also avoided polluting the global namespace.

I have a product model with which I save product detail information once retrieved in order to 
limit the number of requests the application needs to make. Everytime a product is clicked, a render
function for that product is called. In that function we first check if the data exists already within
the model and if so, do not call the API.

Also, when a user clicks on a category, the products data will stay on the page for each category. When an existing category is clicked, it will
simply toggle the div display to none/block.

This also allowed me to map out and configure a routing system which will handle all requests
that the application receives and route to the corresponding controller. The controller will
then handle all logic (events, sending data requests, handling data, and rendering templates.)

With the routing system in place, we can deep link to urls. As well, the routing system is
configured to work with both older and more modern browsers. Modern browsers will use the history API,
whereas older ones will utilize the hash. Along with the routing system, there is a routeMode option
which can be used to specify either "html5" or "". HTML5 made will strictly utilize the history API.

However if html5 is specified as the routeMode, the application will still check to ensure compatibility and
will fall back to hash if required (example: ie9). html5 mode is useful if we want the luxory of history API 
but still want to support older browsers or if we have all requests redirected to the index.html page (rewrite module apache).

================================================================================
> Possible API limitation - Product Detail View - Associated category ID Not returned
================================================================================
When the product detail view (modal) is closed, we should return to the products
associated category listing. However, the API does not return an associated category 
when querying a product sku. This means we have no way to associate a product to a 
category. Due to this limitation, we are unable to efficiently route to a product.
The route can still be achieved and the modal and information will show, however
when the modal is closed, there will be no products on the page as we do not know
the associated products category.

We could query all products for all categories when the application loads, but this
would be very inefficient and would require many network requests every time the application
is loaded.

In the event that the API returns an associated category id along with a product, we can load in
the category items and display them behind the modal. We can then create a function within the 
router module. This function, when called from clicking the close button on a product detail 
page (modal), could set the URL back to the associated category. This function would then simply 
need to call the navigate() internal function from within router.js. This would accurately route 
to the corresponding category for the product when the modal is closed in all instances 
(new page load or customer navigated).

Alternatively a restructure of the route is another possible solution.