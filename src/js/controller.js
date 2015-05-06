'use strict';

/* Controllers */

var angular = angular || {};

var ctrl = angular.module('database.homework.controller', [
  'database.homework.view',
]);
ctrl.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit(attr.onFinishRender, element);
        });
      }
    }
  };
});

ctrl.controller('pageCtrl', ['$scope', '$sce', '$location', '$http', function($scope, $sce, $location, $http) {
  var load = function(config) {
    $scope[config.name] = $scope[config.name] || {};
    $http({ url: config.url })
      .success(function(data) {
        if( data.success ) {
          $scope[config.name] = data.message;
          (config.onSuccess || angular.noop)(data);
        } else {
          (config.onError || angular.noop)(data);
        }
      })
      .error(config.onError || angular.noop);
  };
  $scope.$on('$viewContentLoaded', function(a) {
    if( a.targetScope.viewer && angular.isFunction(a.targetScope.viewer.init) ) {
      a.targetScope.viewer.init();
    }
  });
  $scope.$on('initDropdown', function(a, elem) {
    if( elem ) {
      var $elem = $(elem);
      if( $elem.hasClass('ui dropdown') ) {
        $elem.dropdown();
      } else {
        $elem.closest('.ui.dropdown').dropdown();
      }
    } else {
      $('.ui.dropdown').dropdown();
    }
  });
  $scope.$on('initCheckbox', function(a, elem) {
    $('.ui.checkbox').checkbox();
  });
  $scope.$on('$routeChangeSuccess', function (ev, current) {
    $scope.currentPage.name = current.name || 'Index';
  });
  $scope.$on('$routeChangeError', function (ev, current, previous, rejection) {
    $location.path('/error').replace();
  });
  $scope.$on('redirectToIndex', function() {
    $location.path('/').replace();
  });
  $scope.$on('loginStatusChange', function(event) {
    load({
      name: 'status',
      url: 'api/status.php',
      onSuccess: function(data) {
        if( $scope.status.isLogin ) {
          if( $scope.status.user.type === "employer" ) {
            $scope.navigates = [
              { name: $sce.trustAsHtml('<i>Hello, ' + $scope.status.user.name + '</i>!')},
              { name: 'List All Jobs', href: '#!/jobs/list', icon: 'list' },
              { name: 'List All Jobseekers', href: '#!/jobseeker/list', icon: 'users' },
              { name: 'Logout', href: '#!/logout', icon: 'sign out' }
            ];
          } else {
            $scope.navigates = [
              { name: $sce.trustAsHtml('<i>Hello, ' + $scope.status.user.name + '</i>!')},
              { name: 'List All Jobs', href: '#!/jobs/list', icon: 'list' },
              { name: 'Logout', href: '#!/logout', icon: 'sign out' }
            ];
          }
        } else {
          $scope.navigates = [
            { name: 'List All Jobs', href: '#!/jobs/list', icon: 'list' },
            { name: 'Sign Up',
              icon: 'add user',
              menu: [
                { name: 'Job Seeker', href: '#!/register/jobseeker' },
                { name: 'Employer', href: '#!/register/employer' }
              ]
            },
            { name: 'Login', href: '#!/login', icon: 'sign in' }
          ];
        }
      }
    });
  });
  $scope.$on('jobsListReload', function(event, config) {
    if( config.column && config.order ) {
      load({
        name: 'jobs',
        url: 'api/jobsList.php?column=' + config.column + '&order=' + config.order
      });
    } else {
      load({
        name: 'jobs',
        url: 'api/jobsList.php'
      });
    }
  });
  $scope.$on('jobseekerListReload', function() {
    load({
      name: 'jobseekers',
      url: 'api/jobseekerList.php'
    });
  });
  $scope.toHTML = function(text) {
    if( angular.isString(text) ) {
      return $sce.trustAsHtml(text);
    } else {
      return text;
    }
  }
  $scope.currentPage = { name: 'Index' };
  $scope.config = { title: 'Yes, 1004 銀行' };
  load({
    name: 'options',
    url: 'api/options.php'
  });
  $scope.$emit('loginStatusChange');
}])

.controller('jobsShowListCtrl', ['$scope', '$route', '$routeParams', 'view', function($scope, $route, $routeParams, view) {
  $scope.occupation = function(id) {
    return $scope.options.occupation[id];
  };
  $scope.location = function(id) {
    return $scope.options.location[id];
  };
  $scope.viewer = view[$route.current.viewer]({
    '$scope': $scope,
    '$routeParams': $routeParams
  });
  $scope.$emit('jobsListReload', $routeParams);
}])

.controller('jobsShowCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.job = { id: $routeParams.id, name: 'job ??' };
}])

.controller('registerJobseekerCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  if( $scope.status && $scope.status.isLogin ) {
    $scope.$emit('redirectToIndex');
  } else {
    $scope.viewer = view[$route.current.viewer]({
      '$scope': $scope
    });
    $scope.specialty = {};
  }
}])

.controller('registerEmployerCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  if( $scope.status && $scope.status.isLogin ) {
    $scope.$emit('redirectToIndex');
  } else {
    $scope.viewer = view[$route.current.viewer]({
      '$scope': $scope
    });
  }
}])

.controller('loginCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  if( $scope.status && $scope.status.isLogin ) {
    $scope.$emit('redirectToIndex');
  } else {
    $scope.viewer = view[$route.current.viewer]({
      '$scope': $scope
    });
  }
}])

.controller('logoutCtrl', ['$scope', '$http', 'view', function($scope, $http, view) {
  $scope.logout = function() {
    $http({
      method  : 'POST',
      url     : 'api/logout.php',
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .success(function(data) {
        $scope.$emit('loginStatusChange');
        $scope.$emit('redirectToIndex');
        $scope.jobseekers = null;
      })
      .error(function() {
      });
  };
  $scope.logout();
}])

.controller('jobseekerListCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  if( !$scope.status || !$scope.status.isLogin || $scope.status.user.type !== 'employer' ) {
    $scope.$emit('redirectToIndex');
  } else {
    $scope.$emit('jobseekerListReload');
  }
  $scope.specialty = function(id) {
    return $scope.options.specialty[id];
  };
}])
;
