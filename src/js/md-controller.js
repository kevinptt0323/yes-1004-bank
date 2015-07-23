'use strict';

/* Controllers */

var angular = angular || {};
var $ = $ || {};

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

ctrl.controller('pageCtrl', ['$scope', '$sce', '$location', '$http', 'view', '$mdSidenav', '$mdToast', function($scope, $sce, $location, $http, view, $mdSidenav, $mdToast) {
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
    $scope.currentPage.path = $location.path();
  });
  $scope.$on('$routeChangeError', function (ev, current, previous, rejection) {
    $scope.$emit('redirect', '/error');
  });
  $scope.$on('redirect', function(ev, dir) {
    $location.path(dir).replace();
  });
  $scope.$on('loginStatusChange', function(event) {
    load({
      name: 'status',
      url: 'api/status.php',
      onSuccess: function(data) {
        if( $scope.is.login() ) {
          if( $scope.is.employer() ) {
            $scope.navigates = [
              { name: 'All Jobs', href: '#!/jobs/list', icon: 'list' },
              { name: 'My Jobs', href: '#!/jobs/list/my', icon: 'list' },
              { name: 'Jobseekers', href: '#!/jobseeker/list', icon: 'people' },
              { name: 'Logout', href: '#!/logout', icon: 'logout' }
            ];
          } else {
            $scope.navigates = [
              { name: 'All Jobs', href: '#!/jobs/list', icon: 'list' },
              { name: 'Logout', href: '#!/logout', icon: 'logout' }
            ];
          }
        } else {
          $scope.navigates = [
            { name: 'Jobs', href: '#!/jobs/list', icon: 'list' },
            { name: 'Sign Up', href: '#!/register', icon: 'person_add' },
            /*{ name: 'Sign Up',
              icon: 'person_add',
              menu: [
                { name: 'Job Seeker', href: '#!/register/jobseeker' },
                { name: 'Employer', href: '#!/register/employer' }
              ]
            },*/
            { name: 'Login', href: '#!/login', icon: 'login' }
          ];
        }
      }
    });
  });
  $scope.$on('jobsListReload', function(event, config, searchData) {
    var url = 'api/jobsList.php?';
    if( config.favorite == "favorite" ) {
      url += 'favorite&';
    }
    if( config.column && config.order ) {
      url += 'column=' + config.column + '&order=' + config.order + '&';
    }
    if( searchData !== null ) {
      var search = false;
      for(var key in searchData) {
        if( searchData.hasOwnProperty(key) && searchData[key] ) {
          url += key + '=' + searchData[key] + '&';
          search = true;
        }
      }
      if( search ) {
        url += 'search&';
      }
    }
    load({
      name: 'jobs',
      url: url
    });
  });
  $scope.$on('jobsApplyListReload', function() {
    load({
      name: 'jobsApply',
      url: 'api/jobsApplyList.php'
    });
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
  };
  $scope.currentPage = { name: 'Index' };
  $scope.config = { title: 'Yes, 1004 銀行' };
  $scope.is = {
    login: function() {
      return $scope.status.isLogin;
    },
    jobseeker: function() {
      return $scope.is.login() && $scope.status.user.type == 'jobseeker';
    },
    employer: function() {
      return $scope.is.login() && $scope.status.user.type == 'employer';
    }
  };
  $scope.occupation = function(id) {
    return $scope.options.occupation[id];
  };
  $scope.location = function(id) {
    return $scope.options.location[id];
  };
  $scope.specialty = function(id) {
    return $scope.options.specialty[id];
  };
  $scope.searchData = {};

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.gotoPath = function(path, menuId) {
    if( path.substr(0, 3)=="#!/" ) {
      $scope.$emit('redirect', path.substr(3));
    } else {
    }
    if( menuId ) {
      $mdSidenav(menuId).close();
    }
  };

  load({
    name: 'options',
    url: 'api/options.php'
  });
  $scope.$emit('loginStatusChange');

  $scope.message = view["message"]({
    '$mdToast': $mdToast
  });
}])

.controller('jobsShowListCtrl', ['$scope', '$route', '$routeParams', 'view', function($scope, $route, $routeParams, view) {
  if( $routeParams.favorite && !$scope.is.jobseeker() ) {
    $scope.$emit('redirect', '/jobs/list');
  }
  $scope.viewer = view[$route.current.viewer]({
    '$scope': $scope,
    '$routeParams': $routeParams
  });
  $scope.checkFavorite = function() {
    if( $routeParams.favorite == "favorite" ) {
      return "/favorite";
    } else {
      return "";
    }
  };
  $scope.$emit('jobsListReload', $routeParams, $scope.searchData);
}])

.controller('jobsShowApplyListCtrl', ['$scope', '$http', function($scope, $http) {
  if( !$scope.is.employer() ) {
    $scope.$emit('redirect', '/jobs/list');
  }
  $scope.$emit('jobsApplyListReload');
  $scope.hire = function(jobID, jobseekerID) {
    $http({
      method  : 'POST',
      url     : 'api/jobsEdit.php?delete',
      data    : $.param({rid: jobID}),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .success(function(data) {
        $scope.$emit('jobsApplyListReload');
      })
      .error(function() {
      });
  };
}])

.controller('jobsShowCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.job = { id: $routeParams.id, name: 'job ??' };
}])

.controller('registerJobseekerCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  if( $scope.is.login() ) {
    $scope.$emit('redirect', '/');
  } else {
    $scope.viewer = view[$route.current.viewer]({
      '$scope': $scope
    });
    $scope.specialty = {};
  }
}])

.controller('registerEmployerCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  if( $scope.is.login() ) {
    $scope.$emit('redirect', '/');
  } else {
    $scope.viewer = view[$route.current.viewer]({
      '$scope': $scope
    });
  }
}])

.controller('loginCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  if( $scope.is.login() ) {
    $scope.$emit('redirect', '/');
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
        $scope.$emit('redirect', '/');
        $scope.jobseekers = null;
        $scope.message.success('Logout Successfully!');
      })
      .error(function() {
      });
  };
  $scope.logout();
}])

.controller('jobseekerListCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  if( !$scope.is.employer() ) {
    $scope.$emit('redirect', '/');
  } else {
    $scope.$emit('jobseekerListReload');
  }
}])
;
