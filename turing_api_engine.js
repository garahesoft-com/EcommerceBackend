var db = require ("./db.js");
var querystring = require('querystring');
var http = require('http');

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

require('seneca')({
    timeout: 60000 // 60 seconds
}) //Uses Seneca framework to start our microservice

/**
 * Microservices for departments
 */ 
.add(
    { cmd: "getDepartments" },
    function(message, done) {
        var returnObj = {};

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "SELECT * FROM department";

                db.client.query(
                query, 
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        done(null, null);
                        connectToDb("getDepartments");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    } else {
						returnObj = {
							code: "DEP_02",
						    message: Errors.DEP_02,
						    field: "department_id"
						}
					}

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for categories
 */ 
.add(
    { cmd: "getCategories" },
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
					query = ""; //todo
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
                        connectToDb("getCategories");
                        return;
                    }

                    if (result && result.length > 0) {
                        returnObj = result
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for attributes
 */ 
.add(
    { cmd: "getAttributes" },
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
                        connectToDb("getAttributes");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for products
 */ 
.add(
    { cmd: "getProductInfo" },
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
					//todo
				} else if (message.hasOwnProperty('query_string')
					&& message.hasOwnProperty('all_words')
					&& message.hasOwnProperty('page')
					&& message.hasOwnProperty('limit')
					&& message.hasOwnProperty('description_length')) {
					//todo
				} else if (message.hasOwnProperty('product_id')) {
					query = "SELECT * FROM product WHERE product_id = ?";
					conditionvalues.push(message.product_id);
				} else if (message.hasOwnProperty('category_id')
					&& message.hasOwnProperty('page')
					&& message.hasOwnProperty('limit')
					&& message.hasOwnProperty('description_length')) {
					//todo
				} else if (message.hasOwnProperty('department_id')
					&& message.hasOwnProperty('page')
					&& message.hasOwnProperty('limit')
					&& message.hasOwnProperty('description_length')) {
					//todo
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
                        connectToDb("getProductInfo");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for customers
 */ 
.add(
    { cmd: "getCustomerInfo" },
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
                        connectToDb("getCustomerInfo");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for orders
 */ 
.add(
    { cmd: "getOrderInfo" },
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
                        connectToDb("getOrderInfo");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for shoppingcart
 */ 
.add(
    { cmd: "getShoppingCartInfo" },
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
                        connectToDb("getShoppingCartInfo");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for tax
 */ 
.add(
    { cmd: "getTaxInfo" },
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
                        connectToDb("getTaxInfo");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)
/**
 * Microservices for shipping
 */ 
.add(
    { cmd: "getShippingInfo" },
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
                        connectToDb("getShippingInfo");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj = result;
                    }

                    done(null, returnObj);
                });
            } else if ((loopcounter * DBQUERYINTERVAL) >= DBCONNTIMEOUT) {
                clearInterval(timerhandle);
                returnObj.status = Status.timeout;
                done(null, returnObj);
            }
        }, DBQUERYINTERVAL);
    }
)

/**
 * Microservices for stripe
 */ 
.listen()

console.log ("RegisterMyVote Mid-tier Subsystem")
