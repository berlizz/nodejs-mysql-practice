module.exports = function(app) {
    var conn = require('./mysql.js')();
    var sql;

    var pbkdf2Password = require('pbkdf2-password');
    var hasher = pbkdf2Password();

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.authId);
    });

    passport.deserializeUser(function(id, done) {
        sql = 'select * from users where authId=?';
        conn.query(sql, [id], function(err, results) {
            if(err) {
                console.log(err);
                done('there is no user');
            } else {
                done(null, results[0]);
            }
        });
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            var uname = username;
            var pwd = password;
            sql = 'select * from users where authId=?';
            conn.query(sql, ['local:'+uname], function(err, results) {
                if(err) {
                    return done('there is no user');
                }
                var user = results[0];
                if(user.userId === uname) {
                    return hasher({ password: pwd, salt: user.salt }, function(err, pass, salt, hash) {
                        if(hash === user.password) {
                            return done(null, user);
                        } else {
                            done(null, false);
                        }
                    });
                } else {
                    done(null, false);
                }
            });
        }
    ));

    return passport;
}