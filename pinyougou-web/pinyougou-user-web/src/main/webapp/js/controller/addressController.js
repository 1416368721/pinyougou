app.controller('addressController',function ($scope,$controller,baseService) {

    // $controller("baseController",{$scope : $scope});

    $scope.findAll = function () {
        baseService.sendGet("/address/findAll").then(function (response) {
                $scope.dataList = response.data;
        });
    };
});