/** 定义秒杀商品控制器 */
app.controller("seckillGoodsController", function($scope,$controller,$location,$timeout,baseService){

    /** 指定继承cartController */
    $controller("baseController", {$scope:$scope});

    // 查询正在秒杀的商品
    $scope.findSeckillGoods = function(){
        // 发送异步请求
        baseService.sendGet("/seckill/findSeckillGoods").then(function(response){
            // 获取响应数据
            $scope.seckillGoodsList = response.data;
        });
    };

    // 根据秒杀商品id查询秒杀商品对象
    $scope.findOne = function(){

        // 获取秒杀商品id
        var id = $location.search().id;
        // 发送异步请求
        baseService.sendGet("/seckill/findOne?id=" + id).then(function(response){
            // 获取响应数据
            $scope.entity = response.data;

            // 调用倒计时方法
            $scope.downCount($scope.entity.endTime);
        });
    };


    // 定义倒计时的方法
    $scope.downCount = function (endTime) {
        // 用结束时间的毫秒数减当前系统时间毫秒数
        var milliseconds = endTime - new Date().getTime();
        // 计算出相差的秒数
        var seconds = Math.floor(milliseconds / 1000);

        if (seconds >= 0) {

            // 计算出相差的分钟
            var minutes = Math.floor(seconds / 60);
            // 计算出相差的小时
            var hours = Math.floor(minutes / 60);
            // 计算出相差的天数
            var days = Math.floor(hours / 24);

            // 1天 12:22:33
            var resArr = [];
            if (days > 0) {
                resArr.push(calc(days) + "天 ");
            }
            if (hours > 0) {
                resArr.push(calc(hours - days * 24) + ":");
            }
            if (minutes > 0) {
                resArr.push(calc(minutes - hours * 60) + ":")
            }
            resArr.push(calc(seconds - minutes * 60));

            // 时间字符串
            $scope.timeStr = resArr.join("");

            // 开启定时器
            $timeout(function () {
                $scope.downCount(endTime);
            }, 1000);

        }else{
            $scope.timeStr = "秒杀已结束！";
        }
    };

    // 定义计算方法
    var calc = function (num) {
        return num > 9 ? num : "0" + num;
    };

    // 秒杀下单
    $scope.submitOrder = function () {
        // 判断用户是否登录
        if ($scope.loginName){ // 已登录
            // 发送异步请求，实现秒杀下单
            baseService.sendGet("/order/submitOrder?id="
                + $scope.entity.id).then(function(response){
                // 获取响应数据
                if (response.data){
                    // 跳转到支付页面
                    location.href = "/order/pay.html";
                }else{
                    alert("秒杀下单失败！");
                }
            });
        }else{
            // 未登录，重定向到单点登录系统
            location.href = "http://sso.pinyougou.com/?service=" + $scope.redirectUrl;
        }
    };

});