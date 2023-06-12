// 首页的文件，由于是首页，所以在一开始就要将目前存储的token，发送到服务器端，进行解析
function token() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: 'http://120.26.171.166:7009/token/token',
            headers: {
                // token数据只能在请求头中，通过Authorization的值发送
                'authorization': localStorage.getItem('final_login_token')
            },
            success: (data) => {
                if (data.statu === 200) {
                    // 当请求成功时，需要隐藏登录模块，而要显示详情
                    $('.hide').removeClass('hide');
                    $('.log').addClass('hide');
                    // 把服务端经过token解析股过得用户名拿到
                    $('.name').text(data.data.user);
                    resolve(data.data.id);
                } else {
                    reject(data);
                }
            }
        });
    });
}

function getParamsByUrl(current, name) {
    //根据关键字获取搜索结果
    var index = current.indexOf('?');
    var str = current.substr(index + 1);
    var arr = str.split('&');
    var keuval;
    $.each(arr, function(index, value) {
        var arr2 = value.split('=');
        // console.log(arr2);
        if (arr2[0] == name) {
            keuval = arr2[1];
            return false;
        }
    })
    return keuval;
}

// 定义公共接口发送Ajax请求的方法 
function ajax_my(url, key, flag='0') { 
    return new Promise((resolve, reject) => { 
        // 发送Ajax请求
        $.ajax({
            type: 'GET',
            url: `http://120.26.171.166:7009/${url}?key=${key}&flag=${flag}`,
            success: data => {
                if (data.statu === 200) {
                    // 查询成功
                    resolve(data);
                }
            },
            error: err => {
                reject(err);
            }
        });
    })
}

// 渲染函数
function render(data, ele, prefix = '') {
    let htmlStr = '';
    data.forEach((item, index) => {
        item['prefix'] = prefix;
        htmlStr += template('temp', item);
    });
    ele.html(htmlStr);
}

// 搜索按钮的点击方法
$('.search').click((e) => {
    // 如果表单的内容不为空，则可以跳转
    if ($('.form-control').val() != '') {
        const keywords = $('.form-control').val();
        $('.form-control').val('');
        location.href = `list.html?url=public/search&key=${keywords}`
    }
});

$('.form-control').focus(() => {
    $('.form-control').keydown((e) => {
        if (e.key === 'Enter') {
            $('.search').click();
        }
    });
});

$('.success').mouseenter(() => {
    $('.quit').fadeIn();
});
$('.success').mouseleave(() => {
    $('.quit').fadeOut();
});

$('.deleteToken').click(() => {
    // 当退出登录的时候，则破坏token
    localStorage.setItem('final_login_token', '');
});