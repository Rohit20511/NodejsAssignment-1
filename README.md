
To start, run this in terminal: 

https://github.com/Rohit20511/NodejsAssignment-1.git


Go to `helloworldAPI` directory.

Run this in terminal to start server in staging (default) environment:
```
node index.js
```
open this in Browser
* HTTP: `http://www.localhost:3000` 
* HTTPS: `https://www.localhost:3001` 
* Available routes: `/hello`, `/ping`, and `/sample`

To generate new RSA private key `key.pem` and SSL Certificate `cert.pem`, run this in terminal within the `helloworldAPI/https` directory:
```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

