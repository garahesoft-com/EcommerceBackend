var querystring = require('querystring');
var http = require('http');
var https = require('https');

var callRESt = function(message, method, data, success) {
    var dataString = JSON.stringify(data);
    var endpoint = message.endpoint;

    var headers = {
        'Keep-Alive': 'timeout=60, max=5',
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
    };

    //Normally Http Basic authentication is a combination of user:pass. This is used
    //for the Stripe payment which expects only a key in the user field
    if(message.hasOwnProperty('user')
        && message.user != ""
        && message.hasOwnProperty('pass')) {
        var auth = "Basic " + new Buffer(message.user + ":" + message.pass).toString("base64");
        headers['Authorization'] = auth;
        headers['Content-Type'] = "application/x-www-form-urlencoded";
        console.log(headers);
        console.log(data);
    }
    //This is used in the testcase. Pass the customer_id from the testcase to the
    //REST endpoint that expects Bearer authentication using the USER-KEY header.
    if(message.hasOwnProperty('customer_id')
        && message.customer_id != "") {
        var auth = "Bearer " + new Buffer(message.customer_id.toString()).toString("base64");
        headers['user-key'] = auth;
    }
    
    if (method == 'GET') {
        if (data !== null)
            endpoint += '?' + querystring.stringify(data);
    }
    
    var options = {
        host: message.host,
        port: message.port,
        path: endpoint,
        method: method,
        headers: headers
    };
    var httproto = http;
    
    if (message.hasOwnProperty('https')
        && message.https == true)
        httproto = https;
        
    var req = httproto.request(options, function(res) {
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

module.exports = callRESt;
