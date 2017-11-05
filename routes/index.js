var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.send('<h1>Welcome Realtime Server</h1>');
});

io.listen(3001, function () {
    console.log('Server listening at http://localhost:3001/');
});

var roomList = new Array();
io.on('connection', function (socket) {
    console.log('a user connected');

    //监听用户发布聊天内容
    socket.on('enterRoom', function (obj) {
        var roomId = obj.roomId;
        console.log(obj);
        socket.account = obj.account;
        if (roomList[roomId]) {//如果已经存在该房间
            for (var i=0;i<roomList[roomId].length;i++) {
                roomList[roomId][i].emit("enterRoom", obj.account);
            }
            roomList[roomId].push(socket)
        } else {
            roomList[roomId] = new Array();
            roomList[roomId].push(socket)
        }
    });
    
    socket.on('exitRoom',function (obj) {
        var roomId = obj.roomId;
        var remove = 0;
        if (roomList[roomId]) {//如果已经存在该房间
            for (var i=0;i<roomList[roomId].length;i++) {
                if(roomList[roomId].account == obj.account){
                    remove = i;
                }else {
                    roomList[roomId][i].emit("exitRoom", obj.position);
                }
            }
        }
        roomList.splice(remove,1);
    })

});

module.exports = app;
