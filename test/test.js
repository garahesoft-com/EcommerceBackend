/*****************************************************
 * Copyright (c) 2019, Gerald Selvino 
 * <gnsapp2k18@tutanota.com> All rights reserved.
 *
 * This is the test runner for the testcases.js
 *****************************************************/
 
var testcases = require('./testcases.js');

var testrunner = function(testcase) {
    if (testcase !== null
        && testcase !== undefined
        && testcase.hasOwnProperty('enable')
        && testcase.hasOwnProperty('run')
        && testcase.enable) {
            testcase.run();
        }
};

console.log("|======================|");
console.log("| Running testcases... |");
console.log("|______________________|");
console.log("\r\n");

/**
 * Uncomment a testcase to execute
 */

//testrunner(testcases['departments']);
//testrunner(testcases['departments_dept_id']);
//testrunner(testcases['categories']);
//testrunner(testcases['categories_category_id']);
//testrunner(testcases['categories_inprod_prod_id']);
//testrunner(testcases['categories_indept_dept_id']);
//testrunner(testcases['attributes']);
//testrunner(testcases['attributes_attribute_id']);
//testrunner(testcases['attributes_values_attrib_id']);
//testrunner(testcases['attributes_inproduct_prod_id']);
//testrunner(testcases['products']);
//testrunner(testcases['products_search']);
//testrunner(testcases['products_prod_id']);
//testrunner(testcases['products_incategory_cat_id']);
//testrunner(testcases['products_indept_dept_id']);
//testrunner(testcases['products_prod_id_details']);
//testrunner(testcases['products_prod_id_location']);
//testrunner(testcases['products_prod_id_reviews']);
//testrunner(testcases['products_prod_id_reviews_post']);
//testrunner(testcases['shoppingcart_generateuid']);
//testrunner(testcases['shoppingcart_add']);
//testrunner(testcases['shoppingcart_cart_id']);
//testrunner(testcases['shoppingcart_update_item_id']);
//testrunner(testcases['shoppingcart_empty_cart_id']);
//testrunner(testcases['shoppingcart_move_item_id']);
//testrunner(testcases['shoppingcart_total_cart_id']);
//testrunner(testcases['shoppingcart_save_item_id']);
//testrunner(testcases['shoppingcart_getsav_cart_id']);
//testrunner(testcases['shoppingcart_remove_item_id']);
//testrunner(testcases['tax']);
//testrunner(testcases['tax_tax_id']);
//testrunner(testcases['shipping_regions']);
//testrunner(testcases['shipping_regions_shpng_rgn_id']);
//testrunner(testcases['stripe_charge']);
//testrunner(testcases['stripe_webhooks']);
