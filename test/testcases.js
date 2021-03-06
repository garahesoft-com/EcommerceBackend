/*****************************************************
 * Copyright (c) 2019, GaraheSoft
 * <support@garahesoft.com> All rights reserved.
 *
 * This is a collection of test cases for Turing APIs
 *****************************************************/
 
var callRESt = require('../rest_client.js');

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
                endpoint: "/departments/1",
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
                endpoint: "/categories?order=name&page=1&limit=5",
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
                endpoint: "/categories/1",
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
                endpoint: "/categories/inProduct/50",
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
                endpoint: "/categories/inDepartment/2",
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
                endpoint: "/attributes/1",
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
                endpoint: "/attributes/values/2",
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
                endpoint: "/attributes/inProduct/4",
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
                endpoint: "/products?page=1&limit=2&description_length=10",
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
                endpoint: "/products/search?query_string=Couture&all_words=off&page=1&limit=2&description_length=10",
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
                endpoint: "/products/3",
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
                endpoint: "/products/inCategory/1?page=1&limit=2&description_length=10",
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
                endpoint: "/products/inDepartment/1?page=2&limit=3&description_length=20",
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
                endpoint: "/products/5/details",
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
                endpoint: "/products/8/locations",
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
                endpoint: "/products/9/reviews",
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
                endpoint: "/products/9/reviews",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            var formdata = {
                review: "this product is awesome",
                rating: 5
            }
            
            callRESt(messageparam, "POST", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    customer_update: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/customer",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            var formdata = {
                name: "Thanos",
                email: "test@turing.com",
                password: "12345",
                day_phone: "+1234567890",
                eve_phone: "+1234567890",
                mob_phone: "+1234567890"
            }
            
            callRESt(messageparam, "PUT", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    customer: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/customer",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            
            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    customer_register: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/customers",
                port: 8081
            }
            
            var formdata = {
                name: "Thanos",
                email: "test@turing19.com",
                password: "12345"
            }
            
            callRESt(messageparam, "POST", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    customer_login: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/customers/login",
                port: 8081
            }
            
            var formdata = {
                email: "test@turing.com",
                password: "12345"
            }
            
            callRESt(messageparam, "POST", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    customer_facebook: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/customers/facebook",
                port: 8081
            }
            
            var formdata = {
                access_token: "Bearer MQ=="
            }
            
            callRESt(messageparam, "POST", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    customer_update_address: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/customers/address",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            
            var formdata = {
                address_1: "Los Angeles California",
                address_2: "USA",
                city: "LA",
                region: "California",
                postal_code: "55645",
                country: "USA",
                shipping_region_id: 1
            }
            
            callRESt(messageparam, "PUT", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    customer_update_creditcard: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/customers/creditCard",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            
            var formdata = {
                credit_card: "538-672-10234",
            }
            
            callRESt(messageparam, "PUT", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    orders: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/orders",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            var formdata = {
                cart_id: 1,
                shipping_id: 1,
                tax_id: 1
            }
            
            callRESt(messageparam, "POST", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    orders_order_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/orders/1",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            
            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    orders_in_customer: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/orders/inCustomer",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            
            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    orders_shrtdetail_order_id: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/orders/shortDetail/1",
                port: 8081,
                customer_id: 1 //this will be encoded as the USER-KEY in the Bearer authentication (check callRESt method definition)
            }
            
            callRESt(messageparam, "GET", null, 
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
            var formdata = {
                cart_id: 1,
                product_id: 1,
                attributes: "turing great product"
            }
            callRESt(messageparam, "POST", formdata, 
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

            callRESt(messageparam, "GET", null, 
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
            var formdata = {
                quantity: 4
            }
            
            callRESt(messageparam, "PUT", formdata, 
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
                endpoint: "/shoppingcart/moveToCart/2",
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
                endpoint: "/shipping/regions/3",
                port: 8081
            }
            callRESt(messageparam, "GET", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    stripe_charge: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/stripe/charge",
                port: 8081
            }
            var formdata = {
                stripeToken: "sk_test_lomdOfxbm7QDgZWvR82UhV6D",
                order_id: 1,
                description: "Charge to Turing",
                amount: 100,
                currency: "usd"
            }
            
            callRESt(messageparam, "POST", formdata, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    },
    stripe_webhooks: {
        run: 
        function () {
            var messageparam = {
                host: "localhost",
                endpoint: "/stripe/webhooks",
                port: 8081
            }

            callRESt(messageparam, "POST", null, 
            function(response) {
                console.log(response);    
            });
        },
        enable: true
    }
}

module.exports = TestCase;

