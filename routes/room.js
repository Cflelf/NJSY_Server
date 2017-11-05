/**
 * Created by panxiaorui on 2017/11/3.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var config = require('../config.js');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/* GET users listing. */
router.post('/getRoomList', function (req, res, next) {
    //console.log(req.body.mode);
    config.query(
        'select * from roomList r where r.mode = ?', req.body.mode, function (error, results, fields) {
            var returnDic = {};
            if (error) throw error;
            returnDic.roomList = results;
            res.contentType('json');
            res.send(JSON.stringify(returnDic));//给客户端返回一个json格式的数据
        });

});

router.post('/enterRoom', function (req, res, next) {
    var returnDic = {};
    var players = {};
    var addPlace = -1;
    var tasks = [function (callback) {
        config.query('select * from roomList where roomId = ?', req.body.roomId, function (err, result) {
            players = result[0].playerList.split(";");
            var playerNum = 0;
            for(var i=0;i<6;i++){
                if(players[i].split(":")[1]){
                    playerNum++;
                }else{
                    if(addPlace == -1){
                        addPlace = i;
                    }
                }
            }
            console.log(playerNum);
            if (result[0].roomLimit == playerNum) {
                returnDic.ResultMessage = 2;
                res.contentType('json');
                res.send(JSON.stringify(returnDic));
                return;
            }else{
                players[addPlace]+=req.body.account;
            }
            returnDic.ResultMessage = 3;
            callback(err);
        });
    }, function (callback) {
        config.query("update roomList set playerList = ? where roomId = ?", [list2String(players), req.body.roomId], function (err, result) {
            callback(err);
        });
    }, function (callback) {
        config.query('select * from roomList where roomId = ?', req.body.roomId, function (err, result) {
            returnDic.roomInfo = result[0];
            callback(err);
        });
    }];

    async.series(tasks, function (err, results) {
        if (err) {
            console.log(err);
            config.rollback(); // 发生错误事务回
        }
        res.contentType('json');
        res.send(JSON.stringify(returnDic));
    });

});
router.post('/exitRoom',function (req,res,next) {//req:{"roomId","position"}
    var player = {};
    var returnDic = {};
    console.log(req.body);
    var tasks = [function (callback) {
        config.query('select * from roomList where roomId = ?', req.body.roomId, function (err, result) {
            players = result[0].playerList.split(";");
            players[req.body.position-1] = (req.body.position)+":";
            callback(err);
        });
    }, function (callback) {
        config.query("update roomList set playerList = ? where roomId = ?", [list2String(players), req.body.roomId], function (err, result) {
            returnDic.ResultMessage = 4;
            callback(err);
        });
    }, function (callback) {
        config.query('select * from roomList where roomId = ?', req.body.roomId, function (err, result) {
            returnDic.roomInfo = result[0];
            callback(err);
        });
    }];

    async.series(tasks, function (err, results) {
        if (err) {
            console.log(err);
            returnDic.ResultMessage = 5;
            res.contentType('json');
            res.send(JSON.stringify(returnDic));
            config.rollback(); // 发生错误事务回
        }
        res.contentType('json');
        res.send(JSON.stringify(returnDic));
    });
});

function list2String(list) {
    var string = "";
    for(var i=0;i<6;i++){
        string+=list[i]+";";
    }
    return string;
}


module.exports = router;