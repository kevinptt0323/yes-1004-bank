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

var registerFormView = function($http, config) {
  var that = {};
  var form = config.form;
  that.init = config.init || function() {};
  that.validate = function(success_cb, error_cb) {
    var result = $(form).form('validate form');
    if( result && angular.isFunction(success_cb) ) {
      success_cb();
    }
    if( !result && angular.isFunction(error_cb) ) {
      error_cb();
    }
  };
  that.process = function(formData) {
    this.validate(function() {
      $http({
        method  : 'POST',
        url     : config.url,
        data    : $.param(formData),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .success(function(data) {
          if( data.success ) {
            $(form).find('.ui.message')
              .removeClass('error')
              .addClass('positive')
              .html(data.message)
              .show();
            $(form).form('clear');
          } else {
            console.log(form);
            console.log($(form));
            console.log($(form).find('.ui.message'));
            $(form).find('.ui.message')
              .removeClass('positive')
              .addClass('error')
              .html(data.message)
              .show();
          }
        })
        .error(function() {
          $(form).find('.ui.message')
            .removeClass('positive')
            .addClass('error')
            .html('Error: Please contact administrator.')
            .show();
        });
    });
  };
  that.getDropdownValue = function(e) {
    return e.target.getAttribute('data-value');
  }
  return that;
};

view.service('view', ['$http', function($http) {

  var jobseekerForm = '#register-jobseeker-form';
  this.registerJobseekerView = new registerFormView($http, {
    form: jobseekerForm,
    init: function() {
      $(jobseekerForm).find('.ui.dropdown').dropdown();
      $(jobseekerForm).form({
        username: {
          identifier : 'username',
          rules: [{ type : 'empty', prompt : 'Please enter a username' }]
        },
        password: {
          identifier : 'password',
          rules: [{ type : 'empty', prompt : 'Please enter a password' }]
        },
        confirmpasswd: {
          identifier : 'confirm',
          rules: [{ type : 'match[password]', prompt : 'Confirm password is not matched' }]
        },
        phone: {
          identifier : 'phone',
          rules: [{ type : 'empty', prompt : 'Please enter your phone' }]
        },
        email: {
          identifier : 'email',
          rules: [
            { type : 'empty', prompt : 'Please enter your e-mail' },
            { type : 'email', prompt : 'Please enter a valid e-mail address' }
          ]
        },
        gender: {
          identifier : 'gender',
          rules: [{ type : 'empty', prompt : 'Please select your gender' }]
        },
        age: {
          identifier : 'age',
          rules: [
            { type : 'empty'  , prompt : 'Please enter your age' },
            { type : 'integer', prompt : 'Age must be a number' }
          ]
        },
        salary: {
          identifier : 'salary',
          rules: [
            { type : 'empty'  , prompt : 'Please enter your expected salary' },
            { type : 'integer', prompt : 'Expected salary must be a number' }
          ]
        },
        education: {
          identifier : 'education',
          rules: [{ type : 'empty', prompt : 'Please select your major education' }]
        }
      });
    },
    url: 'api/registerJobseeker.php'
  });

  var employerForm = '#register-employer-form';
  this.registerEmployerView = new registerFormView($http, {
    form: employerForm,
    init: function() {
      $(employerForm).form({
        username: {
          identifier : 'username',
          rules: [{ type : 'empty', prompt : 'Please enter a username' }]
        },
        password: {
          identifier : 'password',
          rules: [{ type : 'empty', prompt : 'Please enter a password' }]
        },
        confirmpasswd: {
          identifier : 'confirm',
          rules: [{ type : 'match[password]', prompt : 'Confirm password is not matched' }]
        },
        phone: {
          identifier : 'phone',
          rules: [{ type : 'empty', prompt : 'Please enter your phone' }]
        },
        email: {
          identifier : 'email',
          rules: [
            { type : 'empty', prompt : 'Please enter your e-mail' },
            { type : 'email', prompt : 'Please enter a valid e-mail address' }
          ]
        }
      });
    },
    url: 'api/registerEmployer.php'
  });
}]);

