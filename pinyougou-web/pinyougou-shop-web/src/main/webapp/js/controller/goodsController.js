/** 定义控制器层 */
app.controller('goodsController', function($scope, $controller, baseService){

    /** 指定继承baseController */
    $controller('baseController',{$scope:$scope});

    /** 添加商品 */
    $scope.saveOrUpdate = function(){
        // 获取富文本编辑器的内容
        $scope.entity.goodsDesc.introduction = editor.html();

        /** 发送post请求 */
        baseService.sendPost("/goods/save", $scope.entity)
            .then(function(response){
                if (response.data){
                    /** 清空表单数据 */
                   $scope.entity = {};
                   /** 清空富文本编辑器中的内容 */
                   editor.html("");
                }else{
                    alert("操作失败！");
                }
            });
    };


    // 图片上传
    $scope.upload = function () {
        // 文件异步上传
        baseService.uploadFile().then(function (response) {
            // 获取响应数据{status : 200|500, url : ''}
            if (response.data.status == 200){
                // 获取图片的请求地址
                // {"color":"","url":"http://image.pinyougou.com/jd/wKgMg1qtKEOATL9nAAFti6upbx4132.jpg"}
                $scope.picEntity.url = response.data.url;
            }else{
                alert("图片上传失败！");
            }
        });
    };

    // 定义数据存储结构
    //$scope.entity.goodsDesc.itemImages = [{},{}]
    $scope.entity = {goodsDesc : {itemImages : [], specificationItems : []}};
    /**
     * $scope.entity.goodsDesc.itemImages:
     * [{"color":"金色","url":"http://image.pinyougou.com/jd/wKgMg1qtKEOATL9nAAFti6upbx4132.jpg"},
     * {"color":"深空灰色","url":"http://image.pinyougou.com/jd/wKgMg1qtKHmAFxj7AAFZsBqChgk725.jpg"},
     * {"color":"银色","url":"http://image.pinyougou.com/jd/wKgMg1qtKJyAHQ9sAAFuOBobu-A759.jpg"}]
     */
    // 添加图片到数组
    $scope.addPic = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.picEntity);
    };

    // 从数组中删除图片
    $scope.removePic = function (idx) {
        $scope.entity.goodsDesc.itemImages.splice(idx,1);
    };

    // 根据父级id查询商品分类
    $scope.findItemCatByParentId = function (parentId, name) {
        baseService.sendGet("http://manager.pinyougou.com/itemCat/findItemCatByParentId?parentId="
            + parentId).then(function(response){
            // 获取响应数据 List<ItemCat> [{},{}]
            $scope[name] = response.data;
        });
    };


    // $scope.$watch(): 监控"entity.category1Id"发生改变，查询二级分类
    $scope.$watch("entity.category1Id", function (newVal, oldVal) {
        //alert(newVal + "==" + oldVal);
        if (newVal){ // 不是undefined、null
            // 发送异步请求查询二级分类
            $scope.findItemCatByParentId(newVal, 'itemCatList2');
        }else{
            $scope.itemCatList2 = [];
        }
    });

    // $scope.$watch(): 监控"entity.category2Id"发生改变，查询三级分类
    $scope.$watch("entity.category2Id", function (newVal, oldVal) {
        if (newVal){ // 不是undefined、null
            // 发送异步请求查询三级分类
            $scope.findItemCatByParentId(newVal, 'itemCatList3');
        }else{
            $scope.itemCatList3 = [];
        }
    });

    // $scope.$watch(): 监控"entity.category3Id"发生改变，得到类型模板id
    $scope.$watch("entity.category3Id", function (newVal, oldVal) {
        if (newVal){ // 不是undefined、null
            // 三级分类数组：$scope.itemCatList3
            for (var i = 0; i < $scope.itemCatList3.length; i++){
                /**
                 * {
                    "id": 1,
                    "name": "图书、音像、电子书刊",
                    "parentId": 0,
                    "typeId": 35
                    }
                 */
                var itemCat = $scope.itemCatList3[i];
                // 判断是否为用户选中的
                if (itemCat.id == newVal){
                    $scope.entity.typeTemplateId = itemCat.typeId;
                    return;
                }
            }
        }else{
            $scope.entity.typeTemplateId = null;
        }
    });


    // $scope.$watch(): 监控"entity.typeTemplateId"发生改变，查询类型模板对象
    $scope.$watch("entity.typeTemplateId", function (newVal, oldVal) {
        if (newVal){ // 不是undefined、null
            // 1. 发送异步请求 (查询类型模板对象)
            baseService.sendGet("/typeTemplate/findOne?id="
                + newVal).then(function(response){
                // 获取响应数据 TypeTemplate {}
                // 获取品牌数据 JSON数组字符串转化成JSON数组
                $scope.brandIds = JSON.parse(response.data.brandIds);

                // 获取扩展属性
                $scope.entity.goodsDesc.customAttributeItems =
                        JSON.parse(response.data.customAttributeItems);

            });


            // 2. 发送异步请求 (查询规格选项数据)
            baseService.sendGet("/typeTemplate/findSpecByTemplateId?id=" + newVal)
                .then(function(response){
                    // 获取响应数据
                    // [{"id":27,"text":"网络", options : [{},{}]},
                    //  {"id":32,"text":"机身内存",options:[{},{}]}]
                    $scope.specList = response.data;
            });
        }else{

        }
    });


    // 记录用户选中的规格选项
    $scope.updateSpecAttr = function ($event, specName, optionName) {
        /**
         * $scope.entity.goodsDesc.specificationItems:
         * [{"attributeValue":["联通4G","移动4G","电信4G"],"attributeName":"网络"},
         * {"attributeValue":["64G","128G"],"attributeName":"机身内存"}]
         */
        var obj = $scope.searchJson2Arr($scope.entity.goodsDesc.specificationItems, specName);
        // obj : {"attributeValue":["联通4G","移动4G","电信4G"],"attributeName":"网络"}
        if (obj){
            // 判断checkbox是否选中
            if ($event.target.checked){ // 选中

                obj.attributeValue.push(optionName);
            }else{ // 没选中
                // "attributeValue":["移动4G","联通3G","联通4G"]
                // 获取optionName在attributeValue数组中的索引号
                var idx = obj.attributeValue.indexOf(optionName);
                // 从attributeValue数组中删除元素
                obj.attributeValue.splice(idx, 1);

                // 判断attributeValue数组的长度
                if (obj.attributeValue.length == 0){
                    // $scope.entity.goodsDesc.specificationItems数组删除元素
                    var idx = $scope.entity.goodsDesc.specificationItems.indexOf(obj);
                    $scope.entity.goodsDesc.specificationItems.splice(idx, 1);
                }
            }
        }else{
            $scope.entity.goodsDesc.specificationItems
                .push({attributeValue:[optionName],attributeName:specName});
        }
    };

    // 从json数组中查询一个json对象
    $scope.searchJson2Arr = function (jsonArr, specName) {
        // jsonArr:
        /**[{"attributeValue":["联通4G","移动4G","电信4G"],"attributeName":"网络"},
        * {"attributeValue":["64G","128G"],"attributeName":"机身内存"}] */
        for (var i = 0; i < jsonArr.length; i++){
            // {"attributeValue":["联通4G","移动4G","电信4G"],"attributeName":"网络"}
            var obj = jsonArr[i];
            if (obj.attributeName == specName){
                return obj;
            }
        }
        return null;
    };


    // 生成SKU数组
    $scope.createItems = function ($event, specName, optionName) {

        // 用户选中的规格选项
        // $scope.entity.goodsDesc.specificationItems
        // [{"attributeValue":["移动4G","联通3G","联通4G"],"attributeName":"网络"},
        // {"attributeValue":["64G"],"attributeName":"机身内存"}]
        var specItems = $scope.entity.goodsDesc.specificationItems;

        if ($event.target.checked || specItems.length == 1) {
            // 定义SKU数组，并且初始化
            // spec: {"网络":"联通4G","机身内存":"32G"}
            $scope.entity.items = [{spec : {}, price : 0, num : 9999, status : '0', isDefault : '0'}];

            // 迭代用户选中的规格选项数组
            for (var i = 0; i < specItems.length; i++){ // 1
                // 获取一个数组元素
                // {"attributeValue":["移动4G","联通3G","联通4G"],"attributeName":"网络"}
                var obj = specItems[i];

                // 调用生成新的SKU数组的方法(对 $scope.entity.items数组扩充的方法)
                /**
                 * 循环第一次
                 * [{"spec":{"网络":"移动3G"},"price":0,"num":9999,"status":"0","isDefault":"0"},
                 * {"spec":{"网络":"移动4G"},"price":0,"num":9999,"status":"0","isDefault":"0"},
                 * {"spec":{"网络":"联通3G"},"price":0,"num":9999,"status":"0","isDefault":"0"}]
                 */
                $scope.entity.items = $scope.swapItems($scope.entity.items,
                    obj.attributeValue, obj.attributeName);
            }
        }else{
            for (var i = 0; i <  $scope.entity.items.length; i++){
                if ($scope.entity.items[i].spec[specName] == optionName){
                    var idx = $scope.entity.items.indexOf( $scope.entity.items[i]);
                    $scope.entity.items.splice(idx, 1);
                }
            }
        }
    };

    // 对$scope.entity.items数组扩充的方法
    $scope.swapItems = function (items, attributeValue, attributeName) {
        // items : [{spec : {}, price : 0, num : 9999, status : '0', isDefault : '0'}]
        // attributeValue: ["移动4G","联通3G","联通4G"]
        // attributeName: 网络
        var newItems = new Array();

        // 迭代原来的SKU数组
        for (var i = 0; i < items.length; i++){
            // 取一个SKU
            // {spec : {}, price : 0, num : 9999, status : '0', isDefault : '0'}
            var item = items[i];
            // 迭代规格选项数组 ["移动4G","联通3G","联通4G"]
            for (var j = 0; j < attributeValue.length; j++){ // "attributeValue":["64G"]
                // 通过原来的SKU产生三个
                var newItem = JSON.parse(JSON.stringify(item));
                // spec: {"网络":"联通4G","机身内存":"32G"}
                newItem.spec[attributeName] = attributeValue[j];
                // 添加到新的SKU数组
                newItems.push(newItem);
            }
        }
        return newItems;

    };

    /** 查询条件对象 */
    $scope.searchEntity = {};
    /** 分页查询(查询条件) */
    $scope.search = function(page, rows){
        baseService.findByPage("/goods/findByPage", page,
			rows, $scope.searchEntity)
            .then(function(response){
                /** 获取分页查询结果 */
                $scope.dataList = response.data.rows;
                /** 更新分页总记录数 */
                $scope.paginationConf.totalItems = response.data.total;
            });
    };

    // 定义审核状态提示文本数组
    $scope.status =['未审核','已审核','审核不通过','关闭'];


    /** 商品上下架 */
    $scope.updateMarketable = function(status){
        if ($scope.ids.length > 0){
            baseService.sendGet("/goods/updateMarketable?ids="
                + $scope.ids + "&status=" + status)
                .then(function(response){
                    if (response.data){
                        /** 重新加载数据 */
                        $scope.reload();
                        // 清空ids数组
                        $scope.ids = [];
                    }else{
                        alert("上下架失败！");
                    }
                });
        }else{
            alert("请选择要上下架的商品！");
        }
    };
});