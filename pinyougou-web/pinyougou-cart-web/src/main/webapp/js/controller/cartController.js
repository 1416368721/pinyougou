// 购物车控制器
app.controller('cartController', function ($scope, $controller, baseService) {
    // 继承baseController
    $controller('baseController', {$scope:$scope});
    $scope.ids=[];
    $scope.xids=[];
    $scope.aids=[];
    $scope.all=false;
    $scope.sellerIds=[];
    $scope.all2={};
    $scope.all3={};
    $scope.newCarts={};
    $scope.orderItem2={};
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
    //最上面的全选框

    $scope.checkAll=function ($event) {
        newCart();
        if($event.target.checked){
      for (var a=0;$scope.carts.length>a;a++) {

           $scope.all2[a] = true;
           $scope.sellerIds.push($scope.carts[a].sellerName);
          var seller =$scope.carts[a].sellerName;
           // alert("卖家名字"+seller);
          for(var d=0;$scope.newCarts[seller].length>d;d++){
              $scope.all3[seller+d]=true;
              }
              // $scope[seller].push($scope.newCarts[seller].itemId);
          }
          // alert($scope.all2[a])
      // alert($scope[seller]);
            allids();
      // alert("xiaomi="+$scope.xiaomi);
      // alert("admin="+$scope.admin);
      // alert("ids="+$scope.ids);
      //
      }else {
            for (var b=0;$scope.carts.length>b;b++){
                $scope.all2[b]='';
                var seller=$scope.carts[b].sellerName;
                for(var e=0;$scope.newCarts[seller].length>e;e++){
                    $scope.all3[seller+e]='';
                }
            }
            $scope.sellerIds=[];
            $scope.ids=[];
        }
        // alert($scope.sellerIds);
        // alert("xiaomi="+$scope.xiaomi);
        // alert("admin="+$scope.admin);
        // alert("ids="+$scope.ids);
        addArray();
    };
    //商家全选
    $scope.checkAll2=function ($event,cart,i) {
      if($event.target.checked){
          for(var c=0; cart.orderItems.length>c;c++){
              $scope.all3[cart.sellerName+c]=true;
              // alert(cart.orderItems[c].itemId);
              $scope.ids.push(cart.orderItems[c].itemId);
              // alert("选中:"+$scope.ids);
          }
              $scope.sellerIds.push(cart.sellerName)
      }else {
          for (var f=0;cart.orderItems.length>f;f++){
              $scope.all3[cart.sellerName+f]='';
              // alert("要删除："+cart.orderItems[f].itemId);
              var idz=$scope.ids.indexOf(cart.orderItems[f].itemId);
              $scope.ids.splice(idz,1);

          }
              // alert("删除后ids:"+$scope.ids);
            var idx=$scope.sellerIds.indexOf(cart.sellerName);
            $scope.sellerIds.splice(idx,1);
            // alert(cart.sellerId);
             $scope[cart.sellerId]=[];
        // alert("xiaomi="+$scope.xiaomi);
        // alert("admin="+$scope.admin);
      }
        addArray();
       // alert($scope.sellerIds.length);
      $scope.all=$scope.length==$scope.sellerIds.length;
    };
    //商品选择
    $scope.checkAll3=function ($event, id, i, sellerId,cart) {
      if($event.target.checked){
         // $scope[sellerId]商家变量用户车;
         $scope[sellerId].push(id);
         // alert($scope[sellerId]);
         // 将id加入到ids；
          $scope.ids.push(id);
           // alert("选中="+$scope[sellerId]);
          if($scope[sellerId].length==cart.orderItems.length){
          //    商家选择购物车id与总购物车该商家id个数相同
          //     alert(sellerId+"相等");
          //    将商家名加入sellerIds数组中;
              $scope.sellerIds.push(sellerId);

          }
      }else{
           var idx=$scope[sellerId].indexOf(id);
           $scope[sellerId].splice(idx,1);
           var idx2=$scope.sellerIds.indexOf(cart.sellerName);
           $scope.sellerIds.splice(idx2,1);
          // alert($scope.sellerIds)
      //    删除ids中的id
          var idx3=$scope.ids.indexOf(id);
          $scope.ids.splice(idx,1);
      }

        for(var z=0;$scope.carts.length>z;z++){
            if($scope.carts[z].sellerId==sellerId) {
                $scope.all2[z] = $scope[sellerId].length == $scope.orderItem2[sellerId];
            }
      //       if($scope.all2[z]){
      //           $scope.sellerIds.push($scope.carts[z].sellerName)
      //       }
       }
      addArray();
        $scope.all=$scope.length==$scope.sellerIds.length;

    };

    //重新封装购物车数据
      function newCart(){
          // alert("haha");
        for(var x=0;$scope.carts.length>x;x++){
           var cart=$scope.carts[x];
           $scope.length=$scope.carts.length;
           // alert($scope.length);
           // 购物车数组长度
            for(var y=0;cart.orderItems.length>y;y++){
                var orderItem=cart.orderItems[y];
                $scope.orderItem2[orderItem.sellerId]=y+1;
                $scope[orderItem.sellerId]=[];
                 // alert("1"+$scope.admin);
                // alert("2"+$scope.xiaomi);
            }
           $scope.newCarts[cart.sellerName]=cart.orderItems;
        }
    };

    //购物车全部数据重新封装
    function allids () {
      for(var k=0;$scope.carts.length>k;k++){
          var orderItems =$scope.carts[k].orderItems;
          for(var j=0;orderItems.length>j;j++){
              var orderItem=orderItems[j];
              var sellerId=orderItem.sellerId;
              // alert("213"+sellerId);
              $scope[sellerId].push(orderItem.itemId);
              // alert("admin"+$scope.admin);
              $scope.ids.push(orderItem.itemId);
              // alert("ids"+$scope.ids);
          }
      }
    }

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

    //将多个数组整合到ids；
    function addArray() {
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
