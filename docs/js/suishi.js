//首页加载
setTimeout(function () {
    $('.loading').hide();
    $('.main')[0].style.display = 'block';
});

//    生成二维码
    $('#android-code').qrcode({width: 130,height: 130,text: "http://a.app.qq.com/o/simple.jsp?pkgname=com.suishidata.homeapp"});
    $('#iphone-code').qrcode({width: 130,height: 130,text: "http://www.suishidata.com"});


var slideEle = slider($('.items'));

function slider(elem) {
    var items = elem.children(),
        max = items.length - 1,
        animating = false,
        currentElem,
        nextElem,
        pos = 0;

    sync();

    return {
        next: function () {
            move(1);
        },
        prev: function () {
            move(-1);
        },
        itemsNum: items && items.length
    };

    function move(dir) {
        if (animating) {
            return;
        }
        if (dir > 0 && pos == max || dir < 0 && pos == 0) {
            if (dir > 0) {
                nextElem = elem.children('div').first().remove();
                nextElem.hide(2000,"linear");
                elem.append(nextElem);
            } else {
                nextElem = elem.children('div').last().remove();
                nextElem.hide(2000,"linear");
                elem.prepend(nextElem);
            }
            pos -= dir;
            sync();
        }
        animating = true;
        items = elem.children();
        currentElem = items[pos + dir];
        $(currentElem).fadeIn(2000, "linear", function () {
            pos += dir;
            animating = false;
        });
    }

    function sync() {
        items = elem.children();
        for (var i = 0; i < items.length; ++i) {
            items[i].style.display = i == pos ? 'block' : '';
        }
    }

}

if (slideEle.itemsNum && slideEle.itemsNum > 1) {
    setInterval(function () {
        slideEle.next();
    }, 4000)
}





