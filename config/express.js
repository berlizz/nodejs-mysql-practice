module.exports = function() {
    var express = require('express');
    var app = express();
    
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));

    app.set('view engine', 'jade');
    app.set('views', './views');
    app.locals.pretty = true;

    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var sessionStore = new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '1111',
        database: 'nodejs_practice'
    });
    app.use(session({
        secret: '-_-!#&%)#&#^rororo',
        resave: false,
        saveUninitialized: true,
        store: sessionStore
    }));

    return app;
}