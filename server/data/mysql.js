Mysql = new Object();
Mysql.net = require('mysql');
Mysql.thread = require('sleep');
Mysql.set = Mysql.net.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'wod',
});
Mysql.set.connect();

Mysql.query = function (query) {
	this.set.query(query, function(err, results) {
		if (err) throw err;
		console.log(results[0]); 
		return results; 
	});
}
Mysql.close = function() {
	Mysql.set.end();
}