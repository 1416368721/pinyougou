app.controller('addressController',function ($scope,$controller,baseService) {
    $controller("baseController",{$scope : $scope});

    $scope.address={};


    $scope.findAll = function () {
        baseService.sendGet("/address/findAll").then(function (response) {
            $scope.dataList = response.data;
        });
    };


    /** 到底是怎么触发这个事件的 这个没有任何的问题呀  */
    /** 查询所有省份 不需要任何参数触发 */
    $scope.findAllProvinces = function () {
        baseService.sendGet("/address/findProvinces").then(function (response) {
            $scope.provincesList = response.data;
        });
    };
    /** 为什么起那么诡异的名字，是因为address表里面有个address字段名 正解？还是误解？？*/
    $scope.address.address={};

    /** 监听器 当 provinceId的值发生改变的时候，等价于province（s省份发生改变的时候！！） 对唔住我是差人*/
    $scope.$watch('address.provinceId',function (newValue,oldValue) {
        if (newValue){
            $scope.findCity(newValue);
        }else {
            $scope.citiesList = [];
        }
    });
    /** 查找对应省份下面的城市列表 （需要的参数 provinceId 省份的ID）*/
    $scope.findCity=function (provinceId) {
        baseService.sendGet("/address/findCity?provinceId="+provinceId).then(function (response) {
            $scope.citiesList = response.data;
        })
    };

    /** 监听器 同上上*/
    /**  这里跟ng-model一样 */
    $scope.$watch('address.cityId',function (newValue,oldValue) {
        if (newValue){
            $scope.findArea(newValue);
        }else {
            $scope.areaList = [];
        }
    });

    /** 寻找对应的第三级别 */
    $scope.findArea = function (cityId) {
        baseService.sendGet("/address/findArea?cityId="+cityId).then(function (response) {
            $scope.areaList=response.data;
        })
    }


    /***************/
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