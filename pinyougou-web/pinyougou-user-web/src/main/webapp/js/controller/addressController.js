app.controller('addressController', function ($scope, $controller, baseService) {

    // brandController中的$scope 需要 继承到baseController的$scope中的方法
    $controller("baseController", {$scope : $scope});

    /**  分页查询品牌 */
    $scope.search = function(page, rows){
        // 查询条件
        //alert(JSON.stringify($scope.searchEntity));
        // 发送异步请求
        baseService.findByPage("/user/findByPage", page, rows,
            $scope.searchEntity).then(function(response){
            // 获取响应数据 response.data: 后台响应数据
            // 分页指令：totalItems 记录数 100
            // 分页数据：List<Brand> 10条件数据 [{},{}]
            // {total : 100, rows : [{},{},{}]}
            // 获取分页数据
            $scope.dataList = response.data.rows;
            // 更新分页指令的总记录数
            $scope.paginationConf.totalItems = response.data.total;
        });
    };
});