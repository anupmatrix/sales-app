'use strict';
angular.module('salesApp.sales', ['ngRoute' , 'smart-table'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sales', {
    templateUrl: 'sales/sales.html',
    controller: 'SalesCtrl'
  });
}])
.controller('SalesCtrl', ['$scope', '$http' ,function($scope, $http) {
    $scope.customerDetails = {
      "id": "",
      "name": "",
      "address": "",
      "phone": ""
    };
    $scope.paymentInfo = {
      paymentMode: "cash",
      paymentModes: [{name: "Cash", value: "cash"},
                    {name: "Card Pyment", value: "card"},
                    {name: "Cheque", value: "cheq"}],
      cardTypes:["RuPay", "VISA", "MaeterCard", "American Express", "Chase", "Discover"],
      cash: {
        amount:0
      },
      card:{
        amount:0,
        bank:'',
        cardNumber:'',
        expDate:'',
        cardNetwork:'',
        cardBank:''
      },
      cheq:{
        amount:0,
        bank:'',
        chequeNo:'',
        chequeDate:''
      }
    };
    
    $scope.date = new Date();
    $scope.dateValue = null;
    $scope.asyncSelected = '';
    $scope.salesDate = new Date();
    $scope.dateOptions = {};
    $scope.selectedProducts = [];
    
    $scope.taxTypes = [
        {name: "VAT-1", value: "13.5"},
        {name: "VAT-2", value: "5.5"},
        {name: "VAT-3", value: "8.5"},
        {name: "Service Tax", value: "13.5"},
        {name: "NONE", value: "0"}
    ];
    
    var setInitialValuforTotals = function(){
        return {
            taxAmmount:0,
            totalPrice:0,
            grandTotal:0,
            totalItems:0
        }
    };
    
    var setCurrentProductBlank = function(){
        $scope.curentProduct = { name: "",  model: "",  sn: "",  quantity: "", price: "", totalPrice:0, taxType:0, taxValue:0, taxAmmount:0, grandTotal:0 };
        return $scope.curentProduct;
    };
    
    var calculateTotal = function(){
        var selProLen = $scope.selectedProducts.length;
        if(selProLen > 0){
            for(var i=0; i<selProLen; i++){
                $scope.productTotal.taxAmmount += $scope.selectedProducts[i].taxAmmount;
                $scope.productTotal.totalPrice += $scope.selectedProducts[i].totalPrice;
                $scope.productTotal.grandTotal += $scope.selectedProducts[i].grandTotal;
                $scope.productTotal.totalItems += $scope.selectedProducts[i].quantity;
            }
        }else{
            $scope.productTotal = setInitialValuforTotals();
        }
        
        $scope.paymentInfo.cash.amount = $scope.productTotal.grandTotal;
        $scope.paymentInfo.cheq.amount = $scope.productTotal.grandTotal;
        $scope.paymentInfo.card.amount = $scope.productTotal.grandTotal;
    };

    $scope.curentProduct = setCurrentProductBlank();
    $scope.productTotal = setInitialValuforTotals();
    
    var getItemScopeMappedValue = function(type){
        
        var returnVal = "";
        switch(type){
            case "NAME": 
               returnVal = $scope.curentProduct.name;
            break;
            case "MODEL": 
               returnVal = $scope.curentProduct.model;
            break;
            case "SN": 
               returnVal = $scope.curentProduct.sn;
            break;
            default:
                returnVal = "";            
        }
        return returnVal;
        
    };
    
    var getTaxValue = function(taxType){
            var taxValue = 0;
            for(var k in $scope.taxTypes){
                if($scope.taxTypes[k].name == taxType){
                      taxValue = $scope.taxTypes[k].value;
                }
            }
        return taxValue;
    }
    
    $scope.customerList = function(val) {
        
        //return $http.get('http://10.20.116.112:8080/vogellaRestImpl/rest/customer/serach-customer',{
        return $http.get('fixture/customer.json?text='+(Math.random()),{
          params: {
            text: val
          }
        }).then(function(response){
          return response.data.customerServiceResponseList.map(function(item){
             return item;
          });
        });
    };
    $scope.productList = function(val, type) {
        return $http.get('fixture/item-list.json?v='+Math.random(), {
        //return $http.get('http://10.20.116.112:8080/vogellaRestImpl/rest/product/search-product',{
          params: {
            text: val,
            type: type
          }
        }).then(function(response){
             return response.data.singleProductModelList.map(function(item){
             return item;
          });
        });
    };
      
    $scope.selectCustomerFrmList = function(value){
        $scope.customerDetails.name = value.name || '';
        $scope.customerDetails.id = value.id || null;
        $scope.customerDetails.phone = value.phone || '';
        $scope.customerDetails.address = value.address || '';
    }

    $scope.selectProductFrmList = function(value, type){
        $scope.curentProduct.id = value.id || null;
        $scope.curentProduct.name = value.name || '';
        $scope.curentProduct.model = value.model || '';
        $scope.curentProduct.sn = value.sn || '';
        $scope.curentProduct.price = value.price || null;
        $scope.curentProduct.taxType = value.taxType || '';
        $scope.curentProduct.taxRate = parseFloat(value.taxRate, 10) || 0;
        $scope.curentProduct.quantity = 1;
        setCurrentProductTax($scope.curentProduct.taxType);
    };
    
    var setCurrentProductTax = function(taxType){
        $scope.curentProduct.taxType =  taxType;
        $scope.curentProduct.taxValue = parseFloat(getTaxValue(taxType),10);
    };

    $scope.performSalesOperation = function(){
        var payInfoPayLoad = angular.copy($scope.paymentInfo[$scope.paymentInfo.paymentMode]);
            payInfoPayLoad.mode = $scope.paymentInfo.paymentMode;
        var payLoad = {
            paymentInfo:[payInfoPayLoad],
            customerInfo:angular.copy($scope.customerDetails),
            productInfo:angular.copy($scope.selectedProducts)
        };
        console.log(JSON.stringify(payLoad));
    };

    var salesAjaxCall = function(){
        $http({
            method : "POST",
            url : 'fixture/sales.json?v='+(Math.random())
        }).then(function mySuccess(response) {
            $scope.myWelcome = response.data;
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });        
        
    }
    
    $scope.onTaxChange = function(){
        setCurrentProductTax($scope.curentProduct.taxType);
    }

    $scope.addProduct = function(){
        
        $scope.curentProduct.quantity = parseInt($scope.curentProduct.quantity, 10);
        if(!isNaN($scope.curentProduct.quantity) && !isNaN($scope.curentProduct.price)){
            $scope.curentProduct.totalPrice = $scope.curentProduct.quantity * $scope.curentProduct.price;
        }
        if(!isNaN($scope.curentProduct.totalPrice) && !isNaN($scope.curentProduct.taxValue)){
            $scope.curentProduct.taxAmmount = ($scope.curentProduct.totalPrice * $scope.curentProduct.taxValue)/100;
        }
        if(!isNaN($scope.curentProduct.taxAmmount)){
            $scope.curentProduct.grandTotal = $scope.curentProduct.taxAmmount + $scope.curentProduct.totalPrice;
        }
        $scope.selectedProducts.push($scope.curentProduct);  
        setCurrentProductBlank();
        calculateTotal();
    }

    $scope.removeRow = function removeRow(row) {
        var index = $scope.selectedProducts.indexOf(row);
        if (index !== -1) {
            $scope.selectedProducts.splice(index, 1);
        }
        calculateTotal();
    }
    
    $scope.onPaymentTypeChnage = function(){
        
        
    }
    
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
}]);