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

  this.registerJobseekerView = function() {
    var that = {};
    var $form = jQuery('#register-jobseeker-form')
    that.init = function() {
      $form.find('.ui.dropdown').dropdown();
    };
    that.process = function(formData) {
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
    };
    return that;
  }();

  this.registerEmployerView = function() {
    var that = {};
    var $form = jQuery('#register-employer-form')
    that.init = function() {
      $form.form({
        username: {
          identifier : 'username',
          rules: [{
            type : 'empty',
            prompt : 'Please enter a username'
          }]
        },
        password: {
          identifier : 'password',
          rules: [{
            type : 'empty',
            prompt : 'Please enter a password'
          }]
        },
        phone: {
          identifier : 'phone',
          rules: [{
            type : 'empty',
            prompt : 'Please enter your phone'
          }]
        },
        email: {
          identifier : 'email',
          rules: [{
            type : 'empty',
            prompt : 'Please enter your e-mail'
          },{
            type : 'email',
            prompt : 'Please enter a valid e-mail address'
          }]
        }
      });
    };
    that.validate = function(success_cb, error_cb) {
      console.log('validate');
      
      var result = $form.form('validate form');
      if( result && angular.isFunction(success_cb) ) {
        success_cb();
      }
      if( !result && angular.isFunction(error_cb) ) {
        error_cb();
      }
    };
    that.process = function(formData) {
      console.log("process form!");
      this.validate(function() {
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
      });
    };
    return that;
  }();
}]);

