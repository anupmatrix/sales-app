'use strict';

angular.module('salesApp.version.version-directive', [])

.directive('appVersion', [function() {
  return function(scope, elm, attrs) {
    elm.text("---DDDDDDDDDDDDD---");
  };
}])
.directive('singhVersion', [function() {
  return function(scope, elm, attrs) {
    elm.text("---SSSSSSSSSSS---");
  };
}])
