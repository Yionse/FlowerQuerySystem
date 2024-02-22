// 封装mysql模块
const mysql = require("mysql");
const db = mysql.createPool({
  host: process.env.HOST, //  本地主机
  port: process.env.PORT,
  user: process.env.USER, //  用户
  password: process.env.PASSWORD, //  密码
  database: process.env.DATABASE, //  数据库
});

module.exports = db;
