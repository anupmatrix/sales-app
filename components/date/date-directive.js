'use strict';
angular.module('salesApp.date.date-directive', ['ui.bootstrap'])
.directive('myDatepicker', [function() {
  return function(scope, element, attrs) {
  var controllerName = 'dateEditCtrl';
  return {
      restrict: 'A',
      require: '?ngModel',
      scope: true,
      replace:true,
      link: function(scope, element) {
          var wrapper = angular.element(
              '<div class="input-group">' +
                '<span class="input-group-btn">' +
                  '<button type="button" class="btn btn-default" ng-click="' + controllerName + '.openPopup($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
                '</span>' +
              '</div>');

          function setAttributeIfNotExists(name, value) {
              var oldValue = element.attr(name);
              if (!angular.isDefined(oldValue) || oldValue === false) {
                  element.attr(name, value);
              }
          }
          setAttributeIfNotExists('type', 'text');
          setAttributeIfNotExists('is-open', controllerName + '.popupOpen');
          setAttributeIfNotExists('datepicker-popup', 'dd.MM.yyyy');
          setAttributeIfNotExists('close-text', 'Schließen');
          setAttributeIfNotExists('clear-text', 'Löschen');
          setAttributeIfNotExists('current-text', 'Heute');
          element.addClass('form-control');
          element.removeAttr('my-datepicker');

          element.after(wrapper);
          wrapper.prepend(element);
          $compile(wrapper)(scope);

          scope.$on('$destroy', function () {
              wrapper.after(element);
              wrapper.remove();
          });
      },
      controller: function() {
          this.popupOpen = false;
          this.openPopup = function($event) {
              $event.preventDefault();
              $event.stopPropagation();
              this.popupOpen = true;
          };
      },
      controllerAs: controllerName
  };

  };
}])

.directive('dateFormat', [function() {
  return function(scope, element, attrs) {
  var controllerName = 'dateEditCtrl';
  return {
    require:'^ngModel',
    restrict:'A',
    link:function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        viewValue.toString = function() {
          return dateFilter(this, attrs.dateFormat);
        };
        return viewValue;
      });
    }
  };

  };
}])
.directive('customDatapicker', [function() {
  return function(scope, element, attrs) {
  var controllerName = 'dateEditCtrl';
  return {
        restrict: 'E',
        require: 'ngModel',
        templateUrl: function (elem, attrs) {
            return '/AngularJS/Directives/customDatapicker.html'
        },
        link: function (scope, element, attrs, ngModel) {
        $scope.inlineOptions = {
            showWeeks: true
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.open = function () {
            $scope.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.selected = {
            opened: false
        };
}}}}])
.directive('anupDatepicker', [function() {
  return function(scope, elm, attrs) {
    elm.text("---anupDatepicker anupDatepicker anupDatepicker---");
  };
}])

 .directive('singhDatepicker',function($compile,$timeout){
    return {
        replace:true,
        templateUrl:'custom-datepicker.html',
        scope: {
            ngModel: '=',
            dateOptions: '@',
            dateDisabled: '@',
            opened: '=',
            min: '@',
            max: '@',
            popup: '@',
            options: '@',
            name: '@',
            id: '@'
        },
        link: function($scope, $element, $attrs, $controller){

        }    
    };
})
.directive('typeahead', function($timeout,$http) {
  return {
    restrict: 'AEC',
    scope: {
      resturl: '@',
      title: '@',
      retkey: '@',
      displaykey:'@',
      modeldisplay:'=',
      subtitle: '@',
      modelret: '='
    },

    link: function(scope, elem, attrs) {
        scope.current = 0;
        scope.selected = false; 

        scope.da  = function(txt){
          scope.ajaxClass = 'loadImage';
         $http({
              method: 'GET',
              url: scope.resturl+'?custid='+txt
         }).then(function (success){
             scope.TypeAheadData = data;
             scope.ajaxClass = '';
         },function (error){

         });           

        }

      scope.handleSelection = function(key,val) {
        scope.modelret = key;
        scope.modeldisplay = val;
        scope.current = 0;
        scope.selected = true;
      }

      scope.isCurrent = function(index) {
        return scope.current == index;
      }

      scope.setCurrent = function(index) {
        scope.current = index;
      }

    },
    templateUrl: 'components/template/typeahead.html'
  };
})
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

;


