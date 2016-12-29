var app = angular.module("myApp", []);

app.controller('index', ['$scope', '$http', '$window', '$document', function($scope, $http, $window, $document) {
    $scope.$watch('search', function(search) {
        if(search != undefined && search != "") 
            $scope.searchBg={"background": "#fe5f55"}
        
        else 
            $scope.searchBg={}
    });

    $scope.recipes = {}; 
    $scope.loading = false;
    $scope.message = "You Haven't searched for anything yet!";

    $scope.clearSearch = function() {
        if($scope.recipes.length) {
            $scope.recipes = {}; 
            $scope.message = "Search cleared! Look up more delicious food ;)";
        }
        else 
            $scope.message = "You can't clear nothing -_-";
    }

    $scope.getRecipes = function() {
        if($scope.search) {
            $scope.recipes = {};
            $scope.loading = true;
            $http.get('/getRecipes?recipe=' + $scope.search.toLowerCase().replace(/[^a-zA-Z ]/g, "").replace(/\s/g, '+')).success(function(response) {
                if(!response.length) {
                    $scope.message = "We couldn't find anything :(";
                }
                else {
                    $scope.recipes = response;
                    console.log(response);
                }
        }).error( function(error, status) {
            $scope.recipes = {};
            $scope.message = "Error: We couldn't find anything :(";
        }).finally( function() {
            $scope.loading = false;
        });
        }
        else {
            $scope.recipes = {};
            $scope.message = "You can't search for nothing -_-";
        }
    }

    $scope.recipeLink = function(link) {
        $window.location.href = link;
    }
    $scope.addToList = function() {
        $window.alert("Added ingredients to shopping list!");
    }
}]);
