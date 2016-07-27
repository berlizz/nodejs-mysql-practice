var express = require('express');
var app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'nodejs_practice'
});
conn.connect();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');
app.set('views', './views');
app.locals.pretty = true;

var sql;
app.get('/main', function(req, res) {
    sql = 'select * from contents order by id desc';
    conn.query(sql, function(err, rows, fields) {
        if(err) {
            console.log(err);
            res.status(500).send("internal server error");;
        }
        res.render('main', { contents: rows });
    });
});

app.get('/add', function(req, res) {
    sql = 'select * from contents order by id desc';
    conn.query(sql, function(err, rows, fields) {
        if(err) {
            console.log(err);
            res.status(500);
        }
        res.render('add', { contents: rows });
    });
});

app.post('/add', function(req, res) {
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

app.get('/main/:id', function(req, res) {
    var id = req.params.id;
    sql = 'select * from contents order by id desc';
    conn.query(sql, function(err, rows, fields) {
        if(err) {
            console.log(err);
            res.status(500).send("internal server error");;
        }
        sql = 'select * from contents where id=?'
        conn.query(sql, [id], function(err, selectedId, fields) {
            if(err) {
                console.log(err);
                res.status(500).send("internal server error");
            }
            res.render('main', { contents: rows, content: selectedId[0] });            
        });
    });
});

app.get('/main/:id/edit', function(req, res) {
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

app.post('/main/:id/edit', function(req, res) {
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

app.get('/main/:id/delete', function(req, res) {
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

app.post('/main/:id/delete', function(req, res) {
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

app.listen('3000', function() {
    console.log("connected 3000 port");
});