'use strict';

angular.module('MusicManager')
    .controller('LoginController', [
        '$scope',
        'AuthService',
        function ($scope, AuthService) {

            $scope.authService = AuthService;

        }]);
