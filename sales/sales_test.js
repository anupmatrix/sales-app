'use strict';

describe('salesApp.sales module', function() {

  beforeEach(module('salesApp.sales'));

  describe('sales controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var salesCtrl = $controller('SalesCtrl');
      expect(salesCtrl).toBeDefined();
    }));

  });
});