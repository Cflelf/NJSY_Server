var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
    var returnDic = {resultStr: 'get request success'};
    res.contentType('json');//返回的数据类型
    res.send(JSON.stringify(returnDic));//给客户端返回一个json格式的数据
});

module.exports = router;
