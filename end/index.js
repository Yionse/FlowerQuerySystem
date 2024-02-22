//  引入服务器的包
const express = require("express");
// 创建服务器实例
const app = express();

// 引入环境变量
require("dotenv").config();

//  设置允许跨域访问
const cors = require("cors");
app.use(cors());

//  设置配置对象
const config = require("./config");

// 引入解析客户端发来的post请求的请求体数据的包
const qs = require("querystring");
// 开始解析客户端发来的post请求体，挂载全局中间件
app.use((req, res, next) => {
  // 定义空字符串，接收post请求体数据
  let str = "";
  //  由于post请求的数据可能一次性接收不完，每次接收就会触发on函数中的data事件
  req.on("data", (chunk) => {
    // 将这次传输来的数据，拼接在str上
    str += chunk;
  });
  // 当数据传输完毕，则会触发end事件，由于中间件和路由之间共享一个req，所以只需要将接收到的完整数据，通过方法解析，并挂载req身上，后面的路由，即可接收到
  req.on("end", () => {
    req.data = qs.parse(str);
  });
  next(); //  将此次处理结果，流转至下一个中间件或者是路由
});

//  引入解析token需要的包
const expressJWT = require("express-jwt");
//  注册解析token的全局中间件
app.use(
  expressJWT
    .expressjwt({
      secret: config.secret, //  用于解析的秘钥
      algorithms: ["HS256"], //  使用的秘钥算法
    })
    .unless({
      // 设置不需要验证token的路径，可以使用正则表达式
      path: [/public/, /user/, /back/],
    })
);

// 获取任何人都可以访问的接口，即从后端获取商品数据
const publicRouter = require("./commonRouter");
app.use("/public", publicRouter);

// 获取token接口
const tokenCheckRouter = require("./tokenRouter");
app.use("/token", tokenCheckRouter);

// 获取购物车相关的接口
const userRouter = require("./userRouter");
app.use("/user", userRouter);

// 获取后台相关的接口
// const backstageRouter = require("./backstageRouter");
// app.use("/back", backstageRouter);

// 注册解析token失败中间件
app.use((err, req, res, next) => {
  // 解析失败的情况下，做出反应
  if (err.name === "UnauthorizedError")
    return res.send({
      statu: 401,
      message: err,
      test: "token失效！",
    });
  res.send({
    statu: 401,
    message: "未知错误！",
  });
});

// 注册全局错误中间件，这样不会导致程序崩溃
app.use((err, req, res, next) => {
  res.send({
    statu: 401,
    message: err,
  });
});

// 开启服务器，运行在7797端口，端口号可以自定义，如果7797端口被占用，则需要更改，或结束占用7797端口的应用
// 如果是7797端口
app.listen(7797, () => {
  console.log("服务器启动在7797端口");
});
