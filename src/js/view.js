'use strict';

/* Views */

var $ = $ || {};
var angular = angular || {};
var jQuery = jQuery || {};


var view = angular.module('database.homework.view', []);

function getDropdownValue(e) {
  return e.target.getAttribute('data-value');
}

view.factory('pageView', function() {
  return {
    init: function() {
      $(function() {
        $('.ui.dropdown').dropdown();
      });
    }
  };
});

var AjaxFormView = function($http, config) {
  if( !(this instanceof AjaxFormView) ) {
    return new AjaxFormView($http, config);
  }
  var form = config.form;
  this.init = config.init || function() {};
  this.message = {
    success: function(message) {
      if( message ) {
        $(form).find('.ui.message')
          .removeClass('error')
          .addClass('positive')
          .html(message)
          .show();
      }
      $(form).form('clear');
    },
    error: function(message) {
      if( angular.isString(message) ) {
        $(form).find('.ui.message')
          .removeClass('positive')
          .addClass('error')
          .html(message)
          .show();
      }
      $(form).transition('shake');
      return false;
    }
  };
  var message = this.message;
  this.submit = function(formData, callback) {
    callback = callback || {};
    $http({
      method  : 'POST',
      url     : config.url,
      data    : $.param(formData),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .success(function(data) {
        if( angular.isString(data) ) {
          data = {
            success: 0,
            message: 'Error: Please contact administrator.'
          };
        }
        if( data.success ) {
          message.success(data.message);
          if( angular.isFunction(callback.onSuccess) ) {
            callback.onSuccess();
          }
        } else {
          message.error(data.message);
          if( angular.isFunction(callback.onFailure) ) {
            callback.onFailure();
          }
        }
      })
      .error(function() {
        message.error('Error: Please contact administrator.');
        if( angular.isFunction(callback.onFailure) ) {
          callback.onFailure();
        }
      });
    return false;
  };
};

AjaxFormView.prototype.getDropdownValue = getDropdownValue;

view.service('view', function() {

  var newJobForm = '#new-job-form';
  this.jobsShowListView = function(param) {
    var that = new AjaxFormView(param.$http, {
      form: newJobForm,
      url: 'api/jobsEdit.php?new',
      init: function() {
        $('.ui.dropdown').dropdown();
        $(newJobForm).form({
          occupation: {
            identifier : 'occupation',
            rules: [{ type : 'empty', prompt : 'Please select occupation' }]
          },
          location: {
            identifier : 'location',
            rules: [{ type : 'empty', prompt : 'Please select location' }]
          },
          working_time: {
            identifier : 'working_time',
            rules: [{ type : 'empty', prompt : 'Please select working time' }]
          },
          education: {
            identifier : 'education',
            rules: [{ type : 'empty', prompt : 'Please select education required' }]
          },
          experience: {
            identifier : 'experience',
            rules: [
              { type : 'empty'  , prompt : 'Please enter minimal experience' },
              { type : 'integer', prompt : 'Minimal experience must be a number' }
            ]
          },
          salary: {
            identifier : 'salary',
            rules: [
              { type : 'empty'  , prompt : 'Please enter salary' },
              { type : 'integer', prompt : 'Salary must be a number' }
            ]
          }
        },{
          onSuccess: function() {
            that.submit(param.$scope.formData, {
              onSuccess: function() {
                param.$scope.$emit('jobsListReload');
              }
            });
            return false;
          },
          onFailure: that.message.error
        });
      }
    });
    return that;
  };

  var jobseekerForm = '#register-jobseeker-form';
  this.registerJobseekerView = function(param) {
    var that = new AjaxFormView(param.$http, {
      form: jobseekerForm,
      url: 'api/registerJobseeker.php',
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
        },{
          onSuccess: function() {
            that.submit(param.$scope.formData);
            return false;
          },
          onFailure: that.message.error
        });
      }
    });
    return that;
  };

  var employerForm = '#register-employer-form';
  this.registerEmployerView = function(param) {
    var that = new AjaxFormView(param.$http, {
      form: employerForm,
      url: 'api/registerEmployer.php',
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
        },{
          onSuccess: function() {
            that.submit(param.$scope.formData);
            return false;
          },
          onFailure: that.message.error
        });
      }
    });
    return that;
  };

  var loginForm = '#login-form';
  this.loginView = function(param) {
    var that = new AjaxFormView(param.$http, {
      form: loginForm,
      url: 'api/login.php',
    });
    that.init = function() {
      $(loginForm).form({
        username: {
          identifier : 'username',
          rules: [{ type : 'empty', prompt : 'Please enter a username' }]
        },
        password: {
          identifier : 'password',
          rules: [{ type : 'empty', prompt : 'Please enter a password' }]
        }
      },{
        onSuccess: function() {
          return that.submit(param.$scope.formData, {
            onSuccess: function() {
              param.$scope.$emit('loginStatusChange');
              param.$scope.$emit('redirectToIndex');
            }
          });
        },
        onFailure: that.message.error
      });
    };
    return that;
  };
});

