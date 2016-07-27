var app = require('./config/express.js')();

var contents = require('./route/contents.js')();
app.use('/main', contents);

app.listen('3000', function() {
    console.log("connected 3000 port");
});