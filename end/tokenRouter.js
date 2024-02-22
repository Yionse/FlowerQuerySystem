// 用户创建，用户注册所使用的是这个路由
const express = require('express');
const router = express.Router();

// 验证token的接口，如果token没过期
router.post('/token', (req, res) => {
    setTimeout(() => {
        res.send({
            // 解析成功的token，里面的数据存放在req.auth中
            statu: 200,
            data: req.auth
        });
    });
});

module.exports = router;