/*******************************************************
 * Copyright (c) 2019, GaraheSoft
 * <support@garahesoft.com> All rights reserved.
 *
 * This is the database configuration file. 
 * Compatible for MySQL and MariaDB.
 *******************************************************/
 
var config = {
    user: "ecommerce-db-user", 
    database: "ecommerce-db", 
    password: "ecommerce-DB-pass123456", 
    host: 'localhost',
    port: 3306, 
    connectionLimit: 10
};

module.exports = config;
