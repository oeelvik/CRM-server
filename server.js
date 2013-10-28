
var sys = require('sys');
var http = require('http');

var person = [
	{
		id: 1,
		firstname: 'Ola',
		lastname: 'Norman'
	},
	{
		id: 2,
		firstname: 'Kari',
		lastname: 'Norman'
	},
	{
		id: 3,
		firstname: 'Truls',
		lastname: 'Hansen'
	}
];

http.createServer(function(req, res) {
	var r = null;
	switch(req.url) {
		case '/person':
			r = person;
			break;
		case '/person/1':
			r = person[0];
			break;
	}

	if (r != null) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify(r));
		res.end();
	} else {
		res.writeHead(404);
		res.end();
	}
}).listen(8081);
console.log('Server running at port 8081');