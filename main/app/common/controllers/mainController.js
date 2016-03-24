'use strict';

angular.module('T4HTML')
    .controller('MainController', [
        '$rootScope',
        '$scope',
        '$translate',
        '$route',
        'localStorageService',
        'BlockService',
        function ($rootScope, $scope, $translate, $route, localStorageService, BlockService) {

            //Langues supportées
            var localeBrowser = {};

            localeBrowser['fr'] = 'fr_FR';
            localeBrowser['en'] = 'en_US';
            localeBrowser['de'] = 'de_DE';


            $scope.changeLanguage = function (language) {

                //Sauvegarde de la locale
                localStorageService.set('Locale', language.toString());

                $scope.currentLanguage = language.toString();

                $translate.use($scope.currentLanguage);

                //Reload de la page
                $route.reload();

            };

            $scope.changeLanguage(localeBrowser[$translate.preferredLanguage()]);

           $scope.fileContent = "";
           $scope.selectedFile = "";
           $scope.blocks;
           BlockService.original.query(
           function(data){
               $scope.blocks = data.reduce((function(map, obj) {
                 if (map[obj.origin] === void 0) {
                   map[obj.origin] = [];
                 }
                 map[obj.origin].push(obj);
                 return map;
               }), {});
           },function (failed){
                console.log("failed");
           })

           $scope.editFile = function(selectedFile){
                $scope.selectedFile = selectedFile;
                $rootScope.$emit('edit_file',selectedFile);
           }

        }]);
