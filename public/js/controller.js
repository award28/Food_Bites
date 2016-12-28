var app = angular.module("myApp", []);

app.controller('index', ['$scope', '$http', '$window', '$document', function($scope, $http, $window, $document) {
    $scope.$watch('search', function(search) {
        if(search != undefined && search != "") 
            $scope.searchBg={"background": "#fe5f55"}
        
        else 
            $scope.searchBg={}
    });

    $scope.all = {}; 

    $scope.getRecipes = function() {
        $http.get('http://localhost:5000/getRecipes?recipe=' + $scope.search).success(function(response) {
            $scope.all.recipes = response.recipes;
            $scope.all.titles = response.titles;
            $scope.all.images = response.images;
        }).error( function(error, status) {
            $window.alert(status);
            $window.alert("error");
        });
    }
}]);
