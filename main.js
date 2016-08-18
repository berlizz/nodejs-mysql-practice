var app = require('./config/express.js')();

var passport = require('./config/passport')(app);

var contents = require('./route/contents.js')();
app.use('/main', contents);

var auth = require('./route/auth.js')(passport);
app.use('/auth', auth);

app.listen('3000', function() {
    console.log("connected 3000 port");
});
