module.exports = function() {
    var express = require('express');
    var app = express();
    
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));

    app.set('view engine', 'jade');
    app.set('views', './views');
    app.locals.pretty = true;

    return app;
}