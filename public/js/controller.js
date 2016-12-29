var app = angular.module("myApp", []);

app.controller('index', ['$scope', '$http', '$window', '$document', '$timeout', function($scope, $http, $window, $document, $timeout) {
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
                $scope.alert = $scope.recipes.length + " recipes found!";
                $scope.alertClass = 'success';
                $timeout(function() {
                    $scope.alertClass = '';
                    $scope.alert = "";
                }, 4000);
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

    $scope.alert = "";

    $scope.addToList = function(recipe) {
        var recipes = [];
        var onList = false;
        $scope.alert = "";

        if(JSON.parse($window.localStorage.getItem("list"))){
            var storageRecipes = JSON.parse($window.localStorage.getItem("list"));
            for(var i = 0; i < storageRecipes.length; i++)
            recipes.push(storageRecipes[i]);
        }
        if(storageRecipes != undefined) {
            for(var i = 0; i < storageRecipes.length; i++) {
                if(storageRecipes[i].title === recipe.title)
                    onList = true;
            }
            if(!onList) {
                recipes.push(recipe);
                $scope.alert = "Ingredients added to shopping list!";
                $scope.alertClass = 'success';
                $timeout(function() {
                    $scope.alertClass = '';
                    $scope.alert = "";
                }, 4000);
            }
            else {
                $scope.alert = "Bruh you can't add the same recipe twice -_-";
                $scope.alertClass = 'danger';
                $timeout(function() {
                    $scope.alertClass = '';
                    $scope.alert = "";
                }, 4000);
            }
        }
        else {
            recipes.push(recipe);
            $scope.alert = "Ingredients added to shopping list!";
            $scope.alertClass = 'success';
            $timeout(function() {
                $scope.alertClass = '';
                $scope.alert = "";
            }, 4000);
        }

        $window.localStorage.setItem("list", JSON.stringify(recipes));
    }

    $scope.clearList = function() {
        $window.localStorage.clear(); 
    }

    $scope.getList = function() {
        $scope.list = JSON.parse($window.localStorage.getItem("list")); 
    }
}]);
