var express = require('express');
var app = express();
var api_engine = require('turing_api_engine.js');

/**
 * departments route points
 */
///departments Get Departments
app.get('/departments', function (req, res) {
    api_engine.act({cmd:'department', name:'Get Departments'}, function(err, response) {
		console.log(response);
		res.send(response);
	});
});
///departments/{department_id} Get Department by ID
app.get('/departments/([0-9]+)', function (req, res) {
   res.send('success');
});

/**
 * categories route points
 */
///categories Get Categories
app.get('/categories', function (req, res) {
   res.send('success');
});
///categories/{category_id} Get Category by ID
app.get('/categories/([0-9]+)', function (req, res) {
   res.send('success');
});
///categories/inProduct/{product_id} Get Categories of a Product
app.get('/categories/inProduct/([0-9]+)', function (req, res) {
   res.send('success');
});
///categories/inDepartment/{department_id} Get Categories of a Department
app.get('/categories/inDepartment/([0-9]+)', function (req, res) {
   res.send('success');
});

/**
 * attributes route points
 */
///attributes Get Attribute list
app.get('/attributes', function (req, res) {
   res.send('success');
});
///attributes/{attribute_id} Get Attribute list
app.get('/attributes/([0-9]+)', function (req, res) {
   res.send('success');
});
///attributes/values/{attribute_id} Get Values Attribute from Atribute
app.get('/attributes/values/([0-9]+)', function (req, res) {
   res.send('success');
});
///attributes/inProduct/{product_id} Get all Attributes with Produt ID
app.get('/attributes/inProduct/([0-9]+)', function (req, res) {
   res.send('success');
});

/**
 * products route points
 */
///products Get All Products
app.get('/products', function (req, res) {
   res.send('success');
});
///products/search Search products
app.get('/products/search', function (req, res) {
   res.send('success');
});
///products/search Search products
app.get('/products/([0-9]+)', function (req, res) {
   res.send('success');
});
///products/inCategory/{category_id} Get a lit of Products of Categories
app.get('/products/inCategory/([0-9]+)', function (req, res) {
   res.send('success');
});
///products/inDepartment/{department_id} Get a list of Products on Department
app.get('/products/inDepartment/([0-9]+)', function (req, res) {
   res.send('success');
});
///products/{product_id}/details Get details of a Product
app.get('/products/([0-9]+)/details', function (req, res) {
   res.send('success');
});
///products/{product_id}/locations Get locations of a Product
app.get('/products/([0-9]+)/locations', function (req, res) {
   res.send('success');
});
///products/{product_id}/reviews Get reviews of a Product
app.get('/products/([0-9]+)/reviews', function (req, res) {
   res.send('success');
});
///products/{product_id}/reviews
app.post('/products/([0-9]+)/reviews', function (req, res) {
   res.send('success');
});

/**
 * customers route points
 */
///customer Update a customer
app.put('/customer', function (req, res) {
   res.send('success');
});
///customer Get a customer by ID. The customer is getting by Token.
app.get('/customer', function (req, res) {
   res.send('success');
});
///customers Register a Customer
app.post('/customers', function (req, res) {
   res.send('success');
});
///customers/login Sign in in the Shopping.
app.post('/customers/login', function (req, res) {
   res.send('success');
});
///customers/facebook Sign in with a facebook login token.
app.post('/customers/facebook', function (req, res) {
   res.send('success');
});
///customers/address Update the address from customer
app.put('/customers/address', function (req, res) {
   res.send('success');
});
///customers/creditCard Update the address from customer
app.put('/customers/creditCard', function (req, res) {
   res.send('success');
});

/**
 * orders route points
 */
///orders Create a Order
app.post('/orders', function (req, res) {
   res.send('success');
});
///orders/{order_id} Get Info about Order
app.get('/orders/([0-9]+)', function (req, res) {
   res.send('success');
});
///orders/{order_id} Get Info about Order
app.get('/orders/inCustomer', function (req, res) {
   res.send('success');
});
///orders/{order_id} Get Info about Order
app.get('/orders/shortDetail/([0-9]+)', function (req, res) {
   res.send('success');
});

/**
 * shoppingcart route points
 */
///shoppingcart/generateUniqueId Generete the unique CART ID
app.get('/shoppingcart/generateUniqueId', function (req, res) {
   res.send('success');
});
///shoppingcart/add Add a Product in the cart
app.post('/shoppingcart/add', function (req, res) {
   res.send('success');
});
///shoppingcart/{cart_id} Get List of Products in Shopping Cart
app.get('/shoppingcart/([0-9]+)', function (req, res) {
   res.send('success');
});
///shoppingcart/{cart_id} Get List of Products in Shopping Cart
app.put('/shoppingcart/update/([0-9]+)', function (req, res) {
   res.send('success');
});
///shoppingcart/empty/{cart_id} Empty cart
app.delete('/shoppingcart/empty/([0-9]+)', function (req, res) {
   res.send('success');
});
///shoppingcart/empty/{cart_id} Empty cart
app.get('/shoppingcart/moveToCart/([0-9]+)', function (req, res) {
   res.send('success');
});
///shoppingcart/totalAmount/{cart_id} Return a total Amount from Cart
app.get('/shoppingcart/totalAmount/([0-9]+)', function (req, res) {
   res.send('success');
});
///shoppingcart/totalAmount/{cart_id} Return a total Amount from Cart
app.get('/shoppingcart/saveForLater/([0-9]+)', function (req, res) {
   res.send('success');
});
///shoppingcart/getSaved/{cart_id} Get Products saved for latter
app.get('/shoppingcart/getSaved/([0-9]+)', function (req, res) {
   res.send('success');
});
///shoppingcart/removeProduct/{item_id} Remove a product in the cart
app.delete('/shoppingcart/removeProduct/([0-9]+)', function (req, res) {
   res.send('success');
});

/**
 * tax route points
 */
///tax Get All Taxes
app.get('/tax', function (req, res) {
   res.send('success');
});
///tax/{tax_id} Get Tax by ID
app.get('/tax/([0-9]+)', function (req, res) {
   res.send('success');
});

/**
 * shipping route points
 */
///shipping/regions Return shippings regions
app.get('/shipping/regions', function (req, res) {
   res.send('success');
});
///shipping/regions Return shippings regions
app.get('/shipping/regions/([0-9]+)', function (req, res) {
   res.send('success');
});

/**
 * stripe route points
 */
///stripe/charge This method receive a front-end payment and create a chage.
app.post('/stripe/charge', function (req, res) {
   res.send('success');
});
///stripe/webhooks Endpoint that provide a synchronization
app.post('/stripe/webhooks', function (req, res) {
   res.send('success');
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Turing API server listening at http://%s:%s", host, port)
})
