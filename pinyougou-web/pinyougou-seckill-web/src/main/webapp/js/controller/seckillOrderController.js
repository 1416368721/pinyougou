/** 定义订单控制器 */
app.controller("seckillOrderController", function($scope,$controller,
                   $interval,$location,baseService){

    /** 指定继承seckillGoodsController */
    $controller("seckillGoodsController", {$scope:$scope});


    /** 生成微信支付二维码 */
    $scope.genPayCode = function(){
        baseService.sendGet("/order/genPayCode").then(function(response){
            if(response.data){
                /** 获取金额 */
                $scope.money = (response.data.totalFee / 100).toFixed(2);
                /** 获取订单号 */
                $scope.outTradeNo = response.data.outTradeNo;
                /** 生成二维码 */
                var qr = new QRious({
                    element: document.getElementById('qrious'),
                    size: 250,
                    level: 'H',
                    value: response.data.codeUrl
                });


                /**
                 * 开启定时器
                 * 第一个参数：回调函数
                 * 第二个参数：时间毫秒数 3秒
                 * 第三个参数：执行的次数 100次
                 * */
                var timer = $interval(function () {
                    /** 发送请求，查询支付状态 */
                    baseService.sendGet("/order/queryPayStatus?outTradeNo="
                        + $scope.outTradeNo)
                        .then(function (response) {
                            if (response.data.status == 1) {// 支付成功
                                /** 取消定时器 */
                                $interval.cancel(timer);
                                location.href = "/order/paysuccess.html?money="
                                    + $scope.money;
                            }
                            if (response.data.status == 3) { // 支付失败
                                /** 取消定时器 */
                                $interval.cancel(timer);
                                location.href = "/order/payfail.html";
                            }
                        });
                }, 3000, 100);

                /** 100次(5分钟)成功后需要调用的函数 */
                timer.then(function () {
                    $scope.codStr = "微信支付二维码已失效！";
                });
            };
        });
    };

    /** 获取金额 */
    $scope.getMoney = function(){
        return $location.search().money;
    };
});