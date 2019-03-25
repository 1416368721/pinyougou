// 订单控制器
app.controller('orderController', function ($scope, $controller, $interval,$location, baseService) {
    // 继承cartController
    $controller('cartController', {$scope:$scope});

    // 获取当前登录用户的收件地址
    $scope.findAddressByUser = function () {
        baseService.sendGet("/order/findAddressByUser").then(function(response){
            // 获取响应数据
            $scope.addressList = response.data;

            // 获取默认收件地址
            $scope.address = $scope.addressList[0];
        });
    };

    // 用户选择地址
    $scope.selectedAddress = function (item) {
        $scope.address = item;
    };

    // 选中的地址添加样式(判断是否为选中的地址)
    $scope.isSelectedAddress = function (item) {
        return $scope.address == item;
    };

    // 提交订单数据封装对象
    $scope.order = {paymentType  : '1'};

    // 支付方式选择
    $scope.selectPayType = function (payType) {
        $scope.order.paymentType = payType;
    };

    // 提交订单
    $scope.saveOrder = function () {
        // 封装请求参数
        // 设置收件人地址
        $scope.order.receiverAreaName = $scope.address.address;
        // 设置收件人手机号码
        $scope.order.receiverMobile = $scope.address.mobile;
        // 设置收件人
        $scope.order.receiver = $scope.address.contact;
        // 设置来源 2：pc端
        $scope.order.sourceType = "2";
        // 发送异步请求
        baseService.sendPost("/order/saveOrder", $scope.order).then(function(response){
            // 获取响应数据
            if (response.data){
                // 判断付款方式
                if ($scope.order.paymentType == 1){
                    // 微信支付，跳转到支付页面
                    location.href = "/order/pay.html";
                }else{
                    // 货到付款，跳转到成功页面
                    location.href = "/order/paysuccess.html";
                }
            }else{
                alert("提交订单失败！");
            }
        });
    };

    // 生成微信支付二维码
    $scope.genPayCode = function () {
        // 发送异步请求
        baseService.sendGet("/order/genPayCode").then(function(response){
            // 获取响应数据 {outTradeNo : '', money : 100, codeUrl : ''}
            // 获取交易订单号
            $scope.outTradeNo = response.data.outTradeNo;
            // 获取支付金额
            $scope.money = (response.data.totalFee / 100).toFixed(2);
            // 获取支付URL
            $scope.codeUrl = response.data.codeUrl;

            // 生成二维码
            document.getElementById("qrious").src = "/barcode?url=" + $scope.codeUrl;


            /**
             * 开启定时器(间隔3秒发送异步请求，获取支付状态)
             * 第一个参数：调用回调的函数
             * 第二个参数：时间毫秒数 3秒
             * 第三个参数：总调用次数 100次
             */
            var timer = $interval(function () {
                // 发送异步请求
                baseService.sendGet("/order/queryPayStatus?outTradeNo="
                    + $scope.outTradeNo).then(function(response){
                    // 获取响应数据 {status : 1|2|3} 1: 支付成功、2:未支付、3:支付失败
                    if (response.data.status == 1){ // 支付成功
                        // 取消定时器
                        $interval.cancel(timer);
                        // 跳转到支付成功页面
                        location.href = "/order/paysuccess.html?money=" + $scope.money;
                    }
                    if (response.data.status == 3){// 支付失败
                        // 取消定时器
                        $interval.cancel(timer);
                        // 跳转到支付失败页面
                        location.href = "/order/payfail.html";
                    }
                });
            }, 3000, 100);

            // 在总次数调用完之后，回调一个指定函数
            timer.then(function(){
                // 提示信息
                $scope.tip = "二维码已过期，刷新页面重新获取二维码。";
            });

        });
    };

    // 获取支付金额
    $scope.getMoney = function () {
        return $location.search().money;
    };
});