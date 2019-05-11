var querystring = require('querystring');
var http = require('http');

var callRESt = function(message, method, data, success) {
    var dataString = JSON.stringify(data);
    var headers = {};
    var endpoint = message.endpoint;

    if (method == 'GET') {
        endpoint += '?' + querystring.stringify(data);
    } else {
        headers = {
            'Keep-Alive': 'timeout=15, max=5',
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };

        if(message.hasOwnProperty('customer_id')
        && message.customer_id !== "") {
            var auth = "Bearer " + new Buffer(message.customer_id).toString("base64");
            headers['USER-KEY'] = auth;
        }
    }

    var options = {
        host: message.host,
        port: message.port,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            var responseObject = {};
            try {
                responseObject = JSON.parse(responseString);
            } catch(exception) {
                console.error(exception.message);
            } finally {
                success(responseObject);
            }
        });
    });
    req.on('error', (err) => {
        console.error(err.message);
    });

    req.write(dataString);
    req.end();
}

var TestCase = {
    departments: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/departments",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    departments_dept_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/departments/134234",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    categories: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/categories",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    categories_category_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/categories/20",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    categories_inprod_prod_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/categories/inProduct/3430",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    categories_indept_dept_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/categories/inDepartment/1234",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    attributes: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/attributes",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    attributes_attribute_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/attributes/45",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    attributes_values_attrib_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/attributes/values/3434",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    attributes_inproduct_prod_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/attributes/inProduct/4342",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products_search: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products/search",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products_prod_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products/34343",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products_incategory_cat_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products/inCategory/1",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products_indept_dept_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products/inDepartment/1",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products_prod_id_details: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products/1/details",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products_prod_id_location: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products/1/locations",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products_prod_id_reviews: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products/1/reviews",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    products_prod_id_reviews_post: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/products/1/reviews",
                port: 8081
            }

            callRESt(messageparam, "POST", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_generateuid: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/generateUniqueId",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_add: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/add",
                port: 8081
            }

            callRESt(messageparam, "POST", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_cart_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/1",
                port: 8081
            }

            callRESt(messageparam, "POST", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_update_item_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/update/1",
                port: 8081
            }

            callRESt(messageparam, "PUT", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_empty_cart_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/empty/1",
                port: 8081
            }

            callRESt(messageparam, "DELETE", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_move_item_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/moveToCart/1",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_total_cart_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/totalAmount/1",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_save_item_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/saveForLater/1",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_getsav_cart_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/getSaved/1",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shoppingcart_remove_item_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shoppingcart/removeProduct/1",
                port: 8081
            }

            callRESt(messageparam, "DELETE", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    tax: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/tax",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    tax_tax_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/tax/1",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shipping_regions: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shipping/regions",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    shipping_regions_shpng_rgn_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/shipping/regions/1",
                port: 8081
            }

            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    }
}

module.exports = TestCase;

