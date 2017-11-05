var express = require('express');
var router = express.Router();

var config = require('../config.js');
config.connect();

/* GET users listing. */
router.post('/login', function(req, res, next) {
    config.query(
        'select password from user u where u.account = ?',req.body.account,function (error,results,fields) {
        var returnDic = {};
        if(error) throw error;
       if(results[0].password == req.body.password) returnDic.ResultMessage = 0;
       else returnDic.ResultMessage = 1;
       console.log(returnDic);
       res.contentType('json');
       res.send(JSON.stringify(returnDic));//给客户端返回一个json格式的数据
    });

});

module.exports = router;
