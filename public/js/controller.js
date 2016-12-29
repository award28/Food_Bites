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
    $scope.message = "";

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
                if($scope.recipes.length != undefined) {
                $scope.alert = $scope.recipes.length + " recipes found!";
                $scope.alertClass = 'success';
                $timeout(function() {
                    $scope.alertClass = '';
                    $scope.alert = "";
                }, 4000);
                }
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
        var url = recipe.link.substring(27, recipe.link.length);
        var recipes = [];
        var onList = false;
        $scope.alert = "";
        recipe.hasStrike = false;
        
        $http.get('/getIngredients?url=' + url).success( function(response) {
            $scope.loading = true;
            recipe.ingredients = response;
            recipe.childHasStrike = [];
            for(var i = 0; i < response.length; i++)
                recipe.childHasStrike[i] = false;

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
        }).error( function(error, status) {
            $scope.recipes = {};
                $scope.alert = "We couldn't get the ingredients :(";
                $scope.alertClass = 'danger';
                $timeout(function() {
                    $scope.alertClass = '';
                    $scope.alert = "";
                }, 4000);
        }).finally( function() {
            $scope.loading = false;
        });
;
    }

    $scope.clearList = function() {
        if(!$scope.list.length) {
            if($window.confirm("Are you sure you want to clear your shopping list?"))
                $window.localStorage.clear(); 
        }
    }

    $scope.deleteRecipe = function(ind) {
        if($window.confirm("Are you sure you want to delete this item from your shopping list?")){
            $scope.list.splice(ind, 1);
            console.log($scope.list);
            $window.localStorage.setItem("list", JSON.stringify($scope.list));
        }
    }


    $scope.mainStrike = function(ind) {
        if($scope.list[ind].hasStrike) {
            $scope.list[ind].hasStrike = false;
            for(var i = 0; i < $scope.list[ind].childHasStrike.length; i++)
               $scope.list[ind].childHasStrike[i] = false;
        }
        else {
            $scope.list[ind].hasStrike = true;
            for(var i = 0; i < $scope.list[ind].childHasStrike.length; i++)
               $scope.list[ind].childHasStrike[i] = true;
        }
    }

    $scope.childStrike = function(parIndex, ind) {
        if($scope.list[parIndex].childHasStrike[ind]) {
            $scope.list[parIndex].childHasStrike[ind] = false;
            $scope.list[parIndex].hasStrike = false;
        }
        else {
            $scope.list[parIndex].childHasStrike[ind] = true;
            var allStriked = true;
            for(var i = 0; i < $scope.list[parIndex].childHasStrike.length; i++) {
                if(!$scope.list[parIndex].childHasStrike[i])
                    allStriked = false;
            }
            if(allStriked)
                $scope.list[parIndex].hasStrike = true;
        }
    }

    $scope.getList = function() {
        $scope.list = JSON.parse($window.localStorage.getItem("list")); 
    }
}]);
