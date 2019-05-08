var db = require ("./db.js");
var querystring = require('querystring');

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

modules.exports = require('seneca')({
    timeout: 60000 // 60 seconds
}) //Uses Seneca framework to start our microservice

/**
 * Microservices for departments
 */ 
.add(
    { cmd: "department" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
				var conditionvalues = [];
				returnObj = {
					code: "DEP_02",
					message: Errors.DEP_02,
					field: "department_id"
				};
				if (message.hasOwnProperty('department_id')) {
					query = "SELECT * FROM department WHERE department_id = ?";
					conditionvalues.push(message.department_id);
				} else {
					query = "SELECT * FROM department";
				}
				
                db.client.query(
                query,
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("department");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }
 
                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for categories
 */ 
.add(
    { cmd: "category" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];
                
                if (message.hasOwnProperty('order')
					&& message.hasOwnProperty('page')
					&& message.hasOwnProperty('limit')) {
					var offset = (message.page - 1) * message.limit;
					query = "SELECT * FROM category ORDER BY ? LIMIT ?, ?";
					conditionvalues = [message.order, offset, message.limit];
				} else if (message.hasOwnProperty('category_id') {
					query = "SELECT * FROM category WHERE category_id = ?";
					conditionvalues.push(message.category_id);
					returnObj = {
						code: "CAT_01",
					    message = Errors.CAT_01,
					    field = "category_id"
					};
				} else if (message.hasOwnProperty('product_id') {
					query = "SELECT c.* FROM category c INNER JOIN product_category pc \
							 ON c.category_id = pc.category_id \
							 WHERE pc.product_id = ?";
					conditionvalues.push(message.product_id);
					returnObj = {
						code: "CAT_01",
					    message = Errors.CAT_01,
					    field = "product_id"
					};
				} else if (message.hasOwnProperty('department_id') {
					query = "SELECT * FROM category WHERE department_id = ?"
					conditionvalues.push(message.department_id);
					returnObj = {
						code: "CAT_01",
					    message = Errors.CAT_01,
					    field = "department_id"
					};
				}

                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("category");
                        return;
                    }

                    if (result && result.length > 0) {
                        returnObj = result
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for attributes
 */ 
.add(
    { cmd: "attribute" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];
                
                if (message.hasOwnProperty('attribute_id')) {
					query = "SELECT * FROM attribute WHERE attribute_id = ?";
					conditionvalues.push(message.attribute_id);
				} else if (message.hasOwnProperty('attribute_id_val')) {
					query = "SELECT * FROM attribute_value WHERE attribute_id = ?";
					conditionvalues.push(message.attribute_id_val);
				} else if (message.hasOwnProperty('product_id')) {
					query = "SELECT a.name AS attribute_name, av.attribute_value_id, av.value AS attribute_value \
					         FROM attribute a INNER JOIN attribute_value av \
					         ON a.attribute_id = av.attribute_id \
					         INNER JOIN product_attribute pa \
					         ON av.attribute_value_id = pa.attribute_value_id \
					         WHERE pa.product_id = ?";
					conditionvalues.push(message.product_id);
				} else {
					query = "SELECT * FROM attribute";
				}

                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("attribute");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for products
 */ 
.add(
    { cmd: "product" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];
                
                if (message.hasOwnProperty('page')
					&& message.hasOwnProperty('limit')
					&& message.hasOwnProperty('description_length')) {
					var offset = (message.page - 1) * message.limit;
					query = "SELECT product_id, name, LEFT(description, ?), price, discounted_price, thumbnail \
							 FROM product LIMIT ?, ?";
					conditionvalues = [message.description_length, offset, message.limit];
				} else if (message.hasOwnProperty('query_string')
					&& message.hasOwnProperty('all_words')
					&& message.hasOwnProperty('page')
					&& message.hasOwnProperty('limit')
					&& message.hasOwnProperty('description_length')) {
					var offset = (message.page - 1) * message.limit;
					var searchpattern = "";
					if (message.all_words === "on")
						searchpattern = "name = ?";
					else
						searchpattern = "name LIKE %?%";
						
					query = "SELECT product_id, name, LEFT(description, ?), price, discounted_price, thumbnail \
							 FROM product WHERE " + searchpattern + " LIMIT ?, ?";
					conditionvalues = [message.description_length, message.query_string, offset, message.limit];
				} else if (message.hasOwnProperty('product_id')) {
					query = "SELECT * FROM product WHERE product_id = ?";
					conditionvalues.push(message.product_id);
				} else if (message.hasOwnProperty('category_id')
					&& message.hasOwnProperty('page')
					&& message.hasOwnProperty('limit')
					&& message.hasOwnProperty('description_length')) {
					var offset = (message.page - 1) * message.limit;
					query = "SELECT p.product_id, p.name, LEFT(p.description, ?), p.price, p.discounted_price, p.thumbnail \
							 FROM product p INNER JOIN product_category pc \
							 ON p.product_id = pc.product_id \
							 WHERE pc.category_id = ? LIMIT ?, ?";
					conditionvalues = [message.description_length, message.category_id, offset, message.limit];
				} else if (message.hasOwnProperty('department_id')
					&& message.hasOwnProperty('page')
					&& message.hasOwnProperty('limit')
					&& message.hasOwnProperty('description_length')) {
					var offset = (message.page - 1) * message.limit;
					query = "SELECT p.product_id, p.name, LEFT(p.description, ?), p.price, p.discounted_price, p.thumbnail, p.display \
							 FROM product p INNER JOIN product_category pc \
							 ON p.product_id = pc.product_id \
							 INNER JOIN category c \
							 ON pc.category_id = c.category_id \
							 INNER JOIN department d \
							 ON c.department_id = d.department_id \
							 WHERE d.department_id = ? LIMIT ?, ?";
					conditionvalues = [message.description_length, message.department_id, offset, message.limit];
				} else if (message.hasOwnProperty('product_id_dtl')) {
					query = "SELECT product_id, name, description, price, discounted_price \
					         image, image_2 FROM product WHERE product_id = ?"
					conditionvalues.push(message.product_id_dtl);
				} else if (message.hasOwnProperty('product_id_loc')) {
					query = "SELECT c.category_id, c.name AS category_name, d.department_id, d.name AS department_name \
					         FROM category c INNER JOIN department d \
					         ON c.department_id = d.department_id \
					         INNER JOIN product_category pc \
					         ON c.category_id = pc.category_id \
					         WHERE pc.product_id = ?";
					conditionvalues.push(message.product_id_loc);		          
				} else if (message.hasOwnProperty('product_id_rev')) {
					query = "SELECT c.name, r.review, r.rating, r.created_on \
					         FROM customer c INNER JOIN review r \
					         ON c.customer_id = r.customer_id \
					         WHERE r.product_id = ?";
					condtionvalues.push(message.product_id_rev);
				}
                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("product");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for customers
 */ 
.add(
    { cmd: "customer" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];

                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("customer");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for orders
 */ 
.add(
    { cmd: "order" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];

                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("order");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for shoppingcart
 */ 
.add(
    { cmd: "shoppingcart" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

			var generateId = function() {
                var result = "";
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    
                for (var i = 0; i < 20; i++)
                    result += possible.charAt(Math.floor(Math.random() * possible.length));
    
                return result;
            }
            
            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];
                if (message.hasOwnProperty('cart_id')
					&& message.hasOwnProperty('product_id')
					&& message.hasOwnProperty('attributes')) {
					query = "INSERT INTO shopping_cart SET cart_id = ?, product_id = ?, attributes = ?";
					conditionvalues = [message.cart_id, message.product_id, message.attributes];
				} else if (message.hasOwnProperty('cart_id')) {
					query = "SELECT sc.item_id, p.name, sc.attributes, sc.product_id, \
					         p.price, sc.quantity, p.image, (p.price * sc.quantity) AS subtotal \
					         FROM shopping_cart sc INNER JOIN product p \
					         ON sc.product_id = p.product_id \
					         WHERE sc.cart_id = ?";
					conditionvalues.push(message.cart_id);
				} else if (message.hasOwnProperty('item_id')
					&& message.hasOwnProperty('quantity')) {
					query = "UPDATE shopping_cart SET quantity = ? WHERE item_id = ?";
					conditionvalues = [message.quantity, message.item_id];
				} else if (message.hasOwnProperty('cart_id_del') {
					query = "DELETE FROM shopping_cart WHERE cart_id = ?";
					conditionvalues.push(message.cart_id_del);
				} else if (message.hasOwnProperty('item_id_mov')) {
					//todo
				} else if (message.hasOwnProperty('cart_id_tamt')) {
					query = "SELECT SUM(p.price * sc.quantity) AS total_amount \
					         FROM shopping_cart sc INNER JOIN product p \
					         ON sc.product_id = p.product_id \
					         WHERE sc.cart_id = ?";
					 conditionvalues.push(message.cart_id_tamt);
				} else if (message.hasOwnProperty('item_id_sav')) {
					//todo
				} else if (message.hasOwnProperty('cart_id_svd')) {
					query = "SELECT sc.item_id, p.name, sc.attributes, p.price \
					         FROM shopping_cart sc INNER JOIN product p \
					         ON sc.product_id = p.product_id \
					         WHERE sc.cart_id = ?";
					conditionvalues.push(message.cart_id_svd);
				} else if (message.hasOwnProperty('item_id_rem')) {
					query = "DELETE FROM shopping_cart WHERE item_id = ?";
					conditionvalues.push(message.item_id_rem);
				} else {
					returnObj = {
						cart_id: generateId();
					}
					done(null, returnObj);
					return;
				}
				
                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("shoppingcart");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for tax
 */ 
.add(
    { cmd: "tax" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];
				if (message.hasOwnProperty('tax_id')) {
					query = "SELECT * FROM tax WHERE tax_id = ?";
					conditionvalues.push(message.tax_id);
				} else {
					query = "SELECT * FROM tax";
				}
				
                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("tax");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)
/**
 * Microservices for shipping
 */ 
.add(
    { cmd: "shipping" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];
				if (message.hasOwnProperty('shipping_region_id')) {
					query = "SELECT * FROM shipping WHERE shipping_region_id = ?";
					conditionvalues.push(message.shipping_region_id);
				} else {
					query = "SELECT * FROM shipping_region";
				}
                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("shipping");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for stripe
 */ 
.add(
    { cmd: "stripe" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";
                var conditionvalues = [];

                db.client.query(
                query, 
                conditionvalues,
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("stripe");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)
