// 封装mysql模块
const mysql = require('mysql');
const db = mysql.createPool({
    host: '127.0.0.1',          //  本地主机
    user: 'root',               //  用户
    password: '1234',           //  密码
    database: 'flower'         //  数据库
});

module.exports = db;