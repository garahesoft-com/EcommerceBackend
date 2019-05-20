/*****************************************************
 * Copyright (c) 2019, GaraheSoft 
 * <support@garahesoft.com> All rights reserved.
 *
 * This is the set of Turing APIs. It uses Express JS
 * framework to serve the microservices. Check the
 * documentation in the docs folder for architecture,
 * and flow. Also check the testcases.js in the test
 * folder to see how it is actually used.
 *****************************************************/
var express = require('express');
var db = require ("./db.js");
var bodyParser = require('body-parser');
var app = express();

function connectToDb(invoker) {
    if (db === undefined 
        || !db.hasOwnProperty('client')
        || db.client === null
        || db.status === "disconnected") {
            db.connect();
            console.log("DB connection invoked by: " + invoker);
        }
} connectToDb("initial");

var Errors = {
    AUT_01: "Authorization code is empty.",
    AUT_02: "Access Unauthorized.",
    PAG_01: "The order is not matched 'field,(DESC|ASC)'.",
    PAG_02: "The field of order is not allow sorting.",
    USR_01: "Email or Password is invalid.",
    USR_02: "The field(s) are/is required.",
    USR_03: "The email is invalid",
    USR_04: "The email already exists.",
    USR_05: "The email doesn't exist.",
    USR_06: "this is an invalid phone number.",
    USR_07: "this is too long <FIELD NAME>.",
    USR_08: "this is an invalid Credit Card.",
    USR_09: "The Shipping Region ID is not number",
    CAT_01: "Don't exist category with this ID.",
    DEP_01: "The ID is not a number.",
    DEP_02: "Don'exist department with this ID."
};

const DBCONNTIMEOUT = 60000; //in terms of milliseconds, routine will stop trying to connect to DB after this lapsed
const DBQUERYINTERVAL = 1000; // also in terms of milliseconds, how frequent will it check the DB connection status
const DBCONNTIMEOUTERR = "Database connection timeout";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Attach an error listener middleware
app.use(function(err, req, res, next) {
    req.socket.on("error", function() {
        console.error(err);
    });
    res.socket.on("error", function() {
        console.error(err);
    });
    next();
});

/**
 * Executes all the DB queries of the APIs.
 */
function executeQuery(sql, conditions, returnObj, res, postprocess, querymode = "sp") {
    //The routine loop, Executes the service only when 
    //we are connected to the database

    var loopcounter = 0;
    var timerhandle = setInterval(function() {
        ++loopcounter;

        if (db.status == "connected") {
            clearInterval(timerhandle);
            
            db.client.query(
            sql,
            conditions,
            function(err, result, fields) {
                if (err) {
                    console.error(err);
                    db.client.end();
                    db.client = null;
                    db.status = "disconnected";
                    res.send({error: err});
                    connectToDb("executeQuery");
                    return;
                }

                if (result && result.length > 0) {
                    if (querymode == "sp")
                        returnObj = result[0];
                    else
                        returnObj = result;
                } else if (result && result.affectedRows > 0) {
					returnObj = result;
				}
                if (postprocess != undefined && postprocess != null)
                    postprocess(returnObj);
				else
					res.send(returnObj);
            });
        } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
            clearInterval(timerhandle);
            res.send({error: DBCONNTIMEOUTERR});
        }
    }, DBQUERYINTERVAL);
}

/**
 * Check for USER-KEY from the Http headers.
 * Decodes the key and assign it to customer_id
 */
function authenticate(req) {
    var returnObj = {
        status: 401,
        code: "",
        message: "",
        field: "NoAuth"
    };
    
    if (!req.headers.hasOwnProperty('user-key')) {
        returnObj.code = "AUT_02";
        returnObj.message = Errors.AUT_02;
    } else {
        if (req.headers['user-key'].toString().trim() === "") {
            returnObj.code = "AUT_01";
            returnObj.message = Errors.AUT_01;
        } else {
            var b64key = req.headers['user-key'].toString().split(' ')[1];
            var decodedb64 = new Buffer(b64key, 'base64').toString('ascii');
            var customer = { customer_id: parseInt(decodedb64) }
            
            if (customer.customer_id != null
                && customer.customer_id != "") {
                returnObj = customer;
            } else {
                returnObj.code = "AUT_02";
                returnObj.message = Errors.AUT_02;
            }
        }
    }
    
    return returnObj;
}

/**
 * This checks the mandatory fields for value
 * return an error object if mandatory field
 * is not present
 */
function basicFieldChecks(arrayoffields, req, method) {
    var returnObj = {
        status: 400,
        code: "",
        message: "",
        field: ""
    };
    
    for (var i = 0; i < arrayoffields.length; ++i) {
        var storagearea = null;
        switch(method) {
            case "get":
                storagearea = req.query;
            break;
            case "post":
            case "put":
                storagearea = req.body;
            break;
            default:
            console.error("Invalid method");
            break;
        }
        if (!storagearea.hasOwnProperty(arrayoffields[i])
            || storagearea[arrayoffields[i]] == "" 
            || storagearea[arrayoffields[i]] == null) {
            
            returnObj.code = "USR_02";
            returnObj.message = Errors.USR_02;
            returnObj.field = arrayoffields[i];

            return returnObj;
        }
    }

    return {};
}

/**
 * departments api
 */
///departments Get Departments
app.get('/departments', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_departments()";
     
    executeQuery(query, [], returnObj, res);
});

///departments/{department_id} Get Department by ID
app.get('/departments/:department_id([0-9]+)', function (req, res) {
    var returnObj = {
        status: 400,
        code: "DEP_02",
        message: Errors.DEP_02,
        field: "department_id"
    };
    
    var query = "SELECT * FROM department WHERE department_id = ?";
    conditionvalues = [
        req.params.department_id
    ];
     
    executeQuery(query, conditionvalues, returnObj, res, null, "inline");
});

/**
 * categories api
 */
///categories Get Categories
app.get('/categories', function (req, res) {
    var returnObj = {};
    
    var offset = (req.query.page - 1) * req.query.limit;
    var query = "SELECT category_id, name, description, department_id \
                 FROM category ORDER BY ? LIMIT ?, ?";
    var conditionvalues = [
        req.query.order, 
        offset, 
        parseInt(req.query.limit)
    ];
     
    executeQuery(query, conditionvalues, returnObj, res, function(returnObj) {
		var newReturnObj = {
			count: returnObj.length,
			rows: returnObj
		}
		res.send(newReturnObj);
	}, "inline");
});
///categories/{category_id} Get Category by ID
app.get('/categories/:category_id([0-9]+)', function (req, res) {
    var returnObj = {
        status: 400,
        code: "CAT_01",
        message: Errors.CAT_01,
        field: "category_id"
    };

    var query = "SELECT * FROM category WHERE category_id = ?";
    var conditionvalues = [
        req.params.category_id
    ];
     
    executeQuery(query, conditionvalues, returnObj, res, null, "inline");
});
///categories/inProduct/{product_id} Get Categories of a Product
app.get('/categories/inProduct/:product_id([0-9]+)', function (req, res) {
    var returnObj = {
        status: 400,
        code: "CAT_01",
        message: Errors.CAT_01,
        field: "product_id"
    };
    
    var query = "CALL catalog_get_categories_for_product(?)";
    var conditionvalues = [
        req.params.product_id
    ];
     
    executeQuery(query, [conditionvalues], returnObj, res);
});
///categories/inDepartment/{department_id} Get Categories of a Department
app.get('/categories/inDepartment/:department_id([0-9]+)', function (req, res) {
    var returnObj = {
        status: 400,
        code: "CAT_01",
        message: Errors.CAT_01,
        field: "department_id"
    };

    var query = "CALL catalog_get_department_categories(?)";
    var conditionvalues = [
        req.params.department_id
    ]

    executeQuery(query, [conditionvalues], returnObj, res);
});

/**
 * attributes api
 */
///attributes Get Attribute list
app.get('/attributes', function (req, res) {
    var returnObj = {};

    var query = "CALL catalog_get_attributes()";

    executeQuery(query, [], returnObj, res);
});
///attributes/{attribute_id} Get Attribute list
app.get('/attributes/:attribute_id([0-9]+)', function (req, res) {
    var returnObj = {};

    var query = "CALL catalog_get_attribute_details(?)";
    var conditionvalues = [
        req.params.attribute_id
    ];

    executeQuery(query, [conditionvalues], returnObj, res);
});
///attributes/values/{attribute_id} Get Values Attribute from Atribute
app.get('/attributes/values/:attribute_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_attribute_values(?)";
    var conditionvalues = [
        req.params.attribute_id
    ];

    executeQuery(query, [conditionvalues], returnObj, res);
});
///attributes/inProduct/{product_id} Get all Attributes with Produt ID
app.get('/attributes/inProduct/:product_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_product_attributes(?)";
    var conditionvalues = [
        req.params.product_id
    ];

    executeQuery(query, [conditionvalues], returnObj, res);
});

/**
 * products api
 */
///products Get All Products
app.get('/products', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_products_on_catalog(?)";
    var conditionvalues = [
        req.query.description_length,
        req.query.limit,
        (req.query.page - 1) * req.query.limit
    ];

    executeQuery(query, [conditionvalues], returnObj, res, function(returnObj) {
		var newReturnObj = {
			count: returnObj.length,
			rows: returnObj
		}
		res.send(newReturnObj);
	});
});
///products/search Search products
app.get('/products/search', function (req, res) {
    var fldchk = basicFieldChecks(["query_string"], req, "get");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });

    var returnObj = {};
    
    var offset = (req.query.page - 1) * req.query.limit;
    var searchpattern = "";
    if (req.query.all_words === "on")
        searchpattern = "name = '" + req.query.query_string + "'";
    else
        searchpattern = "name LIKE '%" + req.query.query_string + "'";
        
    var query = "SELECT product_id, name, LEFT(description, ?), price, discounted_price, thumbnail \
                 FROM product WHERE " + searchpattern + " LIMIT ?, ?";

    var conditionvalues = [
        parseInt(req.query.description_length), 
        offset, 
        parseInt(req.query.limit)
    ];

    executeQuery(query, conditionvalues, returnObj, res, function(returnObj) {
		var newReturnObj = {
			count: returnObj.length,
			rows: returnObj
		}
		res.send(newReturnObj);
	}, "inline");
});
///products/{product_id} Product by ID
app.get('/products/:product_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_product_info(?)";
    var conditionvalues = [
        req.params.product_id
    ];

    executeQuery(query, [conditionvalues], returnObj, res);
});
///products/inCategory/{category_id} Get a lit of Products of Categories
app.get('/products/inCategory/:category_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_products_in_category(?)";
    var conditionvalues = [
        req.params.category_id,
        req.query.description_length,
        req.query.limit,
        (req.query.page - 1) * req.query.limit
    ];

    executeQuery(query, [conditionvalues], returnObj, res, function(returnObj) {
		var newReturnObj = {
			count: returnObj.length,
			rows: returnObj
		}
		res.send(newReturnObj);
	});
});
///products/inDepartment/{department_id} Get a list of Products on Department
app.get('/products/inDepartment/:department_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_products_on_department(?)";
    var conditionvalues = [
        req.params.department_id,
        req.query.description_length,
        req.query.limit,
        (req.query.page - 1) * req.query.limit
    ];

    executeQuery(query, [conditionvalues], returnObj, res, function(returnObj) {
		var newReturnObj = {
			count: returnObj.length,
			rows: returnObj
		}
		res.send(newReturnObj);
	});
});
///products/{product_id}/details Get details of a Product
app.get('/products/:product_id([0-9]+)/details', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_product_details(?)";
    var conditionvalues = [
        req.params.product_id
    ];

    executeQuery(query, [conditionvalues], returnObj, res);
});
///products/{product_id}/locations Get locations of a Product
app.get('/products/:product_id([0-9]+)/locations', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_product_locations(?)";
    var conditionvalues = [
        req.params.product_id
    ];

    executeQuery(query, [conditionvalues], returnObj, res);
});
///products/{product_id}/reviews Get reviews of a Product
app.get('/products/:product_id([0-9]+)/reviews', function (req, res) {
    var returnObj = {};
    
    var query = "CALL catalog_get_product_reviews(?)";
    var conditionvalues = [
        req.params.product_id
    ];

    executeQuery(query, [conditionvalues], returnObj, res);
});
///products/{product_id}/reviews
app.post('/products/:product_id([0-9]+)/reviews', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });
  
    var fldchk = basicFieldChecks(["review", "rating"], req, "post");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {};
    
    var query = "CALL catalog_create_product_review(?)";
    var conditionvalues = [
        auth.customer_id, 
        req.params.product_id, 
        req.body.review, 
        req.body.rating
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res, function(returnObj) {
		res.send({});
	});
});

/**
 * customers api
 */
///customer Update a customer
app.put('/customer', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });
    
    var fldchk = basicFieldChecks(["name", "email"], req, "put");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
            
    var returnObj = {
        status: 400,
        code: "USR_05",
        message: Errors.USR_05,
        field: "email"
    };
    
    var query = "CALL customer_update_account(?)";
    var conditionvalues = [
        auth.customer_id, 
        req.body.name, 
        req.body.email, 
        req.body.password,
        req.body.day_phone,
        req.body.eve_phone,
        req.body.mob_phone
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///customer Get a customer by ID. The customer is getting by Token.
app.get('/customer', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });
        
    var returnObj = {};
    
    var query = "CALL customer_get_customer(?)";
    var conditionvalues = [
        auth.customer_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///customers Register a Customer
app.post('/customers', function (req, res) {
    var fldchk = basicFieldChecks(["name", "email", "password"], req, "post");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {
        status: 400,
        code: "USR_04",
        message: Errors.USR_04,
        field: "email"
    };
    
    var query = "CALL customer_add(?)";
    var conditionvalues = [ 
        req.body.name, 
        req.body.email, 
        req.body.password
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res, function(returnObj) {
		res.send(returnObj);
        /*var newreturnObj = {
            customer: { schema: returnObj[0] },
            accessToken: "Bearer " + new Buffer(returnObj[0].customer_id.toString()).toString("base64"),
            expires_in: "24h"
        }*/
    });
});
///customers/login Sign in in the Shopping.
app.post('/customers/login', function (req, res) {
    var fldchk = basicFieldChecks(["email", "password"], req, "post");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {
        status: 400,
        code: "USR_01",
        message: Errors.USR_01,
        field: "email,password"
    };
    
    var query = "SELECT customer_id, name, email, address_1, address_2, city, \
                region, postal_code, country, shipping_region_id, day_phone, \
                eve_phone, mob_phone, credit_card \
                FROM customer WHERE email = ? AND password = ?";

    var conditionvalues = [
        req.body.email, 
        req.body.password
    ];
    
    executeQuery(query, conditionvalues, returnObj, res, function(returnObj) {
        var newreturnObj = {
            customer: { schema: returnObj[0] },
            accessToken: "Bearer " + new Buffer(returnObj[0].customer_id.toString()).toString("base64"),
            expires_in: "24h"
        }
        res.send(newreturnObj);
    }, "inline");
});
///customers/facebook Sign in with a facebook login token.
app.post('/customers/facebook', function (req, res) {
    var fldchk = basicFieldChecks(["access_token"], req, "post");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {};
    
    var query = "CALL (?)";
    var conditionvalues = [];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///customers/address Update the address from customer
app.put('/customers/address', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });

    var fldchk = basicFieldChecks(["address_1", "city", "region", "postal_code", "country", "shipping_region_id"], req, "put");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {
        status: 400,
        code: "USR_09",
        message: Errors.USR_09,
        field: "shipping_region_id"
    };
    
    var query = "CALL customer_update_address(?)";
    var conditionvalues = [
        auth.customer_id, 
        req.body.address_1, 
        req.body.address_2, 
        req.body.city,
        req.body.region,
        req.body.postal_code,
        req.body.country,
        req.body.shipping_region_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///customers/creditCard Update the address from customer
app.put('/customers/creditCard', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });

    var fldchk = basicFieldChecks(["credit_card"], req, "put");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {
        status: 400,
        code: "USR_08",
        message: Errors.USR_08,
        field: "credit_card"
    };
    
    var query = "CALL customer_update_credit_card(?)";
    var conditionvalues = [
        auth.customer_id, 
        req.body.credit_card
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});

/**
 * orders api
 */
///orders Create a Order
app.post('/orders', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });

    var fldchk = basicFieldChecks(["cart_id", "shipping_id", "tax_id"], req, "post");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {};
    
    var query = "INSERT INTO orders SET created_on = NOW(), customer_id = ?, shipping_id = ?, tax_id = ?";
    var conditionvalues = [
        auth.customer_id, 
        req.body.shipping_id,
        req.body.tax_id
    ];
    
    executeQuery(query, conditionvalues, returnObj, res, function(returnObj) {
        res.send({ orderId: returnObj.insertId });
    }, "inline");
});
///orders/{order_id} Get Info about Order
app.get('/orders/:order_id([0-9]+)', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });

    var returnObj = {};
    
    var query = "CALL orders_get_order_details(?)";
    var conditionvalues = [
        req.params.order_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///orders/inCustomer Get orders by Customer
app.get('/orders/inCustomer', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });

    var returnObj = {};
    
    var query = "CALL orders_get_by_customer_id(?)";
    var conditionvalues = [
        auth.customer_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///orders/shortDetail/{order_id} Get Info about Order
app.get('/orders/shortDetail/:order_id([0-9]+)', function (req, res) {
    var auth = authenticate(req);
    if (auth.hasOwnProperty('status'))
        return res.status(auth.status).json({ error: auth });

    var returnObj = {};
    
    var query = "CALL orders_get_order_short_details(?)";
    var conditionvalues = [
        req.params.order_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});

/**
 * shoppingcart api
 */
///shoppingcart/generateUniqueId Generete the unique CART ID
app.get('/shoppingcart/generateUniqueId', function (req, res) {
    var generateId = function() {
        var result = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 20; i++)
            result += possible.charAt(Math.floor(Math.random() * possible.length));

        return result;
    }

    res.send({ cart_id: generateId() });
});
///shoppingcart/add Add a Product in the cart
app.post('/shoppingcart/add', function (req, res) {
    var fldchk = basicFieldChecks(["cart_id", "product_id", "attributes"], req, "post");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {};
    
    var query = "CALL shopping_cart_add_product(?)";
    var conditionvalues = [
        req.body.cart_id,
        req.body.product_id,
        req.body.attributes
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///shoppingcart/{cart_id} Get List of Products in Shopping Cart
app.get('/shoppingcart/:cart_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "SELECT sc.item_id, p.name, sc.attributes, sc.product_id, \
                COALESCE(NULLIF(p.discounted_price, 0), p.price) AS price, sc.quantity, p.image, \
                COALESCE(NULLIF(p.discounted_price, 0), p.price) * sc.quantity AS subtotal \
                FROM shopping_cart sc INNER JOIN product p \
                ON sc.product_id = p.product_id \
                WHERE sc.cart_id = ? AND sc.buy_now";
    var conditionvalues = [
        req.params.cart_id
    ];
    
    executeQuery(query, conditionvalues, returnObj, res, null, "inline");
});
///shoppingcart/update/{item_id} Update the cart by item
app.put('/shoppingcart/update/:item_id([0-9]+)', function (req, res) {
    var fldchk = basicFieldChecks(["quantity"], req, "put");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });
        
    var returnObj = {};
    
    var query = "CALL shopping_cart_update(?)";
    var conditionvalues = [
        req.params.item_id,
        req.body.quantity
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///shoppingcart/empty/{cart_id} Empty cart
app.delete('/shoppingcart/empty/:cart_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL shopping_cart_empty(?)";
    var conditionvalues = [
        req.params.cart_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///shoppingcart/moveToCart/{item_id} Move a product to cart
app.get('/shoppingcart/moveToCart/:item_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL shopping_cart_move_product_to_cart(?)";
    var conditionvalues = [
        req.params.item_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///shoppingcart/totalAmount/{cart_id} Return a total Amount from Cart
app.get('/shoppingcart/totalAmount/:cart_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL shopping_cart_get_total_amount(?)";
    var conditionvalues = [
        req.params.cart_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///shoppingcart/saveForLater/{item_id} Save a Product for latter
app.get('/shoppingcart/saveForLater/:item_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL shopping_cart_save_product_for_later(?)";
    var conditionvalues = [
        req.params.item_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///shoppingcart/getSaved/{cart_id} Get Products saved for latter
app.get('/shoppingcart/getSaved/:cart_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL shopping_cart_get_saved_products(?)";
    var conditionvalues = [
        req.params.cart_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});
///shoppingcart/removeProduct/{item_id} Remove a product in the cart
app.delete('/shoppingcart/removeProduct/:item_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "CALL shopping_cart_remove_product(?)";
    var conditionvalues = [
        req.params.item_id
    ];
    
    executeQuery(query, [conditionvalues], returnObj, res);
});

/**
 * tax api
 */
///tax Get All Taxes
app.get('/tax', function (req, res) {
    var returnObj = {};
    
    var query = "SELECT * FROM tax";
    
    executeQuery(query, [], returnObj, res, null, "inline");
});
///tax/{tax_id} Get Tax by ID
app.get('/tax/:tax_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "SELECT * FROM tax WHERE tax_id = ?";
    var conditionvalues = [
        req.params.tax_id
    ];
    
    executeQuery(query, conditionvalues, returnObj, res, null, "inline");
});

/**
 * shipping api
 */
///shipping/regions Return shippings regions
app.get('/shipping/regions', function (req, res) {
    var returnObj = {};
    
    var query = "SELECT * FROM shipping_region";
    
    executeQuery(query, [], returnObj, res, null, "inline");
});
///shipping/regions/{shipping_region_id} Return shippings regions
app.get('/shipping/regions/:shipping_region_id([0-9]+)', function (req, res) {
    var returnObj = {};
    
    var query = "SELECT * FROM shipping WHERE shipping_region_id = ?";
    var conditionvalues = [
        req.params.shipping_region_id
    ];
    
    executeQuery(query, conditionvalues, returnObj, res, null, "inline");
});

/**
 * stripe api
 */
///stripe/charge This method receive a front-end payment and create a chage.
app.post('/stripe/charge', function (req, res) {
    var fldchk = basicFieldChecks(["stripeToken", "order_id", "description", "amount"], req, "post");
    if (fldchk.hasOwnProperty('status'))
        return res.status(fldchk.status).json({ error: fldchk });

    const stripe = require("stripe")(req.body.stripeToken);
    
    stripe.charges.create({
        amount: req.body.amount,
        currency: req.body.currency,
        source: "tok_visa", // obtained with Stripe.js
        metadata: {'order_id': req.body.order_id},
        description: req.body.description
    }/*, {
        idempotency_key: "fTIArBVOxZzSSkmz"
    }*/, function(err, charge) {
        if (err) {
            console.error (err);
            res.send(err);
        } else {
            res.send(charge);
        }
    });
});
///stripe/webhooks Endpoint that provide a synchronization
app.post('/stripe/webhooks', function (req, res) {
    res.send({ received: true });
});

/**
 * Run the API server
 */
var server = app.listen(8081, "0.0.0.0", function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Turing API server listening at http://%s:%s", host, port);
});

server.timeout = 120000; // 2 minutes timeout for every API call
