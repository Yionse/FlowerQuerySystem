const express = require('express');
const router = express.Router();

const db = require('./db');

// 定义查询当前购物车中是否存在该商品，如果存在则返回不许添加，否则添加
router.get('/shopcar', (req, res) => {
    const u_id = req.query.u_id;
    const f_title = req.query.f_title;
    const f_id = req.query.f_id;
    const f_src = req.query.f_src;
    const price = req.query.price;
    let sqlStr = 'select * from shoppingcart where u_id = ? and f_id = ?';
    db.query(sqlStr, [u_id, f_id], (err, result) => {
        if (err) return res.send({ statu: 401, meesage: err });
        if (result.length === 0) {
            // 如果当前数据库中，没有该条记录，则可以加入
            sqlStr = 'insert into shoppingcart(u_id, f_id, f_title, f_src, price) values (? , ?, ?, ?, ?)';
            db.query(sqlStr, [u_id, f_id, f_title, f_src, price], (err, result) => {
                if (err) return res.send({ statu: 401, message: err });
                res.send({statu:200, message: '加入成功！'});
            });
        } else {
            res.send({statu: 301, message: '购物车中已存在！'});
        }
    });
});

// 查询用户信息
router.get('/infor', (req, res) => {
    const u_id = req.query.id;
    let sqlStr = 'select u_username, u_pass, u_tel, u_address from user where u_id = ?';
    db.query(sqlStr, u_id, (err, result) => {
        if (err) return res.send({ statu: 401, message: err });
        res.send({statu:200, message: result[0]});
    });
});

// 修改信息
router.post('/modify', (req, res) => {
    setTimeout(() => {
        let sqlStr = 'update user set u_username = ?,u_pass = ?, u_tel = ?, u_address=? where u_id = ?';
        let uname = req.data.u_name;
        let id = req.data.id;
        let pass = req.data.u_pass;
        let tel = req.data.u_tel;
        let address = req.data.u_address;
        db.query(sqlStr, [uname, pass, tel, address, id], (err, result) => {
            if (err) return res.send({statu: 401, err});
            res.send({ statu: 200, message: '修改成功！'});
        });
    });
});

// 查询购物车
router.get('/shop', (req, res) => {
    const u_id = req.query.u_id;
    const sqlStr = 'select * from shoppingcart where u_id = ?';
    db.query(sqlStr, [u_id], (err, result) => {
        if (err) return res.send({ statu: 401, message: err });
        res.send(result);
    });
});

// 删除购物车中的数据
router.get('/delete', (req, res) => {
    const c_id = req.query.c_id;
    console.log(c_id);
    let sqlStr = 'delete from shoppingcart where c_id = ?';
    db.query(sqlStr, c_id, (err, result) => {
        if (err) return res.send({ statu: 401, err });
        if (result.affectedRows == 1) {
            res.send({ statu: 200, message: '删除成功！' });
        }
    });
});
module.exports = router;