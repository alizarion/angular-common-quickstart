'use strict';

angular.module('MusicManager')
    .factory('AuthService',  ['$rootScope', function ($rootScope) {

        $rootScope.user = null;

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
