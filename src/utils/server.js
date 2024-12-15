const mainRouter = require("../routes/index");
const express = require("express");

function createServer() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));    
    app.use(mainRouter);
    return app;
}
module.exports = createServer;