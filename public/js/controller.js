var app = angular.module("myApp", []);

app.controller('index', ['$scope', '$http', '$window', '$document', function($scope, $http, $window, $document) {
    $scope.$watch('search', function(search) {
        if(search != undefined && search != "") 
            $scope.searchBg={"background": "#fe5f55"}
        
        else 
            $scope.searchBg={}
    });
}]);

