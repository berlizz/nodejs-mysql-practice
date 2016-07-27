module.exports = function() {
    var router = require('express').Router();
    
    var conn = require('../config/mysql.js')();
    var sql;

    router.get('/add', function(req, res) {
        sql = 'select * from contents order by id desc';
        conn.query(sql, function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500);
            }
            res.render('add', { contents: rows });
        });
    });

    router.post('/add', function(req, res) {
        var insert = {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author
        }
        sql = 'insert into contents set ?';
        conn.query(sql, insert, function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500).send("internal server error");
            }
            console.log(rows);
            res.redirect('/main/' + rows.insertId);
        });
    });

    router.get(['/', '/:id'], function(req, res) {
        sql = 'select * from contents order by id desc';
        conn.query(sql, function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500).send("internal server error");;
            }
            if(req.params.id) {
                var id = req.params.id;    
                sql = 'select * from contents where id=?'
                conn.query(sql, [id], function(err, selectedId, fields) {
                    if(err) {
                        console.log(err);
                        res.status(500).send("internal server error");
                    }
                    res.render('main', { contents: rows, content: selectedId[0] });            
                });
            } else {
                res.render('main', { contents: rows });
            }
        });
    });

    router.get('/:id/edit', function(req, res) {
        var id = req.params.id;
        sql = 'select * from contents order by id desc';
        conn.query(sql, function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500).send("internal server error");
            }
            sql = 'select * from contents where id=?'
            conn.query(sql, [id], function(err, selectedId, fields) {
                if(err) {
                    console.log(err);
                    res.status(500).send("internal server error");
                }
                res.render('edit', { contents: rows, content: selectedId[0] });
            });
        });
    });

    router.post('/:id/edit', function(req, res) {
        var id = req.params.id;
        var update = {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description
        }
        sql = 'update contents set ? where id=?';
        conn.query(sql, [update, id], function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500).send("internal server error");
            }
            res.redirect('/main/' + id);
        });
    });

    router.get('/:id/delete', function(req, res) {
        var id = req.params.id;
        sql = 'select * from contents order by id desc';
        conn.query(sql, function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500);
            }
            sql = 'select * from contents where id=?';
            conn.query(sql, [id], function(err, selectedId, fields) {
                if(err) {
                    console.log(err);
                    res.status(500);
                }
                res.render('delete', { contents: rows, content: selectedId[0] });
            });
        });
    });

    router.post('/:id/delete', function(req, res) {
        var id = req.params.id;
        sql = 'delete from contents where id=?'
        conn.query(sql, [id], function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500).send("internal server error");
            }
            res.redirect('/main');
        });
    });

    return router;
}