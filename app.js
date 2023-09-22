const dotenv = require("dotenv");
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const swagger = require('./swagger'); 
// const swaggerValidator = require('swagger-express-validator');
dotenv.config();

app.use('/api', swagger.serveSwaggerUI, swagger.setupSwaggerUI());// Serve Swagger UI
// app.use(swaggerValidator());

    // Save sessions in db
    const store = new MongoDBStore({
        uri: process.env.MONGODB_URI,
        collection: "sessions",
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Use session middleware
    app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    }));

    app.use((req, res, next) => {
        res.locals.isAuthenticated = req.session.isLoggedIn;
        next();
      });

 // Require JSON parsing middleware for route handlers
    app.use(express.json());
    app.set("view engine", "ejs");// ejs view engine 
    app.set("views", "views");
    app.use(express.static("public"));// Static files

    // Routes
    const taskRoute = require('./routes/task');
    const authRoute = require('./routes/auth');
    app.use(taskRoute);
    app.use('/auth', authRoute);

    //Connection port
    let port = process.env.PORT;
    if (port == null || port == "") {
    port = 3000;
    }
    //Connect to database and listen on a specified port
    mongoose
    .connect(process.env.MONGODB_URI)
    .then((result) => {
        app.listen(port, function () {
        console.log("server started successfully");
        });
    })
    .catch((err) => {
        console.log(err);
        throw err;
    });