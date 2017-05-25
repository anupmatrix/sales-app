'use strict';

angular.module('salesApp.repair', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/repair', {
    templateUrl: 'repair/repair.html',
    controller: 'RepairCtrl'
  });
}])

.controller('RepairCtrl', [function() {

}]);