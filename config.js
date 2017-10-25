/**
 * Created by panxiaorui on 2017/10/25.
 */
var mysql = require('mysql');
var config = mysql.createConnection({
    host: '101.132.162.201',
    user: 'root',
    password: 'pxr970708',
    database:'NJSY'
});
module.exports = config;