/*******************************************************
 * Copyright (c) 2019, Gerald Selvino 
 * <gnsapp2k18@tutanota.com> All rights reserved.
 *
 * This is the database configuration file. 
 * Compatible for MySQL and MariaDB.
 *******************************************************/
 
var config = {
    user: "turing-db-user", 
    database: "turing-db", 
    password: "turing-DB-pass123456", 
    host: 'localhost',
    port: 3306, 
    connectionLimit: 10
};

module.exports = config;
