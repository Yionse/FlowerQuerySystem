// 先验证token
token().then(value => {
    $('.userCenter').attr('href', 'user.html?id=' + value);
    $('.car').attr('href', 'user.html?id=' + value+'&shop=1');
}, reason => {
});

// 定义banner的图片路径
const url = [
    'images/23_brand_banner_pc.jpg',
    'images/23_birthday_pc.jpg',
    'images/23_mothersday_banner_pc.jpg'
];

// 定义跳转的关键字
const dataUrl = [
    'public/all',
    'public/purpose',
    'public/purpose'
];

const dataKey = [
    '',
    '生日',
    '长辈'
];

// 定义当前是第几张
let count = 0;

// 播放下一张图片
function next() {
    count++;
    // 对count的值进行判断，要永远合法
    if (count === url.length) {
        count = 0;
    }
    // 调用函数修改对应的内容
    toggle(count);
}

// 播放上一张图片
function perv() {
    count--;
    // 对count的值进行判断，要永远合法
    if (count === -1) {
        count = url.length - 1;
    }
    // 调用函数修改对应的内容
    toggle(count);
}

// 执行修改操作
function toggle(count) {
    // 先清除掉带有current的类
    $('.current').removeClass('current');
    // 给当前的类添加上
    $('.item')[count].classList.add('current');
    // 更换背景
    $('main')[0].style.backgroundImage = `url(${url[count]})`;
    $('.site-box').attr('data-url', dataUrl[count]);
    $('.site-box').attr('data-key', dataKey[count]);
}

// 设置定时器
let inter = setInterval(next, 2000);

// 当鼠标进入时，需要清除定时器，不要再走了
$('.site-box').mouseenter(() => {
    clearInterval(inter);
});

// 鼠标离开，重新开启定时器
$('.site-box').mouseleave(() => {
    inter = setInterval(next, 2000);
});

// 给两个按钮添加点击方法
$('.right').click((e) => {
    next();
    e.stopPropagation()
});
$('.left').click((e) => {
    perv();
    e.stopPropagation()

});

// 添加小圆点点击方法
$('.item').click(function () {
    // 更换当前小圆点对应的图片
    toggle($(this).attr('data-index'));
});

// love Flower 部分
ajax_my('public/purpose', '爱情', '1').then(value => {
    render( value.data, $('.commodity-box-love'),'爱情');
});

// parent Flower 部分
ajax_my('public/purpose', '长辈', '1').then(value => {
    render( value.data, $('.commodity-box-parent'),'送长辈');
});

// forever Flower 部分
ajax_my('public/type', '永生花', '1').then(value => {
    render(value.data, $('.commodity-box-forever'), '永生花');
});

// 定义轮播图身上的点击事件
$('.site-box').click(function() {
    const url = $(this).attr('data-url');
    const key = $(this).attr('data-key');
    // ajax_my(url, key);
    location.href = `list.html?url=${url}&key=${key}`;
});

