// 购物车控制器
app.controller('cartController', function ($scope, $controller, baseService) {
    // 继承baseController
    $controller('baseController', {$scope:$scope});
    $scope.sellerName=[];
    $scope.ids=[];
    $scope.checkedArr=[];
    $scope.checkedArr2=[];
    $scope.ckAll=false;
    $scope.findIdsCart=function () {
        baseService.sendGet("/cart/findIdsCart")
            .then(function (response) {
                $scope.idsCarts = response.data;
                // 定义json对象封装统计的结果
                $scope.totalEntity = {totalNum : 0, totalMoney : 0};
                // 循环用户的购物车数组
                for (var i = 0; i < $scope.idsCarts.length; i++){
                    // 获取数组中的元素(一个商家的购物车)
                    var idsCart = $scope.idsCarts[i];
                    // 循环该商家的购物车数组
                    for (var j = 0; j < idsCart.orderItems.length; j++){
                        // 获取一个商品
                        var orderItem = idsCart.orderItems[j];
                        // 统计购买总数量
                        $scope.totalEntity.totalNum += orderItem.num;
                        // 统计购买总金额
                        $scope.totalEntity.totalMoney += orderItem.totalFee;
                    }
                }
            });
    };
    //商家处选择框
    $scope.updateSelection=function ($event,id,i) {
        if($event.target.checked){
            $scope.sellerName.push(id);
        }else{
            var idx=$scope.sellerName.indexOf(id);
            $scope.sellerName.splice(idx,1);
        }
        // alert($scope.ids);
        $scope.checkedArr[i]=$event.target.checked;
        $scope.ckAll=$scope.carts.length==$scope.sellerName.length;
        // alert($scope.sellerName);
    };
    //最大的全选
    $scope.checkAll=function ($event) {
        $scope.sellerName=[];
        // alert($scope.carts);
        for(var i=0;i<$scope.carts.length;i++){
            $scope.checkedArr[i]=$event.target.checked;
            if($event.target.checked){
                $scope.sellerName.push($scope.carts[i].sellerName);
                // var orderItems=$scope.carts[i];
                // for(var j=0;j<orderItems.length;j++){
                //     $scope.ids.push(orderItems[j].itemId)
                // }
                // $scope.checkedArr=
            }
        }

        $scope.ckAll=$scope.carts.length==$scope.ids.length;
    };
    //商品选择
    $scope.updateSelection2=function ($event,id,i,sellerName) {
        // alert(sellerName);
        $scope.isSelectNum=0;
        $scope.isSelectMoney=0;
        if ($event.target.checked) {
            $scope.ids.push(id);
        } else {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
        }
        // alert($scope.ids);
        for (var b = 0; $scope.carts.length > b;b++) {
            var orderItems = $scope.carts[b].orderItems;
            // alert(orderItems);
            for (var c = 0; orderItems.length > c; c++) {
                var orderItem=orderItems[c];
                // alert("遍历："+orderItem.itemId);
                for (var a = 0; $scope.ids.length > a; a++) {
                    // alert($scope.ids[a]);
                    if (orderItem.itemId == $scope.ids[a]){
                        // alert(orderItems[c].itemId);
                        $scope.isSelectNum += orderItems[c].num;
                        $scope.isSelectMoney += orderItems[c].totalFee;
                    }
                }
            }
        }
    };
        // alert($scope.ids);
        // $scope.checkedArr[i]=$event.target.checked;
        // $scope.ckAll=$scope.carts.length==$scope.sellerName.length;
        // alert($scope.sellerName);
    //    通过商家名来获取
    //     for(var i=0;$scope.carts.length>i;i++){
    //         if($scope.carts[i].sellerName==sellerName){
    //         // alert($scope.carts[i].sellerName);
    //             $scope.checkedArr[i]=$event.target.checked;



    //更新页面上选择商品数量和金额
    // 查询用户的购物车
    $scope.findCart = function () {
        baseService.sendGet("/cart/findCart").then(function(response){
            // 获取响应数据
            $scope.carts = response.data;

            // 定义json对象封装统计的结果
            $scope.totalEntity = {totalNum : 0, totalMoney : 0};

            // 循环用户的购物车数组
            for (var i = 0; i < $scope.carts.length; i++){
                // 获取数组中的元素(一个商家的购物车)
                var cart = $scope.carts[i];
                // 循环该商家的购物车数组
                for (var j = 0; j < cart.orderItems.length; j++){
                    // 获取一个商品
                    var orderItem = cart.orderItems[j];

                    // 统计购买总数量
                    $scope.totalEntity.totalNum += orderItem.num;
                    // 统计购买总金额
                    $scope.totalEntity.totalMoney += orderItem.totalFee;
                }
            }
        });
    };
    // 购买数量增减与删除
    $scope.addCart = function (itemId, num) {
        baseService.sendGet("/cart/addCart?itemId="
            + itemId + "&num=" + num).then(function(response){
            // 获取响应数据
            if (response.data){
                // 重新加载购物车数据
                $scope.findCart();
            }
        });
    };

    //通过id添加商品
    $scope.addGoodsbyIds=function (ids) {
        // alert(ids);
            if ($scope.loginName==null) {
                location.href = "http://sso.pinyougou.com/login?service=" + $scope.redirectUrl
            }else {
                if (ids.length > 0) {
                    baseService.sendGet("/cart/addGoodsbyIds?ids=" + $scope.ids)
                        .then(function (response) {
                            if (response.data) {
                                // alert("success");
                                location.href="http://cart.pinyougou.com/order/getOrderInfo.html";
                            } else {
                                alert("fail");
                            }
                        });
                } else {
                    alert("请先勾选商品");
                }
            }



    }

});
