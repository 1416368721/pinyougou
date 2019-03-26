/** 定义控制器层 */
app.controller('userController', function ($scope, $controller, $timeout, baseService) {

    // 继承baseController
    $controller('indexController', {$scope: $scope});

    // 定义json对象
    $scope.user = {};

    // 用户注册
    $scope.save = function () {

        // 判断密码是否一致
        if ($scope.okPassword && $scope.user.password == $scope.okPassword) {
            // 发送异步请求
            baseService.sendPost("/user/save?code=" + $scope.code,
                $scope.user).then(function (response) {
                // 获取响应数据
                if (response.data) {
                    // 跳转到登录页面
                    // 清空表单数据
                    $scope.user = {};
                    $scope.okPassword = "";
                    $scope.code = "";
                } else {
                    alert("注册失败！");
                }
            });
        } else {
            alert("两次密码不一致！");
        }
    };


    // 定义显示文本
    $scope.tipMsg = "获取短信验证码";
    $scope.flag = false;

    // 发送短信验证码
    $scope.sendSmsCode = function () {

        // 判断手机号码的有效性
        if ($scope.user.phone && /^1[3|4|5|7|8|9]\d{9}$/.test($scope.user.phone)) {
            // 发送异步请求
            baseService.sendGet("/user/sendSmsCode?phone="
                + $scope.user.phone).then(function (response) {
                // 获取响应数据
                if (response.data) {
                    // 倒计时 (扩展)
                    $scope.flag = true;
                    // 调用倒计时方法
                    $scope.downcount(90);
                } else {
                    alert("获取短信验证码失败！");
                }
            });
        } else {
            alert("手机号码不正确！");
        }
    };


    // 倒计时方法
    $scope.downcount = function (seconds) {
        if (seconds > 0) {
            seconds--;
            $scope.tipMsg = seconds + "秒，后重新获取";

            // 开启定时器
            $timeout(function () {
                $scope.downcount(seconds);
            }, 1000);
        } else {
            $scope.tipMsg = "获取短信验证码";
            $scope.flag = false;
        }
    };

    $scope.setUser = {};

    $scope.updatePassword = function () {
        $scope.setUser.username = $scope.loginName;

        if ($scope.doublePassword && $scope.setUser.password == $scope.doublePassword) {
            baseService.sendPost("/user/updatePassword", $scope.setUser).then(function (response) {
                if (response.data) {
                    $scope.setUser = {};
                    $scope.doublePassword = "";
                    alert("设置成功");
                } else {
                    alert("设置失败");
                }
            })
        }
    }

});