/** 定义控制器层 */
app.controller('indexController2', function($scope, $controller,$location,$interval, baseService){
    /** 指定继承baseController */
    $controller('baseController',{$scope:$scope});
    // 获取登录用户名
    $scope.showName = function () {
        baseService.sendGet("/user/showName").then(function (response) {
            // 获取响应数据
            $scope.loginName = response.data.loginName;
        });
    };
    /** 分页查询(查询条件) */
    $scope.search = function(page, rows){
        baseService.findByPage("/order/findByPage", page,
            rows)
            .then(function(response){
                /** 获取分页查询结果 */
                $scope.dataList = response.data.rows;
                /** 更新分页总记录数 */
                $scope.paginationConf.totalItems = response.data.total;
            });
    };

    /** 提醒发货或付款**/
    $scope.payOrDeliver = function (orders) {
        if (orders.order.status == 2){//已付款
            alert("已提醒商家发货")
        }
        if (orders.order.status == 1){//未付款
            baseService.sendGet("/order/saveOrder?orderId="+orders.order.orderId.toFixed()).then(function (response) {
                if (response.data){
                    location.href = "/order/pay.html";
                }else {
                    alert("付款失败")
                }
            })
        }
    }

    // 生成微信支付二维码
    $scope.getPayCode = function () {
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
            }, 3000, 60);

            // 在总次数调用完之后，回调一个指定函数
            timer.then(function(){
                // 提示信息
                $scope.tip = "二维码已过期，刷新页面重新获取二维码。";
            });

        });
    };


});