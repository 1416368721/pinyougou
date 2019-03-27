// 基础控制器(获取登录用户)
app.controller('baseController', function ($scope, baseService) {

    // 定义获取登录用户名的方法
    $scope.loadUsername = function () {

        // 对请求URL进行unicode编码
        $scope.redirectUrl = window.encodeURIComponent(location.href);

        // 发送异步请求
        baseService.sendGet("/user/showName").then(function(response){
            // 获取响应数据
            $scope.loginName = response.data.loginName;
        });
    };

});