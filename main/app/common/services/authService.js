'use strict';

angular.module('seed')
    .service('AuthService',
    ['$rootScope', function($rootScope) {
        return {
            login: function (user) {
                $rootScope.user = user;
            },
            logout: function () {
                $rootScope.user = null;
            },
            currentUser: function () {
                return $rootScope.user;
            }
        };
    }]);
