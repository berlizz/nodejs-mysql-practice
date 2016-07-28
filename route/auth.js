module.exports = function(passport) {
    var conn = require('../config/mysql.js')();
    var router = require('express').Router();

    var pbkdf2Password = require('pbkdf2-password');
    var hasher = pbkdf2Password();

    router.get('/login', function(req, res) {
        res.render('login');
    });

    router.post('/login', passport.authenticate(
        'local', 
        {
            successRedirect: '/main',
            failureRedirect: '/auth/login',
            failureFlash: false
        }
    ));

    router.get('/signup', function(req, res) {
        res.render('signup');
    });

    router.post('/signup', function(req, res) {
        hasher({ password: req.body.password }, function(err, pass, salt, hash){
            var user = {
                userId: req.body.userId,
                password: hash,
                salt: salt,
                displayName: req.body.displayName,
                authId: 'local:'+req.body.userId
            }
            sql = 'insert into users set ?';
            conn.query(sql, user, function(err, results) {
                if(err) {
                    console.log(err);
                    res.status(500).send("internal server error");
                } else {
                    req.login(user, function(err) {
                        req.session.save(function() {
                            res.redirect('/main');
                        });
                    });
                }
            });
        });
    });

    router.get('/logout', function(req, res) {
        req.logout();
        req.session.save(function() {
            res.redirect('/main');
        });
    });

    return router;
}