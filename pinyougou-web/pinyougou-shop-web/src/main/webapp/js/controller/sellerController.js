/** 定义控制器层 */
app.controller('seller2Controller', function ($scope, $controller, baseService) {

        /** 指定继承indexController */
        $controller('indexController', {$scope: $scope});


        /** 商家申请入驻 */
        $scope.saveOrUpdate = function () {
            /** 发送post请求 */
            baseService.sendPost("/seller/save", $scope.seller)
                .then(function (response) {
                    if (response.data) {
                        /** 跳转到登录页面 */
                        location.href = "/shoplogin.html";
                    } else {
                        alert("入驻失败！");
                    }
                });
        };

        $scope.getSellerId = function () {
            baseService.sendGet("/showLoginName").then(function (respones) {
                $scope.sellerId = respones.data.loginName;
            });
        };

        $scope.findDataBySeller = function () {



            alert($scope.sellerId);
            baseService.sendGet("/seller/findDataBySeller?sellerId=" + "admin").then(function (response) {
                $scope.seller = response.data;
            });
        };


        /** 查询条件对象 */
        $scope.searchEntity = {};
        /** 分页查询(查询条件) */
        $scope.search = function (page, rows) {
            baseService.findByPage("/seller/findByPage", page,
                rows, $scope.searchEntity)
                .then(function (response) {
                    /** 获取分页查询结果 */
                    $scope.dataList = response.data.rows;
                    /** 更新分页总记录数 */
                    $scope.paginationConf.totalItems = response.data.total;
                });
        };

        /** 显示修改 */
        $scope.show = function (entity) {
            /** 把json对象转化成一个新的json对象 */
            $scope.entity = JSON.parse(JSON.stringify(entity));
        };

        /** 批量删除 */
        $scope.delete = function () {
            if ($scope.ids.length > 0) {
                baseService.deleteById("/seller/delete", $scope.ids)
                    .then(function (response) {
                        if (response.data) {
                            /** 重新加载数据 */
                            $scope.reload();
                        } else {
                            alert("删除失败！");
                        }
                    });
            } else {
                alert("请选择要删除的记录！");
            }
        };
    }
)
;