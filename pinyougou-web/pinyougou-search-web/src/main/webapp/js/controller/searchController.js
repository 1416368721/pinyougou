/** 定义搜索控制器 */
app.controller("searchController" ,function ($scope, $sce, $location, baseService) {

    // 定义json对象封装搜索条件
    $scope.searchParam = {keywords : '', category : '',
        brand : '', spec : {}, price : '', page : 1, rows : 10,
        sortField : '', sortValue : ''};

    // 商品搜索的方法
    $scope.search = function () {
        // 发送异步请求
        baseService.sendPost("/Search", $scope.searchParam).then(function(response){
            // 获取响应数据 response.data: {total: 100, rows:[{},{}]} rows:List<SolrItem>
            $scope.resultMap = response.data;
            // 定义中间变量
            $scope.keyword = $scope.searchParam.keywords;

            // 调用初始化页码的方法
            $scope.initPageNums();
        });
    };

    // 定义初始化页码的方法
    $scope.initPageNums = function () {
        // 页码数组
        $scope.pageNums = [];

        // 开始页码
        var firstPage = 1;
        // 结束页码
        var lastPage = $scope.resultMap.totalPages;

        // 前面加点
        $scope.firstDot = true;
        // 后面加点
        $scope.lastDot = true;

        // 判断总页数是不是大于5
        if ($scope.resultMap.totalPages > 5){

            // 当前页码靠首页近些
            if ($scope.searchParam.page <= 3){
                lastPage = 5;
                $scope.firstDot = false;
            }else if($scope.searchParam.page >= $scope.resultMap.totalPages - 3){
                // 当前页码靠尾页近些
                firstPage = $scope.resultMap.totalPages - 4;
                $scope.lastDot = false;
            }else{
                // 在中间
                firstPage = $scope.searchParam.page - 2;
                lastPage = $scope.searchParam.page + 2;
            }
        }else{
            // 前面加点
            $scope.firstDot = false;
            // 后面加点
            $scope.lastDot = false;
        }

        for (var i = firstPage; i <= lastPage; i++){
            $scope.pageNums.push(i);
        }

    };


    /** 把html格式的字符串，转化成html标签 */
    $scope.trustHtml = function (htmlStr) {
        return $sce.trustAsHtml(htmlStr);
    };

    // 添加过滤条件
    $scope.addSearchItem = function (key, value) {
        // 判断key是否为 商品分类、品牌、价格区间
        if (key == 'category' || key == 'brand' || key == 'price'){
            $scope.searchParam[key] = value;
        }else {
            // 规格选项
            $scope.searchParam.spec[key] = value;
        }

        // 执行搜索
        $scope.search();
    };

    // 减少过滤条件
    $scope.removeSearchItem = function (key) {
        // 判断key是否为 商品分类、品牌、价格区间
        if (key == 'category' || key == 'brand' || key == 'price'){
            $scope.searchParam[key] = "";
        }else {
            // 规格选项
            delete $scope.searchParam.spec[key];
        }

        // 执行搜索
        $scope.search();
    };

    // 分页搜索
    $scope.pageSearch = function (page) {

        page = parseInt(page);

        // 判断页码的有效性
        if (page >= 1 && page <= $scope.resultMap.totalPages
            && page != $scope.searchParam.page){
            $scope.searchParam.page = page;
            $scope.jumpPage = page;
            // 执行搜索
            $scope.search();
        }
    };

    // 排序搜索
    $scope.sortSearch = function (key,value) {
        $scope.searchParam.sortField = key;
        $scope.searchParam.sortValue = value;
        // 执行搜索
        $scope.search();
    };


    // http://search.pinyougou.com/?keywords=小米
    // 获取首页传过来的请求参数
    $scope.getKeywords = function () {

        // ?keywords=小米
        //alert(location.search);
        // 获取请求URL后面的参数，得到JSON对象 {keywords : '小米'}
        //var json = $location.search();
        //alert(JSON.stringify(json));

        // 获取keywords
        $scope.searchParam.keywords = $location.search().keywords;
        // 执行搜索
        $scope.search();
    };

    //添加收藏
    $scope.saveCollect = function (item) {
        baseService.sendPost("/collect/saveCollect",item).then(function (response) {
            if (response.data){
                alert("添加成功")
            }else {
                alert("添加失败")
            }
        })
    }

   
});
