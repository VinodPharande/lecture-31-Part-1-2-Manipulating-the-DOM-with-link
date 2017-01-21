(function(){
  'use strict';

  angular.module('ShoppingListDirectiveApp', [])
  .controller('ShoppingListController', ShoppingListController)
  .factory('ShoppingListFactory', ShoppingListFactory)
  .directive('shoppingList', ShoppingListDirective);


  function ShoppingListDirective() {
    var ddo = {
       templateUrl: 'shoppingList.html',
       scope:{                                // isolate scope for ShoppingListDirective
         items:'<',
         myTitle: '@title',
         onRemove: '&'         // '&' binding allows us to execute an expression (such a function value) in the context of the parent scope.
        //  Property name to reference parent method in directive
        // Attribute name to use in parent template on this directive
       },
       controller: ShoppingListDirectiveController,
       controllerAs: 'list',
       bindToController: true,
       link: ShoppingListDirectiveLink
    };
    return ddo;
  }

  function ShoppingListDirectiveLink(scope, element, attrs, controller) {
      console.log("Link scope is: ", scope);
      console.log("Controller instance is: ", controller);
      console.log("Element is: ", element);

      scope.$watch('list.cookiesInList()', function (newValue, oldValue) {
        console.log("Old value: ", oldValue);
        console.log("Old value: ", newValue);

        if (newValue === true) {
          displayCookieWarning();
        }
        else {
          removeCookieWarning();
        }
      });

      function displayCookieWarning() {
          // Using Angular jqLite
          // var warningElem = element.find("div");
          // warningElem.css('display', 'block');

          // If jQuery included before Angular
          var warningElem = element.find("div.error");
          warningElem.slideDown(900);
      }

      function removeCookieWarning() {
          // Using Angular jqLite
          // var warningElem = element.find("div");
          // warningElem.css('display', 'none');

          // If jQuery included before Angular
          var warningElem = element.find("div.error");
          warningElem.slideUp(900);
      }
  }

  // controller function for directive which is decalred in ShoppingListDirective
  function ShoppingListDirectiveController() {
    var list = this;

    list.cookiesInList = function () {
      for (var i = 0; i < list.items.length; i++) {
        var name = list.items[i].name;
        if (name.toLowerCase().indexOf("cookie") !== -1) {
          return true;
        }
      }
      return false;
    }
  }

  // LIST #1 - controller: unlimited items
  ShoppingListController.$inject = ['ShoppingListFactory'];
  function ShoppingListController(ShoppingListFactory) {
    var list = this;

    // use factory to create new shopping list service
    var shoppingList = ShoppingListFactory();
    list.items = shoppingList.getItems();
    var origTile = "Title: Shopping List #1";
    list.title = origTile + " (" + list.items.length + " items)";

    list.itemName = "";
    list.quantity = "";
    // consuming call to service to add item method
    list.addItem = function () {
      shoppingList.addItem(list.itemName, list.quantity);
      list.title = origTile + " (" + list.items.length + " items)";
    }
    // consuming call to service to remove item method
    list.removeItem = function (itemIndex) {                                  // argument 'itemIndex' needs to come from child directive
      console.log("'this' is: ", this);
      this.lastRemoved = "Last item removed was " + this.items[itemIndex].name;
      shoppingList.removeItem(itemIndex);
      this.title = origTile + " (" + list.items.length + " items)";           // 'this' refers to parent controller instance
    }
  }

  // Service implementation
  // If not specified, maxItems assumed unlimited
  function ShoppingListService(maxItems) {
      var service = this;

      // List of shopping items
      var items = [];

      // Servie method for adding item
      service.addItem = function (itemName, quantity) {
        if ((maxItems === undefined) || (maxItems !== undefined) && (items.length < maxItems)) {
          var item = {
            name: itemName,
            quantity: quantity
          };
          items.push(item);
        }else{
          throw new Error("Max Items (" + maxItems +") reached.");
        }
      };

      // Servie method to remove items from list
      service.removeItem = function (itemIndex) {
        items.splice(itemIndex, 1);
      }

      // Servie method to get items
      service.getItems = function () {
        return items;
      };
  }

  function ShoppingListFactory() {
    var factory = function (maxItems) {
      return new ShoppingListService(maxItems);
    };
    return factory;
  }
})();
