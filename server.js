
var sys = require('sys');
var http = require('http');

var resources = { 
	person: [
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
	],
	group: [
		{
			id: 1,
			name: 'Employees'
		},
		{
			id: 2,
			name: 'Customers'
		},
		{
			id: 3,
			name: 'Contacts'
		}
	],
	event: [
		{
			id: 1,
			title: 'Meeting'
		},
		{
			id: 2,
			title: 'Release'
		},
		{
			id: 3,
			title: 'Opening'
		}
	]
}

http.createServer(function(request, response) {


	console.log();
	console.log("------------------" + request.method.toUpperCase() + ": " + request.url + "-------------------");
	
	var origin = (request.headers.origin || "*");
	var req = request.url.split('/');
	var resource = req[1];
	var id = req[2];

	console.log("resource:\t" + resource);
	console.log("id:\t\t" + id);

	switch(request.method.toUpperCase()) {
		case "OPTIONS":
			// Echo back the Origin (calling domain) so that the
			// client is granted access to make subsequent requests
			// to the API.
			response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin": origin,
					"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
					"access-control-allow-headers": "x-requested-with, content-type",
					"access-control-max-age": 1728000, // Seconds.
					"content-length": 01728000
				}
			);
			 
			// End the response - we're not sending back any content.
			return( response.end() );
			break;

		case "POST":
		case "PUT":
			if(resource === null) {
				response.writeHead(404);
				return( response.end() );
			}
			request.on('data', function(chunk) {

				var record = JSON.parse(chunk);
				console.log("Received record:");
				console.log(record);


				var i = null;
				if(id == null) {
					if(resources[resource] == null) {
						resources[resource] = [];
						id = 1;
					} else {
						id = resources[resource][resources[resource].length - 1].id + 1;
					}

					console.log("Assigned id: " + id);
					record.id = id;
				} else {
					resources[resource].every(function(item, index){
						if(item.id == id) {
							i = index;
							return false;
						}
						return true;
					});
				}

				if ( i == null) {
					resources[resource][resources[resource].length] = record;
				}  else {
					resources[resource][i] = record;
				}

				response.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': origin
				});
				response.write(JSON.stringify(record));
				response.end();
			});
			break;
		case "DELETE":
			if(resource == null || id == null || resources[resource] == null) {
				response.writeHead(404);
				return( response.end() );
			}

			var i = null;
			resources[resource].every(function(item, index){
				if(item.id == id) {
					i = index;
					return false;
				}
				return true;
			});

			if ( i == null) {
				response.writeHead(404);
				return( response.end() );
			}  else {
				resources[resource].splice(i, 1);
			}

			response.writeHead(200, 
				"No Content",
				{
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': origin
				});
			return ( response.end() );
			break;
		case "GET":
		default:
			var r = resources;
			if (resource != null && resource.length > 0) {
				r = r[resource];
				if (r == null || r.length < 1 ) {
					r = [];
				}
				if (id != null && resource.length > 0) {
					r.every(function(item){
						if(item.id == id) {
							r = item;
							return false;
						}
						return true;
					});
					if (r == null || r.length < 1 ) {
						r = {};
					}
				}
			}

			if (r != null) {
				response.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': origin
				});
				response.write(JSON.stringify(r));
				response.end();
			} else {
				response.writeHead(404);
				response.end();
			}

	}
}).listen(8081);
console.log('Server running at port 8081');
