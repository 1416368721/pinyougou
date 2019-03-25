// 商品详情控制器
app.controller('itemController', function ($scope, $http) {

    // 定义购买数量加减的方法
    $scope.addNum = function (x) {
        // ng-model : 绑定的变量都是字符串
        $scope.num = parseInt($scope.num);

        $scope.num += x;
        if ($scope.num < 1){
            $scope.num = 1;
        }
    };

    // 定义变量记录用户选择的规格选项
    // {"网络":"联通4G","机身内存":"64G"} 查找 SKU
    $scope.spec = {};

    // 用户选择规格选项
    $scope.selectedSpec = function (specName, optionName) {
        // 赋值
        $scope.spec[specName] = optionName;

        // 查询SKU
        $scope.searchSku();
    };
    // 根据用户选择的规格选项到 SKU数组中 查询 指定的SKU
    $scope.searchSku = function () {
        // 迭代SKU数组
        for (var i = 0; i < itemList.length; i++){
            // 取一个SKU
            var sku = itemList[i];
            // 判断是否为用户选中的SKU
            if (sku.spec == JSON.stringify($scope.spec)){
                $scope.sku = sku;
                break;
            }
        }
    };


    // 判断规格选项是否选中
    $scope.isSelected = function (specName, optionName) {
        // 取值
        return $scope.spec[specName] == optionName;
    };

    // 加载默认的SKU
    $scope.loadSku = function () {
        // 获取默认的SKU
        $scope.sku = itemList[0];

        // 选中默认的规格选项
        $scope.spec = JSON.parse($scope.sku.spec);
    };

    // 加入购物车按钮事件绑定
    $scope.addToCart = function () {

        // 发送跨域异步请求
        $http.get("http://cart.pinyougou.com/cart/addCart?itemId="
            + $scope.sku.id + "&num=" + $scope.num, {withCredentials : true})
            .then(function(response){
                // 获取响应数据
                if(response.data){
                    // 跳转到购物车系统
                    location.href = "http://cart.pinyougou.com";
                }else {
                    alert("加入购物车失败！");
                }
        });
    };


});