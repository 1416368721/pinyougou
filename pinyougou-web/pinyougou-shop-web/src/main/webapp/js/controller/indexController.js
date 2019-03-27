// 定义运营商后台首页控制器
app.controller('indexController', function ($scope, baseService) {

    // 获取登录用户名
    $scope.showLoginName = function () {
        baseService.sendGet("/showLoginName").then(function (response) {
            // 获取响应数据
            $scope.loginName = response.data.loginName;
        });
    };

});