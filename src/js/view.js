'use strict';

/* Views */

var $ = $ || {};
var angular = angular || {};
var jQuery = jQuery || {};


var view = angular.module('database.homework.view', []);

function getDropdownValue(e) {
  return e.target.getAttribute('data-value');
}

var AjaxFormView = function($http, config) {
  if( !(this instanceof AjaxFormView) ) {
    return new AjaxFormView($http, config);
  }
  var form = config.form;
  this.form = config.form;
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
      $('input[type=checkbox]').prop("checked", false);
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

var JobsForm = function($http, config) {
  if( !(this instanceof JobsForm) ) {
    return new JobsForm($http, config);
  }
  AjaxFormView.apply(this, [$http, config]);
  this.show = false;
  this.inited = false;
  this.formData = {};
  this.select = function(idx, val) {
    this.formData[idx] = val;
  };
  this.toggle = function() {
    if( !this.inited ) {
      config.init();
      this.inited = true;
    }
    this.show = !this.show;
  };
};
JobsForm.prototype = AjaxFormView.prototype;

view.service('view', ['$http', function($http) {

  this.jobsShowListView = function(param) {
    var that = {};
    var initJob = function(self) {
      param.$scope.$emit('initDropdown');
      $(self.form).form({
        occupation_id: {
          identifier : 'occupation_id',
          rules: [{ type : 'empty', prompt : 'Please select occupation' }]
        },
        location_id: {
          identifier : 'location_id',
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
          self.submit(self.formData, {
            onSuccess: function() {
              self.toggle();
              self.inited = false;
              param.$scope.$emit('jobsListReload', param.$routeParams);
            }
          });
          return false;
        },
        onFailure: self.message.error
      });
      if( self.formData ) {
        //$(self.form).form('set values', self.formData);
      }
    };
    that.getDropdownValue = getDropdownValue;
    that.jobs = {};
    that.editing = function(id) {
      return that.jobs[id] && that.jobs[id].show;
    };
    that.toggle = function(id) {
      if( !that.jobs[id] ) {
        if( id==='new' ) {
          that.jobs[id] = new JobsForm($http, {
            form: '#new-job-form',
            url: 'api/jobsEdit.php?new',
            init: function() {
              initJob(that.jobs[id]);
            }
          });
        } else {
          that.jobs[id] = new JobsForm($http, {
            form: '.ui.form[data-rid=' + id + ']',
            url: 'api/jobsEdit.php?edit',
            init: function() {
              var tmp = param.$scope.jobs.filter(function(elem){
                return elem.id==id;
              })[0];
              that.jobs[id].formData.rid = id;
              ['occupation_id', 'location_id', 'working_time', 'education'].forEach(function(elem) {
                that.jobs[id].formData[elem] = tmp[elem];
              });
              if( tmp.experience ) {
                that.jobs[id].formData.experience = +tmp.experience;
              }
              if( tmp.salary ) {
                that.jobs[id].formData.salary = +tmp.salary;
              }
              initJob(that.jobs[id]);
            }
          });
        }
      }
      that.jobs[id].toggle();
    };
    that.delete1 = function(id) {
      $http({
        method  : 'POST',
        url     : 'api/jobsEdit.php?delete',
        data    : $.param({ rid: id }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .success(function(data) {
          param.$scope.$emit('jobsListReload', param.$routeParams);
        });
    };
    that.apply = function(id) {
      $http({
        method  : 'POST',
        url     : 'api/apply.php?new',
        data    : $.param({ rid: id }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .success(function(data) {
          param.$scope.$emit('jobsListReload', param.$routeParams);
        });
    };
    return that;
  };

  var jobseekerForm = '#register-jobseeker-form';
  this.registerJobseekerView = function(param) {
    var that = new AjaxFormView($http, {
      form: jobseekerForm,
      url: 'api/registerJobseeker.php',
      init: function() {
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
            param.$scope.formData.specialty = [];
            for(var key in param.$scope.specialty) {
              if( param.$scope.specialty[key] ) {
                param.$scope.formData.specialty.push(key);
              }
            }
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
    var that = new AjaxFormView($http, {
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
    var that = new AjaxFormView($http, {
      form: loginForm,
      url: 'api/login.php',
      init: function() {
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
      }
    });
    return that;
  };
}]);

