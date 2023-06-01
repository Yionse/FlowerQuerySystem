// 先验证token
token().then(value => {
    $('.userCenter').attr('href', 'user.html?id=' + value);
    $('.car').attr('href', 'user.html?id=' + value+'&shop=1');
}, reason => {
});

const url = decodeURIComponent(getParamsByUrl(location.href, "url"));
const key = decodeURIComponent(getParamsByUrl(location.href, "key"));

if (url === 'public/search') {
    $('.form-control').val(key);
}

// 调用函数，发起Ajax请求
ajax_my(url, key).then(value => {
    render(value.data, $('.my-continar'));
    if (value.data.length === 0) {
        $('.my-continar').html('<h3>当前没有你想要的商品</h3>');
    }
}, error => {
    alert('发生错误！');
});