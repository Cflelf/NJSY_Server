var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>');
});

io.listen(3000, function() {
    console.log('Server listening at http://localhost:80/');
});

io.on('connection', function(socket){
    console.log('a user connected');

    //监听用户发布聊天内容
    socket.on('enterRoom', function(obj){
        console.log(obj);
    });

});

module.exports = app;
