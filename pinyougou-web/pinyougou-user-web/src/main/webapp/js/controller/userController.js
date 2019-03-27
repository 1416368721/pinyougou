/** 定义控制器层 */
app.controller('userController', function($scope,$controller, $timeout, baseService){
    $controller('baseController', {$scope:$scope});
    // 定义json对象
    $scope.user = {};

    // 用户注册
    $scope.save = function () {
        // 判断密码是否一致
        if ($scope.okPassword && $scope.user.password == $scope.okPassword){
            // 发送异步请求
            baseService.sendPost("/user/save?code=" + $scope.code,
                $scope.user).then(function(response){
                // 获取响应数据
                if (response.data){
                    // 跳转到登录页面
                    // 清空表单数据
                    $scope.user = {};
                    $scope.okPassword = "";
                    $scope.code = "";
                }else{
                    alert("注册失败！");
                }
            });
        }else{
            alert("两次密码不一致！");
        }
    };




    // 定义显示文本
    $scope.tipMsg = "获取短信验证码";
    $scope.flag = false;

    // 发送短信验证码
    $scope.sendSmsCode = function () {

        // 判断手机号码的有效性
        if ($scope.user.phone && /^1[3|4|5|7|8|9]\d{9}$/.test($scope.user.phone)){
            // 发送异步请求
            baseService.sendGet("/user/sendSmsCode?phone="
                + $scope.user.phone).then(function(response){
                    // 获取响应数据
                    if (response.data){
                        // 倒计时 (扩展)
                        $scope.flag = true;
                        // 调用倒计时方法
                        $scope.downcount(90);
                    }else{
                        alert("获取短信验证码失败！");
                    }
            });
        }else{
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
        }else{
            $scope.tipMsg = "获取短信验证码";
            $scope.flag = false;
        }
    };
    $scope.upload = function () {
        baseService.uploadFile().then(function (response) {
            if (response.data.status == 200){
                $scope.user.headPic= response.data.url;
            }else{
                alert("图片上传失败！");
            }
        });
    };

/*查询所有省份*/
    $scope.findAllProvince=function () {
        baseService.sendGet("/user/findProvinces").then(function (response) {

           $scope.provincesList=response.data;
        });
    };
    $scope.user.address={};
    $scope.user.job='';
    $scope.user.headPic='';

    $scope.$watch('user.address.provinceId', function(newValue, oldValue){
            if (newValue){
            $scope.findCity(newValue);
        }else{
            $scope.citiesList = [];
        }});

    $scope.$watch('user.address.cityId', function(newValue, oldValue){
        if (newValue){
            $scope.findArea(newValue);
        }else{
            $scope.areaList = [];
        }});


    $scope.findCity=function (provinceId) {
      baseService.sendGet("/user/findCity?provinceId="+provinceId)
          .then(function (response) {
              $scope.citiesList=response.data;
      });
    };

    $scope.findArea=function (cityId) {
      baseService.sendGet("/user/findArea?cityId="+cityId)
          .then(function (response) {
         $scope.areaList=response.data;
      });
    };

    /*保存用户表*/
    $scope.saveUserInfo = function () {
        baseService.sendPost("/user/updateUserInfo",$scope.user)
            .then(function (response) {
                    $scope.user = response.data;

            });
    };

    $scope.findUser=function () {
        baseService.sendGet("/user/findUser").then(function (response) {
            $scope.Entity=response.data;
        })
    }
});