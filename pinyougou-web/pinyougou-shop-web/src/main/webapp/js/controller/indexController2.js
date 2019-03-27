// 定义运营商后台首页控制器
app.controller('indexController2', function ($scope, $controller, baseService) {

    /** 指定继承baseController */
    $controller('baseController',{$scope:$scope});

    // 获取登录用户名
    $scope.showLoginName = function () {
        baseService.sendGet("user/showName").then(function (response) {
            // 获取响应数据
            $scope.loginName = response.data.loginName;
        });
    };

});