
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

app.use('/', index);
app.use('/users', users);


app.get('/startchat',(req,res)=>{
	//console.log(__dirname);
	res.sendFile(__dirname + '/VolatileChat.html');
});
var online_users =[];
io.on('connection', function(socket){
  
  socket.on('addUser', (data)=>{
	online_users.push(data.name);
	io.emit('online users',{users:online_users});
	io.emit('addUser',data);
  });
  socket.on('chat message',(data)=>{
	  //console.log(data);
	  /*socket.broadcast.emit('hi'); //If you want to send a message to everyone except for a certain socket, we have the broadcast flag:*/
		io.emit('chat message', data);
  });
  socket.on('disconnect',()=>{
	 //io.emit('disconnect',data);	 
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000);
module.exports = app;
