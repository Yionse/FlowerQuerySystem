// 检车是否登录成功函数
function check_login() {
    const user = $("#user_name").val();
    const pass = $("#password").val();
    $.ajax({
        type: 'POST',           //  请求的方式
        url: 'http://120.26.171.166:7009/public/login',     //  请求的url，服务器在本地主机上
        data: {         //  发送过去的数据
            user,
            pass
        },
        success: (data) => {        //  发送请求成功的回调，可以接收到服务器的响应，data存储了服务器的响应体
            if (data.statu === 200) {
                // 登录成功，则需要清除登录框上的输入信息
                $("#user_name").val('');
                $("#password").val('');
                //  响应码为200说明登录成功，跳转到首页
                // 如果是管理员的话，则跳转到对应的管理员用户
                if (data.user === 'admin') {
                    location.href = 'backstage.html';
                    // 管理员用户不记录token
                } else {
                //  登录成功的话，返回的数据里是有token 的，需要将token存在localStorage中，方便下次存取
                    localStorage.setItem('final_login_token', data.token);
                    location.href = 'index.html';
                }
            } else {
                // 登录失败
                $("#login_form").removeClass('shake_effect');
                setTimeout(function () {
                    $("#login_form").addClass('shake_effect')
                }, 1);
            }
        }
    });
}

// 检查是否注册成功
function check_register() {
    // 获取所有需要的值
    const user = $("#r_user_name").val();
    const pass = $("#r_password").val();
    const tel = $("#r_tel").val();
    const local = $('#r_local').val();
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;     //  使用正则表达式
    const flag = reg.exec(tel);     //  手机号必须合法，才可以注册
    if (user != "" && pass != "" && tel != "" && local != '' && flag) {
        // 发送Ajax请求，步骤同登录函数，这里不再说明
        $.ajax({
            type: 'POST',
            url: 'http://120.26.171.166:7009/public/register',
            data: {
                user,
                pass,
                tel,
                local
            },
            success: (data) => {
                if (data.statu === 200) {
                    alert('注册成功！');
                    // 注册成功
                    $('.register-form .message a').click();
                    $('#user_name').val(user);
                    $('#password').val(pass);
                    // 清除表单信息
                    $('.register-form')[0].reset();
                } else {
                    alert('用户名可能已经被使用，请尝试更换！');
                }
            }
        });
    }
    else {
        if (user == "" || pass == "" || tel == "" || local == '') {
            alert('输入完整信息！');
        }
        if (!flag) {
            alert('输入正确的手机号！');
        }
        // 注册失败
        $("#login_form").removeClass('shake_effect');
        setTimeout(function () {
            $("#login_form").addClass('shake_effect')
        }, 1);
    }
}

// 注册点击事件
$("#create").click(function (e) {
    e.preventDefault();
    check_register();
    return false;
})
$("#login").click(function (e) {
    e.preventDefault();
    check_login();
    return false;
})
// 小的创建和登录按钮的动画函数
$('.message a').click(function () {
    $('form').animate({
        height: 'toggle',
        opacity: 'toggle'
    }, 'slow');
});