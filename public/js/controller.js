var app = angular.module("myApp", []);

app.controller('index', ['$scope', '$http', '$window', '$document', function($scope, $http, $window, $document) {
    $scope.$watch('search', function(search) {
        if(search != undefined && search != "") 
            $scope.searchBg={"background": "#fe5f55"}
        
        else 
            $scope.searchBg={}
    });

    $scope.getRecipes = function() {
        $http.get('http://localhost:3020?recipe=' + $scope.search).success(function(response) {
            $window.alert(response);
        }).error( function(error, status) {
            $window.alert("error");
        });
    }
}]);
