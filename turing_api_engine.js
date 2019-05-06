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

var Status = {
    noops: "noops",     //no operation made
    fail: "fail",       //operation failed
    timeout: "timeout", //connection timed out
    success: "success"  //operation is successful
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

        //The routine loop, Executes the service only when 
        //we are connected to the database
        var loopcounter = 0;
        var timerhandle = setInterval(function() {
            ++loopcounter;

            if (db.status == "connected") {
                clearInterval(timerhandle);

                var query = "";

                db.client.query(
                query, 
                [],
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        db.client.end();
                        db.client = null;
                        db.status = "disconnected";
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getDepartments");
                        return;
                    }
                    
                    if (result && result.length > 0) {
                        returnObj.status = Status.success;
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

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
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getCategories");
                        return;
                    }
                    
                    if (result && result.length > 1) {
                        returnObj.status = Status.success;
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

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
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getAttributes");
                        return;
                    }
                    
                    if (result && result.length > 1) {
                        returnObj.status = Status.success;
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

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
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getProductInfo");
                        return;
                    }
                    
                    if (result && result.length > 1) {
                        returnObj.status = Status.success;
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

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
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getCustomerInfo");
                        return;
                    }
                    
                    if (result && result.length > 1) {
                        returnObj.status = Status.success;
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

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
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getOrderInfo");
                        return;
                    }
                    
                    if (result && result.length > 1) {
                        returnObj.status = Status.success;
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

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
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getShoppingCartInfo");
                        return;
                    }
                    
                    if (result && result.length > 1) {
                        returnObj.status = Status.success;
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

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
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getTaxInfo");
                        return;
                    }
                    
                    if (result && result.length > 1) {
                        returnObj.status = Status.success;
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
        var returnObj = { status: Status.noops };

        if (!message.hasOwnProperty('')
            ) {
                console.error("Invalid parameter");
                returnObj.status = Status.fail;
                done (null, returnObj);
                return;
        }

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
                        returnObj.status = Status.fail;
                        done(null, returnObj);
                        connectToDb("getShippingInfo");
                        return;
                    }
                    
                    if (result && result.length > 1) {
                        returnObj.status = Status.success;
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
