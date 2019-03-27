app.controller('addressController',function ($scope,$controller,baseService) {
    $controller("baseController",{$scope : $scope});
    $scope.address={};


    $scope.findAll = function () {
        baseService.sendGet("/address/findAll").then(function (response) {
            $scope.dataList = response.data;
        });
    };

    $scope.findAllProvince = function () {
        baseService.sendGet("/address/findProvinces").then(function (response) {
            $scope.provincesList = response.data;
        });
    };
    $scope.$watch('address.provinceId',function (newValue,oldValue) {
        if (newValue){
            $scope.findCity(newValue);
        }else {
            $scope.cityieLsit = [];
        }
    });
    $scope.$watch('address.cityId',function (newValue,oldValue) {
        if (newValue){
            $scope.findArea(newValue);
        }else {
            $scope.areaList = [];
        }
    });
    $scope.delete = function () {
        // 判断用户是否选中了行
        if ($scope.ids.length > 0) {
            if (confirm("您确定要删除吗？")) {
                // 发送异步请求
                baseService.deleteById("/address/delete", $scope.ids)
                    .then(function (response) {
                        // 获取响应数据 true| false
                        if (response.data) {
                            // 重新加载数据
                            $scope.reload();
                            // 清空ids数组
                            $scope.ids = [];
                        } else {
                            alert("删除失败！");
                        }
                    });
            }
        } else {
            alert("亲，选择你要删除的地址！");
        }
    };

    $scope.reload = function () {
        $scope.findAll();
    }

});