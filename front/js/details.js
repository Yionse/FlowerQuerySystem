let userId = '';

// 先验证token
token().then(value => {
    userId = value;
    $('.userCenter').attr('href', 'user.html?id=' + value);
    $('.car').attr('href', 'user.html?id=' + value+'&shop=1');
}, reason => {
});

function render(ele, text) {
    ele.text(text);
}

// 取到那些值，将其渲染到页面上
const language = decodeURIComponent(getParamsByUrl(location.href, "f_language"));
const material = decodeURIComponent(getParamsByUrl(location.href, "f_material"));
const packing = decodeURIComponent(getParamsByUrl(location.href, "f_packing"));
const src = decodeURIComponent(getParamsByUrl(location.href, "f_src"));
const title = decodeURIComponent(getParamsByUrl(location.href, "f_title"));
const tag = decodeURIComponent(getParamsByUrl(location.href, "f_tag"));
const activityPrice = decodeURIComponent(getParamsByUrl(location.href, "p_activity_price"));
const price = decodeURIComponent(getParamsByUrl(location.href, "p_price"));
const count = decodeURIComponent(getParamsByUrl(location.href, "s_count"));
const f_id = decodeURIComponent(getParamsByUrl(location.href, "f_id"))

// 开始设置值
render($('.text h1'), title);
render($('.tag'), tag);
render($('.now'), activityPrice + '元');
render($('.old'), price + '元');
render($('.language'), '花语：' + language);
render($('.material'), '材料：' + material);
render($('.packing'), '包装：' + packing);
render($('.stock'), '库存：' + count);
// 设置图片路径
$('.small img').attr('src', src);
$('.large').css('background-image', `url(${src})`)

// 放大镜相关
const small = document.querySelector('.small');
const mask = document.querySelector('.mask');
const large = document.querySelector('.large');
let timer = null;
small.addEventListener('mouseenter', () => {
    clearTimeout(timer)
    show(large);
    show(mask);
});
small.addEventListener('mouseleave', () => {
    clearTimeout(timer);
    timer = setInterval(() => {
        hide(mask);
    }, 200)
    hide(large);
});

small.addEventListener('mousemove', function(e) {
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;

    if (mouseX > 0 && mouseX <= 500 && mouseY > 0 && mouseY <= 500) {
        let moveX = 0;
        let moveY = 0;

        if (mouseX > 125 && mouseX <= 375) moveX = mouseX - 125;
        if (mouseX > 375 && mouseX <= 500) moveX = 250;
        if (mouseY > 125 && mouseY <= 375) moveY = mouseY - 125;
        if (mouseY > 375 && mouseY <= 500) moveY = 250;

        mask.style.left = moveX + 'px';
        mask.style.top = moveY + 'px';
        large.style.backgroundPositionX = -2 * moveX + 'px';
        large.style.backgroundPositionY = -2 * moveY + 'px';
    }

})

large.addEventListener('mouseenter', () => {
    show(this);
});

large.addEventListener('mouseleave', () => {
    hide(this);
});
function show(ele) {
    ele.style.display = 'block';
}
function hide(ele) {
    ele.style.display = 'none';
}

function anima(ele) {
    ele.stop(true).animate({
        top: '5%'
    }).delay(500).animate({
        top: '-20%'
    });
}

// 定义两个按钮的点击方法
$('.buy').click(() => {
    anima($('.panel-danger'));
});

$('.add').click(() => {
    if (userId != '') {
        // 当前是登录状态
        $.ajax({
            type: 'GET',
            url: `http://127.0.0.1/user/shopcar?u_id=${userId}&f_id=${f_id}&f_title=${title}&f_src=${src}&price=${activityPrice}`,
            success: (data) => {
                if (data.statu === 200) {
                    // 加入成功，调用动画
                    anima($('.panel-primary'));
                } else if (data.statu === 301) {
                    // 购物车中已经存在
                    anima($('.error'));
                } else {
                    alert('系统错误');
                }
            }
        });
    } else {
        // 说明该用户现在未登录
        anima($('.please'));
    }
});