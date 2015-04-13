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

view.factory('view', function() {
  return {
    pageView: {
    },
    signupView: {
      init: function() {
        jQuery('.ui.dropdown').dropdown();
      }
    }
  };
});

