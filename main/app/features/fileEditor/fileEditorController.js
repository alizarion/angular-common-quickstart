'use strict';

angular.module('T4HTML')
    .controller('FileEditorController', [
        '$scope','$rootScope','$log','BlockService','EVENT',
        function ($scope,$rootScope,$log,BlockService,EVENT) {
               $scope.selectedBlocks = []
               $rootScope.$on('edit_file', function(event,selectedFile){
                    $log.log("Edit file "+selectedFile);
                     angular.copy($scope.blocks[selectedFile],$scope.selectedBlocks)
               });


                $rootScope.$on(EVENT.CREATE_CUSTOM_BLOCK,function(event,customBlock){
                    $log.log("New CustomBlock "+JSON.stringify(customBlock));
                    $scope.selectedBlocks.push(customBlock);
                    debugger;
                });

        }]);
