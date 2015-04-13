'use strict';

/* Views */

var view = angular.module('database.homework.view', []);

view.factory('pageView', function() {
  return {
    init: function() {
      jQuery(function() {
        jQuery('.ui.dropdown').dropdown();
      });
    }
  };
});

view.service('view', ['$http', function($http) {
  this.registerJobseekerView = {
    init: function() {
      jQuery('.ui.dropdown').dropdown();
    },
    process: function(formData) {
      console.log("process form!");
      $http({
        method  : 'POST',
        url     : 'api/registerJobseeker.php',
        data    : $.param(formData),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .success(function(data) {
          if( data.success ) {
            console.log("success!");
          } else {
            console.log("Error: " + data.message);
          }
        })
        .error(function() {
          console.log("Error");
        })
      ;
    }
  };
  this.registerEmployerView = {
    init: function() {
      jQuery('.ui.dropdown').dropdown();
    },
    process: function(formData) {
      console.log("process form!");
      $http({
        method  : 'POST',
        url     : 'api/registerEmployer.php',
        data    : $.param(formData),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .success(function(data) {
          if( data.success ) {
            console.log("success!");
          } else {
            console.log("Error: " + data.message);
          }
        })
        .error(function() {
          console.log("Error");
        })
      ;
    }
  };
}]);

