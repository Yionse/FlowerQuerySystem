function render(data, ele, temp) {
    let htmlStr = '';
    data.forEach((item, index) => {
        htmlStr += template(temp, item);
    });
    ele.html(htmlStr);
}

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

$('.bay').click(() => {
    location.replace('../login.html');
});

function s() {
    const user = new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: 'http://120.26.171.166:7009/back/get',
            success: (data) => {
                resolve(data);
            },
            err: (reason) => {
                reject(reason);
            }
        });
    });
    
    user.then(value => {
        render(value, $('.infor tbody'), 'user');
    }, reason => {
        console.log(reason);
    });
}

s();

$('.user-infor').on('click', function(e) {
    if (e.target.tagName === 'A') {
        const u_id = e.target.id;
        $.ajax({
            type: 'GET',
            url: 'http://120.26.171.166:7009/back/delete?u_id=' + u_id,
            success: (data) => {
                if (data.statu == 200) {
                    s();
                }
            }
        });
    }
});