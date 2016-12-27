var app = angular.module("myApp", []);

app.controller('notes', ['$scope', '$http', '$window', function($scope, $http, $window) {  

    $scope.getIng = function() {
        $http.get('/notebook').success(function(response) {
            $window.alert(response);
        }).error(function(error, status) {
            $window.alert(error);
        });
    }

    $scope.clickMe = function() {
        $http.post('/notebook', $scope.note).success(function(response) {
            $scope.note = "";
            $scope.ingredients = response;
        }).error(function(error, status) {
            $window.alert(error);
        });
    }
    
}]);

