// 购物车控制器
app.controller('cartController', function ($scope, $controller, baseService) {
    // 继承baseController
    $controller('baseController', {$scope:$scope});
    $scope.sellerName=[];
    $scope.ids=[];
    $scope.xMids=[];
    $scope.aDids=[];
    $scope.checkedArr=[];
    $scope.checkedArr2=[];
    $scope.check2=false;
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

    $scope.ckCart = [];
    // 商品选择
    $scope.updateSelection2=function ($event,id,i,cart) {
        // alert(sellerName);
        var sellerName=cart.sellerName;
        // alert(sellerName);
        // alert(cart.orderItems.length);
        if("小米"==sellerName) {
            // alert("小米");
            if ($event.target.checked) {
                $scope.xMids.push(id);
            } else {
                var idx = $scope.xMids.indexOf(id);
                $scope.xMids.splice(idx, 1);
            }
            // alert($scope.xMids);
            addArray();
            // alert($scope.ids);
            for (var b = 0; $scope.carts.length > b; b++) {
                var orderItems = $scope.carts[b].orderItems;
                // alert(orderItems);
                for (var c = 0; orderItems.length > c; c++) {
                    var orderItem = orderItems[c];
                    // alert("遍历："+orderItem.itemId);

                    for (var a = 0; $scope.ids.length > a; a++) {
                        // alert($scope.ids[a]);
                        if (orderItem.itemId == $scope.ids[a]) {
                            // alert(orderItems[c].itemId);
                            $scope.isSelectNum += orderItems[c].num;
                            $scope.isSelectMoney += orderItems[c].totalFee;

                        }
                    }
                }
            }
            // alert(cart.orderItems.length);
            $scope.ckCart[cart.sellerName]=cart.orderItems.length==$scope.xMids.length;


        }else if("品优购"==sellerName){
            if ($event.target.checked) {
                $scope.aDids.push(id);
            } else {
                var idx = $scope.aDids.indexOf(id);
                $scope.aDids.splice(idx, 1);
            }
            addArray();
            // alert($scope.ids);


            $scope.ckCart[cart.sellerName]=cart.orderItems.length==$scope.aDids.length;


        }
        // alert($scope.ckAll[0]);
           // alert($scope.ckAll);

        // alert("品优购:"+$scope.aDids);
    };

    $scope.checkAll = function($event,cart){
        if(cart.sellerName=="品优购") {
            // 清空用户选择的ids
            $scope.aDids = [];
            var orderItem = cart.orderItems;
             // alert("orderItem="+orderItem.length);
            // 循环当前页数据数组
            for (var i = 0; i < orderItem.length; i++) {
                // alert(i);
                // 初始化数组
                $scope.checkedArr[cart.sellerName+i] = $event.target.checked;
                // 判断是否选中
                if ($event.target.checked) {
                    // {id}
                    $scope.aDids.push(orderItem[i].itemId);
                    // alert($scope.aDids);
                    addArray();
                }else{
                    $scope.aDids=[];
                    addArray();
                }
            }
            // 重新赋值，再次绑定checkbox
            $scope.ckAll = $scope.orderItem.length == $scope.xMids.length;
        }else if(cart.sellerName=="小米"){
            // 清空用户选择的ids
            $scope.xMids = [];
            var orderItem = cart.orderItems;
            // alert(orderItem.length);
            // 循环当前页数据数组
            for (var i = 0; i < orderItem.length; i++) {
                // alert(i);
                // 初始化数组
                $scope.checkedArr[cart.sellerName+i] = $event.target.checked;
                // 判断是否选中
                if ($event.target.checked) {
                    // {id}
                    $scope.xMids.push(orderItem[i].itemId);
                    addArray();
                }else {
                    $scope.xMids=[];
                    addArray();
                }
            }
            // 重新赋值，再次绑定checkbox
            $scope.ckAll = $scope.orderItem.length == $scope.xMids.length;
        }
    };


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


    //将aDis和xMids数组整合到ids；
    function addArray() {
        $scope.ids=[];
        if ($scope.aDids!=null&&$scope.aDids.length>0) {
            for (var x = 0; $scope.aDids.length > x; x++) {
                $scope.ids.push($scope.aDids[x]);
            }
        }
        if ($scope.xMids!=null&&$scope.xMids.length>0) {
            for (var y = 0; $scope.xMids.length > y; y++) {
                $scope.ids.push($scope.xMids[y]);
            }
        }
        $scope.isSelectNum=0;
        $scope.isSelectMoney=0;
        for (var b = 0; $scope.carts.length > b; b++) {
            var orderItems = $scope.carts[b].orderItems;
            // alert(orderItems);
            for (var c = 0; orderItems.length > c; c++) {
                var orderItem = orderItems[c];
                // alert("遍历："+orderItem.itemId);
                for (var a = 0; $scope.ids.length > a; a++) {
                    // alert($scope.ids[a]);
                    if (orderItem.itemId == $scope.ids[a]) {
                        // alert(orderItems[c].itemId);
                        $scope.isSelectNum += orderItems[c].num;
                        $scope.isSelectMoney += orderItems[c].totalFee;
                    }
                }
            }
        }
    }

});
