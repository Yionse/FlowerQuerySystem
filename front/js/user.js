$('.left a').click(function () {
    $('.current').removeClass('current');
    $(this).addClass('current');
    if ($(this).attr('data-index') == 1) {
        $('.right-current').removeClass('right-current');
        $('.infor').addClass('right-current');
    } else {
        $('.right-current').removeClass('right-current');
        $('.cart').addClass('right-current');
        
    }
});
$('.infor input ').focus(function () {
    $(this).css({
        background: 'rgba(0,0,0,.1)',
        boxShadow : '0px 0px 10px 3px rgba(112, 243, 255, .3)'
    });
})
$('.infor input ').blur(function () {
    $(this).css({
        background: 'white',
        boxShadow : ''
    });
})

$('.pass').focus(function () {
    $(this).attr('type', 'text');
});
$('.pass').blur(function () {
    $(this).attr('type', 'password');
});

const id = decodeURIComponent(getParamsByUrl(location.href, "id"));
let req = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'http://120.26.171.166:7009/user/infor?id='+id,
        success: (data) => {
            resolve(data);
        }
    });
});

let oldUser = '';
let oldPass = '';
let oldTel = '';
let oldAddress = '';

req.then(value => {
    $('.uname').val(value.message.u_username);
    $('.pass').val(value.message.u_pass);
    $('.tel').val(value.message.u_tel);
    $('.address').val(value.message.u_address);
    oldUser = value.message.u_username;
    oldPass = value.message.u_pass;
    oldTel = value.message.u_tel;
    oldAddress = value.message.u_address;
});

$('.bay').click(() => {
    // 当退出登录的时候，则破坏token
    localStorage.setItem('final_login_token', '');
});

// 点击修改时，将input的内容设置为可用
$('.modify').click(() => {
    $('input').attr('disabled', false);
});

$('.sub').click(() => {
    if (oldUser == $('.uname').val() && oldPass == $('.pass').val() && oldTel == $('.tel').val() && oldAddress == $('.address').val()) {
        //  如果用户没修改信息
        alert('信息并未更改');
        return;
    }
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;     //  使用正则表达式
    const flag = reg.exec($('.tel').val());     //  手机号必须合法，才可以注册
    if (flag === null) {
        alert('手机号不合法！');
        $('.tel').val(oldTel);
        return;
    }
    // 则可以修改了，提交请求，修改数据库
    $.ajax({
        type: 'POST',
        url: 'http://120.26.171.166:7009/user/modify',
        data: {
            id,
            u_name: $('.uname').val(),
            u_pass: $('.pass').val(),
            u_tel: $('.tel').val(),
            u_address: $('.address').val()
        },
        success: (data) => {
            if (data.statu === 200) {
                alert('修改成功！');
                $('input').attr('disabled', true);
            }
        }
    });
}); 

// 开始渲染购物车
function s() {
    let s = new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: 'http://120.26.171.166:7009/user/shop?u_id=' + id,
            success: (data) => {
                resolve(data);
            }
        });
    });
    s.then(value => {
        render(value, $('.cart table'));
        if (value.length === 0) {
            $('.cart table').html('<h1>暂无商品，快去选购把！</h1>');
        }
    });
}
s();
$('table').on('click', function(e) {
    if (e.target.tagName === 'A') {
        const c_id = e.target.id;
        $.ajax({
            type: 'GET',
            url: 'http://120.26.171.166:7009/user/delete?c_id=' + c_id,
            success: (data) => {
                if (data.statu == 200) {
                    s();
                }
            }
        });
    }
});

// 如果需要展示购物车
const shop = decodeURIComponent(getParamsByUrl(location.href, "shop"));
if (shop == 1) {
    $('.current').removeClass('current');
    $('[data-index=2]').addClass('current');
    $('.right-current').removeClass('right-current');
    $('.cart').addClass('right-current');
}