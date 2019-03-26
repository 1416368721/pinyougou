/** 定义控制器层 */
app.controller('indexController', function($scope, baseService){

    // 获取登录用户名
    $scope.showName = function () {
        baseService.sendGet("/user/showName").then(function (response) {
            // 获取响应数据
            $scope.loginName = response.data.loginName;
        });
    };

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