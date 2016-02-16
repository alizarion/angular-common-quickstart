'use strict';

angular.module('MusicManager')
    .controller('MainController', [
        '$rootScope',
        '$scope',
        '$translate',
        '$route',
        'AuthService',
        'localStorageService',
        function ($rootScope, $scope, $translate, $route, AuthService, localStorageService) {

            //Langues supportées
            var localeBrowser = {};

            localeBrowser['fr'] = 'fr_FR';
            localeBrowser['en'] = 'en_US';
            localeBrowser['de'] = 'de_DE';


            $scope.authService = AuthService;

            $scope.changeLanguage = function (language) {

                //Sauvegarde de la locale
                localStorageService.set('Locale', language.toString());

                $scope.currentLanguage = language.toString();

                $translate.use($scope.currentLanguage);

                //Reload de la page
                $route.reload();

            };

            $scope.changeLanguage(localeBrowser[$translate.preferredLanguage()]);

        }]);
