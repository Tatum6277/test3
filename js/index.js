window.onload = function () {
    // 一定要记得先设置好轮播图的结构，再去调用头部透明度变化的函数
    bannderStruct()

    headerOpacity()

    timeBack()
}
// 实现京东首页顶部栏的透明度效果
function headerOpacity() {
    // 1.获取到顶部栏
    var jd_header = document.querySelector('.jd_header')
    // 2.获取轮播图结构
    var jd_banner = document.querySelector('.jd_banner')
    // 3.获取轮播图的高度
    var jd_bannerH = jd_banner.offsetHeight
    var scrollH = document.body.scrollTop + document.documentElement.scrollTop
    // 5.计算透明度
    var opacity = scrollH / jd_bannerH
    jd_header.style.backgroundColor = 'rgba(233,35,34,' + opacity + ')'

    window.onscroll = function () {
        // 4.获取当前页面滚动出屏幕的高度
        //  document.body.scrollTop有兼容性，如果它无效，就需要使用document.documentElement.scrollTop。这两种方式在任何浏览器上只有一种是有效的。，如果不支持， 这个值就为0
        var scrollH = document.body.scrollTop + document.documentElement.scrollTop
        console.log(scrollH + ":" + jd_bannerH)
        // 5.计算透明度
        var opacity = scrollH / jd_bannerH
        if (scrollH > jd_bannerH) {
            opacity = 1
        }
        // 6.设置透明度样式
        jd_header.style.backgroundColor = 'rgba(233,35,34,' + opacity + ')'
    }
}

// 实现京东首页的倒计时效果
function timeBack() {
    var spans = document.querySelector('.jd_sk_time').querySelectorAll('span')
    var total = 5000

    // 添加计时器
    var timerId = setInterval(function () {
        total--
        if (total < 0) {
            clearInterval(timerId)
            return
        }
        // 获取秒数所代表的时分秒
        var hour = Math.floor(total / 3600)
        var minute = Math.floor(total % 3600 / 60)
        var second = total % 60

        // 赋值
        spans[0].innerHTML = Math.floor(hour / 10)
        spans[1].innerHTML = hour % 10
        spans[3].innerHTML = Math.floor(minute / 10)
        spans[4].innerHTML = minute % 10
        spans[6].innerHTML = Math.floor(second / 10)
        spans[7].innerHTML = second % 10
    }, 1000)
}

// 修改轮播图的结构
function bannderStruct() {
    // 修改轮播图结构
    {
        var jd_banner = document.querySelector('.jd_banner')
        var jd_bannerW = jd_banner.offsetWidth
        // 获取图片盒子--这就是我们需要进行操作的轮播图结构
        var imgBox = jd_banner.querySelector('ul:nth-of-type(1)')
        // 1.获取第一张图片
        var first = imgBox.querySelector('li:first-child')
        // 2.获取最后一张图片
        var last = imgBox.querySelector('li:last-child')
        // 3.将第一张图追加到最后的位置
        imgBox.appendChild(first.cloneNode(true))
        // 4.将最后一张图插入到最前面的位置
        imgBox.insertBefore(last.cloneNode(true), first)
        // 5.设置ul的总宽度
        // 5.1获取li的总数量
        var allLi = imgBox.querySelectorAll('li')
        var count = allLi.length
        // 5.2 计算总宽度并赋值
        imgBox.style.width = (count * jd_bannerW) + 'px'
        // 6.设置每一个li的宽度
        for (var i = 0; i < allLi.length; i++) {
            allLi[i].style.width = jd_bannerW + 'px'
        }
        // 7.设置默认的偏移
        imgBox.style.left = - jd_bannerW + 'px'

    }

    // 获取所有小点点
    var indicators = jd_banner.querySelector('ul:nth-of-type(2)').querySelectorAll('li')
    function setIndicators(index) {
        for (var i = 0; i < indicators.length; i++) {
            indicators[i].classList.remove('active')
        }
        indicators[index - 1].classList.add('active')
    }

    // 动起来：自动轮播
    // 开启定时器
    var timerId
    function startTime(){
        timerId = setInterval(function () {
            index++
            console.log(index)
            // 添加过渡效果
            imgBox.style.transition = 'left 0.5s linear'
            // 重新设置left样式
            imgBox.style.left = - (index * jd_bannerW) + 'px'
            // 判断是否是最后一张，如果是，就瞬间移动到索引1
            // 我得做一个事情，我得等之前的过渡完成之后，再进行下面的判断
            // setTimeout(function () {
            //     if (index == count - 1) {
            //         index = 1
            //         // 如果之前添加了过渡效果，那么不清除，过渡效果会一直存在
            //         imgBox.style.transition = 'none'
            //         imgBox.style.left = - (index * jd_bannerW) + 'px'
            //     }
            // }, 500);
        }, 2000)
    }

    // 起始索引为1，是因为之前已经实现过一张图片的偏移
    var index = 1
    startTime()

    // 动起来：手动轮播
    var startX, distanceX, moveX
    // 定义一个变量，标记是否可以进行滑动
    var isCanMove = true
    // 添加三个事件
    imgBox.addEventListener('touchstart', function (event) {
        // 清除定时器
        clearInterval(timerId)
        // 获取当前手指单击的起始坐标
        startX = event.targetTouches[0].clientX
    })
    // -------------
    imgBox.addEventListener('touchmove', function (event) {
        // 标记是否可以进行滑动
        if (isCanMove) {
            console.log('touchmove')
            // 获取移动过程中的手指的坐标位置
            moveX = event.targetTouches[0].clientX
            // 计算这次事件触发时的 移动的距离
            distanceX = moveX - startX
            // 一定要记得清除之前可能添加的过渡效果
            imgBox.style.transition = 'none'
            // 设置定位值
            imgBox.style.left = -(index * jd_bannerW) + distanceX + 'px'
        }
    })
    // 松开手指的后续操作：如果当前滑动的距离超出指定的值则翻页，否则回弹
    // 判断当前滑动的距离的正负，来确定是索引加还是减
    // 正值：index --
    // 负值：index ++
    imgBox.addEventListener('touchend', function (event) {
        console.log('distanceX:'+distanceX)
        // 将isCanMove重置为false
        isCanMove = false
        // 滑动的距离超过指定的100px--翻页
        if (Math.abs(distanceX) >= 100) {
            if (distanceX > 0) {
                index--
            } else {
                index++
            }
            // 添加过渡效果
            imgBox.style.transition = 'left 0.5s linear'
            // 重新设置left样式
            imgBox.style.left = - (index * jd_bannerW) + 'px'
        } else if (Math.abs(distanceX) >= 0) {
            // 添加过渡效果
            imgBox.style.transition = 'left 0.5s linear'
            // 重新设置left样式
            imgBox.style.left = - (index * jd_bannerW) + 'px'
        }
        // 一定要记得将之前的全局变量的值重置
        startX=0, distanceX=0
    })

    // 添加过渡结束的监听：当指定元素的过渡效果执行完毕时触发
    imgBox.addEventListener('transitionend', function (event) {
        console.log('transitionend')
        // 1.如果到索引0，索引重置为count-2
        if (index == 0) {
            index = count - 2
            // 添加过渡效果
            imgBox.style.transition = 'none'
            // 重新设置left样式
            imgBox.style.left = - (index * jd_bannerW) + 'px'
        }
        // 2.如果索引为count-1,索引重置为1
        else if (index == count - 1) {
            index = 1
            // 添加过渡效果
            imgBox.style.transition = 'none'
            // 重新设置left样式
            imgBox.style.left = - (index * jd_bannerW) + 'px'
        }
        // 调用小点点的设置函数  
        setIndicators(index)
        // 等重置执行完毕之后重置 
        setTimeout(function(){
            isCanMove = true
            // 重启之前衔关闭之前可能打开的定时器
            clearInterval(timerId)
            // 重启定时器
            startTime()
        },120);
    })
}