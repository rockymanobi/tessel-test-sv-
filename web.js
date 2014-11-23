var express = require('express') 
var methodOverride = require('method-override');
var busboy = require('connect-busboy');
var EventEmitter = require('events').EventEmitter;
var ECT = require('ect');
var path = require('path');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ev = new EventEmitter();

app.use(express.static(__dirname + '/public'));
app.use(busboy()); 
app.use(methodOverride());


var ectRenderer = ECT({ watch: true, root: __dirname + '/lib/tpls', ext : '.html' });
app.engine('html', ectRenderer.render);
app.set('views', path.join(__dirname, 'lib', 'tpls'));
app.set('view engine', 'html');

var routes = {
  upload : require( __dirname + '/lib/routes/upload' )(ev,io),
  upload2 : require( __dirname + '/lib/routes/upload2' )(ev,io)
};


/****** routing *****/
app.get('/', function(req, res){
  res.render('index');
});

app.get('/upload_completed', function(req, res){
  res.render('upload_completed');
});

app.post('/upload', routes.upload.post );
app.post('/upload2', routes.upload2.post );


/****** io ******/
io.on('connection', function(socket){

  console.log('a user connected');

  io.emit("info requested" , {});

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('furifuri send', function(msg){
    io.emit('furifuri rcv', msg);
  });
  
  socket.on('finish watching send', function(data){
    io.emit('finish watching rcv', data);
  });

  socket.on('info send', function(data){
    io.emit('info rcv', data);
  });

  socket.on('go to end command send', function(data){
    console.log("endend!");
    io.emit('go to end command rcv', data);
  });

  socket.on('kickServo command',function(){
    io.emit('kickServo');
  });

});


var port = Number(process.env.PORT || 3000);
http.listen(port, function(){

  require('dns').lookup( require('os').hostname(), function( err, add, fam){
    console.log( 'listening on ' + add + ':' + port );
  });
  
});
