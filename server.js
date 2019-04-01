const express = require("express");
const next = require("next");
const path = require("path");
require("isomorphic-fetch");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare()
    .then(() => {
        const app = express();
        
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.use(express.static(path.join(__dirname, 'public')));
        
        app.get("/api/whois/:domain", function(req, res, next) {
            let domainName = req.params.domain;
            let url=`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${process.env.WHOISXMLAPI_KEY}&outputFormat=JSON&domainName=${domainName}`

            fetch(url).then((response) => {
                response.json().then((whoisData) => {
                    res.send(whoisData);
                })
            });
        });

        app.get("*", async (req, res, nextFunction) => handle(req, res, nextFunction));

        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        const serverPort = process.env.PORT || 3000;
        app.listen(serverPort, (err) => {
            if (err) { throw err; }
            console.log("> Ready on http://localhost");
        });
    })
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1);
    });
