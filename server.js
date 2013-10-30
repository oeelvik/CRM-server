
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
	// When dealing with CORS (Cross-Origin Resource Sharing)
	// requests, the client should pass-through its origin (the
	// requesting domain). We should either echo that or use *
	// if the origin was not passed.
	var origin = (request.headers.origin || "*");
	 
	 
	// Check to see if this is a security check by the browser to
	// test the availability of the API for the client. If the
	// method is OPTIONS, the browser is check to see to see what
	// HTTP methods (and properties) have been granted to the
	// client.
	if (request.method.toUpperCase() === "OPTIONS"){
		 
		 
		// Echo back the Origin (calling domain) so that the
		// client is granted access to make subsequent requests
		// to the API.
		response.writeHead(
			"204",
			"No Content",
			{
				"access-control-allow-origin": origin,
				"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
				"access-control-allow-headers": "x-requested-with",
				"access-control-max-age": 1728000, // Seconds.
				"content-length": 01728000
			}
		);
		 
		// End the response - we're not sending back any content.
		return( response.end() );
	 
	 
	}


	var r = null;



	var req = request.url.split('/');
	var resource = req[1];
	var id = req[2];

	console.log("Url:\t\t" + request.url);
	console.log("resource:\t" + resource);
	console.log("id:\t\t" + id);

	if(id != null) {
		r = resources[resource][id];
	} else {
		r = resources[resource];
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
}).listen(8081);
console.log('Server running at port 8081');
