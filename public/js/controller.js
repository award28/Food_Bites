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
    $scope.alert = "";

    $scope.clearSearch = function() {
        if($scope.recipes.length) {
            $scope.recipes = {}; 
            $scope.search = ""; 
            $scope.alert = "Search cleared! Look up more delicious food ;)";
            $timeout(function() {
                $scope.alert = '';
            }, 4000);
        }
    }

    $scope.getRecipes = function() {
        if($scope.search) {
            $scope.recipes = {};
            $scope.loading = true;
            $http.get('/getRecipes?recipe=' + $scope.search.toLowerCase().replace(/[^a-zA-Z ]/g, "").replace(/\s/g, '+')).success(function(response) {
                console.log(response);
                if(!response.length) {
                    $scope.alert = "We couldn't find anything :(";
                    $timeout(function() {
                        $scope.alert = '';
                    }, 4000);
                }
                else {
                    $scope.recipes = response;
                    console.log(response)
                }
            }).error( function(error, status) {
                $scope.recipes = {};
                $scope.alert = "Error: We couldn't find anything :(";
            }).finally( function() {
                $scope.loading = false;
                if($scope.recipes.length != undefined && $scope.recipes.length != 291) {
                    $scope.alert = $scope.recipes.length + " recipes found!";
                    $scope.alertClass = 'success';
                    $timeout(function() {
                        $scope.alertClass = '';
                        $scope.alert = "";
                    }, 4000);
                }
                else {
                    $scope.recipes = {};
                    $scope.alert = "We couldn't find anything :(";
                    $scope.alertClass = 'danger';
                    $timeout(function() {
                        $scope.alertClass = '';
                        $scope.alert = '';
                    }, 4000);
                }
            });
        }
        else {
            $scope.recipes = {};
            $scope.alert = "You can't search for nothing!";
            $timeout(function() {
                $scope.alertClass = '';
                $scope.alert = "";
            }, 4000);
        }
    }

    $scope.recipeLink = function(link) {
        $window.open(link, '_blank');
    }

    $scope.addToList = function(recipe) {
        var url = recipe.link.substring(27, recipe.link.length);
        var recipes = [];
        var onList = false;
        $scope.alert = "";
        recipe.hasStrike = false;
        recipe.hasStrikeColor = "warning";

        $http.get('/getIngredients?url=' + url).success( function(response) {
            $scope.loading = true;
            recipe.ingredients = response;

            recipe.childHasStrike = [];
            recipe.childHasStrikeColor = [];
            for(var i = 0; i < response.length; i++) {
            recipe.childHasStrike[i] = false;
            recipe.childHasStrikeColor[i] = "warning";
            }

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
                    $scope.alert = "You can't add the same recipe more than once.";
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
            $scope.loading = false;
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
        if($scope.list.length) {
            if($window.confirm("Are you sure you want to clear your shopping list?"))
                $window.localStorage.clear(); 
        }
    }

    $scope.deleteRecipe = function(ind) {
        if($window.confirm("Are you sure you want to delete this item from your shopping list?")){
            $scope.list.splice(ind, 1);
            $window.localStorage.setItem("list", JSON.stringify($scope.list));
        }
    }


    $scope.mainStrike = function(ind) {
        if($scope.list[ind].hasStrike) {
            $scope.list[ind].hasStrike = false;
            $scope.list[ind].hasStrikeColor = "warning";
            for(var i = 0; i < $scope.list[ind].childHasStrike.length; i++) {
                $scope.list[ind].childHasStrike[i] = false;
                $scope.list[ind].childHasStrikeColor[i] = "warning";
            }
        }
        else {
            $scope.list[ind].hasStrike = true;
            $scope.list[ind].hasStrikeColor = "success";
            for(var i = 0; i < $scope.list[ind].childHasStrike.length; i++) {
                $scope.list[ind].childHasStrike[i] = true;
                $scope.list[ind].childHasStrikeColor[i] = "success";
            }
        }
    }

    $scope.childStrike = function(parIndex, ind) {
        if($scope.list[parIndex].childHasStrike[ind]) {
            $scope.list[parIndex].childHasStrike[ind] = false;
            $scope.list[parIndex].childHasStrikeColor[ind] = "warning";
            $scope.list[parIndex].hasStrike = false;
            $scope.list[parIndex].hasStrikeColor = "warning";
        }
        else {
            $scope.list[parIndex].childHasStrike[ind] = true;
            $scope.list[parIndex].childHasStrikeColor[ind] = "success";
            var allStriked = true;
            for(var i = 0; i < $scope.list[parIndex].childHasStrike.length; i++) {
                if(!$scope.list[parIndex].childHasStrike[i])
                    allStriked = false;
            }
            if(allStriked) {
                $scope.list[parIndex].hasStrike = true;
                $scope.list[parIndex].hasStrikeColor = "success";
            }
        }
    }

    $scope.getList = function() {
        $scope.list = JSON.parse($window.localStorage.getItem("list")); 
    }
}]);
