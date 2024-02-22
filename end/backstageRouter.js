const express = require('express');
const router = express.Router();

const db = require('./db');

// 获取用户数据数据
router.get('/get', (req, res) => {
    const sqlStr = 'select * from user where u_id != 1'
    db.query(sqlStr, (err, result) => {
        if (err) return res.send({statu: 401, err});
        res.send(result);
    });
});

// 删除用户数据数据
router.get('/delete', (req, res) => {
    const u_id = req.query.u_id;
    console.log(u_id);
    let sqlStr = 'delete from user where u_id = ?';
    db.query(sqlStr, u_id, (err, result) => {
        if (err) return res.send({ statu: 401, err });
        if (result.affectedRows == 1) {
            res.send({ statu: 200, message: '删除成功！' });
        }
    });
});

module.exports = router;