'use strict';

// Declare app level module which depends on views, and components
angular.module('salesApp', [
  'ngRoute',
  'salesApp.view1',
  'salesApp.view2',
  'salesApp.sales',
  'salesApp.repair',
  'salesApp.report',
  'salesApp.version',
  'salesApp.date',
  'ui.bootstrap',
  'smart-table'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/sales'});
}]);
