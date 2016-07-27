module.exports = function() {
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1111',
        database: 'nodejs_practice'
    });
    conn.connect();

    return conn;    
}