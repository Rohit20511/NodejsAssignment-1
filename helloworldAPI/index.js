'use strict';

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

//@author - Rohit Jaiswal
var server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer(function (req, res) {
  server.unifiedServer(req, res);
});


// Define function unifiedServer
const unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const queryStringObject = parsedUrl.query;
  const method = req.method.toUpperCase();
  const headers = req.headers;
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => buffer += decoder.write(data));   //when event emits
  req.on('end', () => {
    buffer += decoder.end();
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    const data = { trimmedPath, queryStringObject, method, headers, payload: buffer };

    chosenHandler(data, function (statusCode, payload) {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      payload = typeof (payload) == 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('***********************************************');
      console.info('Returning this response: ', statusCode, payloadString);
      console.log('***********************************************');
    });
  });
}

// Define func getWelcomeMsg
const arrWelcomeMsg = [
  'A gift for you, you don’t know who. Must be Secret Santa!',
  'I love being your Secret Santa. It’s made my holiday a lot spicier! Merry Christmas',
  'Hey , you are amazing',
  'Welcome to the world oof knowledge'
];
const getWelcomeMsg = () => {
  const randomIndex = Math.floor(Math.random() * arrWelcomeMsg.length);   //to get random index
  return { id: randomIndex, message: arrWelcomeMsg[randomIndex] };
};

// Instantiate and start http server
const httpServer = http.createServer((req, res) => unifiedServer(req, res));
httpServer.listen(config.httpPort, () => console.log('The HTTPS server is running on port' + config.httpsPort));

// Instantiate and start https server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => unifiedServer(req, res));
httpsServer.listen(config.httpsPort, () => console.log('The HTTPS server is running on port' + config.httpsPort));

// Define handlers
const handlers = {
  ping: (data, callback) => callback(200),
  hello: (data, callback) => callback(200, getWelcomeMsg()),
  sample: (data, callback) => callback(406, { message: 'This is a sample message.' }),
  notFound: (data, callback) => callback(404, { message: 'Sorry, page is not available' })
};

// Define a request router
const router = {
  ping: handlers.ping,
  sample: handlers.sample,
  hello: handlers.hello
};




