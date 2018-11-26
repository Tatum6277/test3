window.onload = function () {
    // 获取盒子 盒子宽度
    var jd_content = document.querySelector(".jd_contentL");
    jd_contentH = jd_content.offsetHeight;
    // 元素的盒子 宽度
    var ulBox = jd_content.querySelector('ul');
    ulBoxH = ulBox.offsetHeight;
    // 滑动功能的实现
    // 四个区间
    // 存储滑动区间 你滑动到多少的时候不让你滑动  值是自己设定的 想给多少给多少
    var bounce = 100;
    // 最大静止的位移
    var maxY = 0;
    // 滑动状态最大静止的位移
    var maxBounceH = maxY + bounce;
    // 静止状态下最小的值
    var minY = jd_contentH - ulBoxH;
    // 滑动状态下最小的值
    var minBounceH = minY - 100;

    // 实现滑动
    var startY, moveY, distentY;
    // 定义一个变量用来记录当元素的滑动
    var currentY = 0;
    ulBox.addEventListener('touchstart', function (event) {
        // 获得手指触摸的时候的值
        startY = event.targetTouches[0].clientY;
    })
    ulBox.addEventListener('touchmove', function (event) {
        // 获得当前移动的位置
        moveY = event.targetTouches[0].clientY;
        // 获得偏移量
        distentY = moveY - startY;
        // 设置最大可以滑动的范围 偏移量大于最大的时候和偏移量小于最小的时候  
        if (currentY + distentY >= maxBounceH || currentY + distentY <= minBounceH) {
            console.log('别拉啦，快断啦');
            return;
        }
        // 连续滑动的实现要加上之前的偏移量 而之前的偏移量已经在touchend事件中存储了 连续滑动之前肯定要松开上一次的touch事件 所以把偏移量存在touchend事件
        // 动起来
        ulBox.style.transition = 'none'
        ulBox.style.top = currentY + distentY + 'px';
    })
    // 添加touchend事件:记录之前已经移动过的距离
    ulBox.addEventListener('touchend', function (event) {
        // 判断回弹
        if (currentY + distentY > maxY) {
            ulBox.style.transition = 'top 0.5s'
            ulBox.style.top = maxY + 'px'; //就是等于0
            // 重新给currentY赋值
            currentY = maxY;
            console.log(currentY);
        } else if (currentY + distentY < minY) {
            ulBox.style.transition = 'top 0.5s'
            ulBox.style.top = minY + 'px'
            // 重新给currentY赋值
            currentY = minY;
            console.log(currentY);
        } else {
            // 在合理的区域内拉伸
            currentY += distentY;
        }
    })

    // 点击功能的实现
    // 获取点击的li
    var ul = jd_content.querySelector('ul:nth-of-type(1)');
    var lis = ul.querySelectorAll('li');

    for (var i = 0; i < lis.length; i++) {
        lis[i].index = i;
    }
    // 给li注册点击事件
    heima.tap(ulBox, function (event) {
        // 修改样式
        for (var i = 0; i < lis.length; i++) {
            lis[i].classList.remove('active')
        }
        // 当前的元素 currentLi 
        var currentLi = event.target.parentNode;
        currentLi.classList.add('active');
        // 实现偏移操作
        // 取得当前的index
        var index = currentLi.index;
        // 获取当前ul的偏移量
        //1. 获取li的高度
        var lisH = currentLi.offsetHeight;
        // 2.添加过渡效果
        ulBox.style.transition = 'top 0.5s'
        // 3.获得ulBox的偏移量 
        var ulBox_top = -currentLi.index * lisH;
        // 4.设置给ulBox
        // ulBox.style.top = ulBox_top + 'px';
        // 设置lis向上移动的范围 判断当前的偏移量是否大于盒子的高度 大于就让盒子不要在移动啦 错误的想法
        // 正确额想法 设置lis向上移动的范围 判断当前的偏移量是否小于最小的偏移量 即是 minY 
        if (ulBox_top < minY) {
            ulBox.style.top = minY + 'px';
            // 记得重置滑动的偏移量 currentY 不然伸缩的时候不能动
            currentY = minY;
        } else {
            ulBox.style.top = ulBox_top + 'px';
            // 记得重置滑动的偏移量 currentY 不然伸缩的的时候不能动
            currentY = ulBox_top;
        }
    })



}