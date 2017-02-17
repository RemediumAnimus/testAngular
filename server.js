var server = require('http').createServer(serverHandler).listen(3100),
	http = require('http'),
	fs = require('fs'),
	url = require('url'),
	path = require('path'),
	querystring = require('querystring'),
    io = require('socket.io')(server);

function serverHandler(req, res){
	var pathExt = path.extname(path.basename(req.url));
	var urlSearch = url.parse(req.url).search;

	if (url.parse(pathExt).pathname == ".css") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'text/css'
			});
			res.end(data);
		});
	} else if (url.parse(pathExt).pathname == ".js"){
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'text/javascript'
			});
			res.end(data);
		});
	} else if (url.parse(pathExt).pathname == ".png") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'image'
			});
			res.end(data);
		});
	} else if (req.url == "/favicon.ico") {
		res.writeHead(200, {'Content-Type': 'image/x-icon'} );
	} else if (url.parse(pathExt).pathname == ".html") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'text/html'
			});
			res.end(data);
		});
	} else if (url.parse(pathExt).pathname == ".json") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'application/json'
			});
			res.end(data);
		});
	} else if (url.parse(pathExt).pathname == ".eot") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'application/x-font-opentype'
			});
			res.end(data);
		});
	} else if (url.parse(pathExt).pathname == ".woff2") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'application/x-font-opentype'
			});
			res.end(data);
		});
	} else if (url.parse(pathExt).pathname == ".woff") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'application/x-font-opentype'
			});
			res.end(data);
		});
	} else if (url.parse(pathExt).pathname == ".ttf") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'application/x-font-opentype'
			});
			res.end(data);
		});
	} else if (url.parse(pathExt).pathname == ".svg") {
		fs.readFile('.' + req.url, function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'image/svg+xml'
			});
			res.end(data);
		});
	} else {
		fs.readFile('index.html','utf-8',function(err, data) {
			res.writeHead(200,{
				'Content-Type': 'text/html; charset = utf-8'
			});
			res.end(data);
		});
	}

	if (req.method == "POST") {
		req.on('data', function(data) {
			fs.writeFile('events.json',data, function(err) {
				if (err) throw err;
				console.log('file saved')
			})
		})
	}
};

var sockets = [];

io.on('connection', function(socket) {
	socket.emit('сurrentEnter', {
		id: socket.id
	});

	sockets.push({
		id: socket.id,
		editingEvent: false,
		rowNumber: 0,
		cellNumber: 0,
		eventNumber: 0,
		className: ''
	});
	console.log('sockets list');
	console.log(sockets);

	socket.on('angularReady', function(){
		for (var i=0; i<sockets.length; i++) {
			if (sockets[i].editingEvent) {
				console.log(sockets[i]);
				socket.emit('someoneEventEditingBegin', sockets[i]);
			}
		}
	});
	
	socket.on('disconnect', function() {
		for (var i=0; i<sockets.length; i++) {
			if (sockets[i].id == socket.id) {
				sockets.splice(i,1);
			}
		}
		console.log('disconnect socket ' + socket.id);
	});

	socket.on('eventEditingBegin', function(data) {
		socket.broadcast.emit('someoneEventEditingBegin', data);

		for (var i=0; i<sockets.length; i++) {
			if (sockets[i].id == socket.id) {
				sockets[i].editingEvent = true;
				sockets[i].rowNumber = data.rowNumber;
				sockets[i].cellNumber = data.cellNumber;
				sockets[i].eventNumber = data.eventNumber;
				sockets[i].className = data.className;
			};
		};
	});

	socket.on('eventEditingEnd', function(data) {
		socket.broadcast.emit('someoneEventEditingEnd', data);

		for (var i=0; i<sockets.length; i++) {
			if (sockets[i].id == socket.id) {
				sockets[i].editingEvent = false;
			};
		};
	});

	socket.on('dataUpdated', function(data) {
		socket.broadcast.emit('someoneUpdateData', data);
	});
});




