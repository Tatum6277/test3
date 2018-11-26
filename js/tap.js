var heima = {
    tap: function (dom, callback) {
        /**
         * 移动端的点击事件的特点
         * 1 只能一只手指触摸屏幕
         * 2 不能滑动 可以在允许的范围内滑动
         * 3 手指触碰和松开的时间间隔不能大于150ms
         */
        // 点击功能的实现
        // 获取点击的li

        var startX, startY;
        // 时间
        var startTIme;
        dom.addEventListener('touchstart', function (event) {
            // 手指的个数
            if (event.targetTouches.length > 2) {
                return;
            }
            // 当前时间
            startTIme = Date.now();
            startX = event.targetTouches[0].clientX;
            startY = event.targetTouches[0].clientY;
        })
        dom.addEventListener('touchend', function (event) {
            if (Date.now() - startTIme > 150) {
                return;
            }
            var endX = event.changedTouches[0].clientX;
            var endY = event.changedTouches[0].clientY;
            if (Math.abs(endX - startX > 6) || Math.abs(endY - startY > 6)) {
                return;
            }
            callback && callback(event);
        })


    }
}