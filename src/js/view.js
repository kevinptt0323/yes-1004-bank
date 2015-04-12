'use strict';

/* Views */

var view = angular.module('databaseHomeworkView', []);

view.factory('pageView', function() {
  return {
    init: function() {
      jQuery(function() {
        jQuery('.ui.dropdown').dropdown();
      });
    }
  }
});

view.factory('signupView', function() {
  return {
    init: function() {
      jQuery('.ui.dropdown').dropdown();
    }
  };
});

