// 这个是无需验证即可访问的所有路由

// 引入相关的包
const express = require("express");
const router = express.Router();

// 获取数据库对象，访问数据库
const db = require("./db");

//  引入用于生成token的包
const json_web_token = require("jsonwebtoken");

// 引入配置对象
const config = require("./config");

// 请求登录的接口
router.post("/login", (req, res) => {
  setTimeout(() => {
    const user = req.data.user;
    const pass = req.data.pass;
    // 定义SQL语句查询数据表
    const sqlStr = "select * from user where u_username = ? and u_pass = ?";
    db.query(sqlStr, [user, pass], (err, result) => {
      // 如果该用户名和密码对应了数据表下的一条记录，则说明，账户存在，且验证成功
      if (err)
        return res.send({
          statu: 401,
          message: err,
        });
      if (result.length === 1) {
        // 登录成功，需要生成token，返回给客户端
        const token =
          "Bearer " +
          json_web_token.sign(
            {
              // 将其用户名存下
              user,
              id: result[0].u_id,
            },
            //  配置对象中的秘钥，用于加密和解密
            config.secret,
            {
              expiresIn: config.expiresIn, //  token的有效期
            }
          );
        res.send({
          statu: 200,
          message: "登录成功！",
          token,
          user,
        });
      } else {
        // 否则登录失败
        res.send({
          statu: 401,
          message: "登录失败！",
        });
      }
    });
  });
});

// 注册接口
router.post("/register", (req, res) => {
  setTimeout(() => {
    const user = req.data.user;
    let sqlStr = "select * from user where u_username = ?";
    // 先查询该用户名是否已被使用
    db.query(sqlStr, user, (err, result) => {
      // 如果返回的result有内容，则说明查询到了记录，则已有该用户，所以不能注册
      if (result.length !== 0) {
        res.send({
          statu: 401,
          message: "注册失败！",
        });
      } else {
        // 反之，可以注册，再次调用query方法，往user表中插入一条数据
        sqlStr =
          "insert into user(u_username, u_pass, u_tel, u_address) values (?,?,?,?)";
        const pass = req.data.pass;
        const tel = req.data.tel;
        const address = req.data.local;
        db.query(sqlStr, [user, pass, tel, address], (err, result) => {
          if (err)
            return res.send({
              statu: 401,
              message: err,
            });
          if (result.affectedRows === 1) {
            res.send({
              statu: 200,
              message: "注册成功！",
            });
          } else {
            res.send({
              statu: 401,
              message: err,
            });
          }
        });
      }
    });
  });
});

// 定义，后面公共接口的数据库查询语句
function query(sqlStr, res) {
  db.query(sqlStr, (err, result) => {
    if (err) return res.send({ statu: 401, message: err });
    res.send({ statu: 200, data: result });
  });
}

//  公共接口1，按照鲜花的类型分类
router.get("/type", (req, res) => {
  const key = req.query.key;
  let limit = "";
  if (req.query.flag === "1") limit = "limit 8"; //限制条数
  const sqlStr = `select f_id,f_title, f_language, f_material, f_packing, f_tag, f_src,p_price, p_activity_price ,s_count from product,price,stock where ((product.f_id = price.p_id ) and (product.p_id = stock.s_id)) and f_type = "${key}" ${limit}`;
  query(sqlStr, res);
});

//  公共接口2，按照鲜花的用途分类
router.get("/purpose", (req, res) => {
  const key = req.query.key;
  if (req.query.flag === "1") limit = "limit 8"; //限制条数
  const sqlStr = `select f_id,f_title, f_language, f_material, f_packing, f_tag, f_src,p_price, p_activity_price ,s_count from product,price,stock where ((product.f_id = price.p_id ) and (product.p_id = stock.s_id)) and f_purpose like '%${key}%' ${limit}`;
  // 执行查询语句
  query(sqlStr, res);
});

//  公共接口3，按照包装分类
router.get("/packing", (req, res) => {
  const key = req.query.key;
  const sqlStr = `select f_id,f_title, f_language, f_material, f_packing, f_tag, f_src,p_price, p_activity_price ,s_count from product,price,stock where ((product.f_id = price.p_id ) and (product.p_id = stock.s_id)) and f_packing = '${key}'`;
  // 执行查询语句
  query(sqlStr, res);
});

// 公共接口4，所有商品
router.get("/all", (req, res) => {
  const sqlStr = `select f_id,f_title, f_language, f_material, f_packing, f_tag, f_src,p_price, p_activity_price ,s_count from product,price,stock where ((product.f_id = price.p_id ) and (product.p_id = stock.s_id))`;
  // 执行查询语句
  query(sqlStr, res);
});

// 公共接口5，搜索
router.get("/search", (req, res) => {
  // 获取关键字
  const key = req.query.key;
  // 定义sql语句
  const sqlStr = `select f_id,f_title, f_language, f_material, f_packing, f_tag, f_src,p_price, p_activity_price ,s_count from product,price,stock where ((product.f_id = price.p_id ) and (product.p_id = stock.s_id)) and (f_type like '%${key}%' or f_purpose like '%${key}%' or  f_language like '%${key}%' or  f_material like '%${key}%' or  f_packing like '%${key}%' or f_tag like '%${key}%')`;
  // 执行查询语句
  query(sqlStr, res);
});

// 将router对象暴露，出去，以便使用
module.exports = router;
