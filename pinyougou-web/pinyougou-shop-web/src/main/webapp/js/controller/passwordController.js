app.controller('passwordController' ,function($scope, $controller, baseService){
    /** 指定继承baseController */
    $controller('indexController2',{$scope:$scope});
    $scope.entity={oldPassword:'',newPassword:''};
    // alert($scope.loginName);
    $scope.findPassword=function () {
        baseService.sendGet("/password/findPassword")
            .then(function (response) {
            $scope.password=response.data.password;
            $scope.username=response.data.username;
            // alert($scope.username);
        })
    };
   $scope.changePassword=function (pwd) {
        if($scope.password==$scope.entity.oldPassword){
        // alert("确认"+pwd);
        // alert("新："+$scope.entity.newPassword)
            if($scope.entity.newPassword==pwd&&pwd!=null){
                baseService.sendPost("/password/changePassword?username="+$scope.username
                    ,$scope.entity).then(function (response) {
                    if(response.data){
                        location.href="http://shop.pinyougou.com/shoplogin.html";
                    }else{
                        alert("修改失败");
                    }
                })
            }else{
                alert("两次密码不一样");
            }
        }else{
            alert("原密码不正确");
        }
   }
});