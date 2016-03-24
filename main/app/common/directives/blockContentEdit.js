'use strict';

angular.module('T4HTML').directive('blockContentEdit', ['$q','$log','BlockService', function ($q,$log,BlockService) {
    return {
        restrict: 'AE',
        templateUrl: 'app/common/directives/blockContentEditTemplate.html',
        scope: {
            block: '=',
            readonly: '='
        },
        controllerAs: 'blockContentEditController',
        controller:  ['$scope','$rootScope','$log','EVENT','BlockService','itPopup','itNotifier',function ($scope,$rootScope,$log,EVENT,BlockService,itPopup,itNotifier) {
             var self = this

            self.fn={
                deleteBlock: deleteBlock,
                saveBlock: saveBlock
            }

            self.fields ={
                block: $scope.block,
                readonly:  $scope.readonly
            }

             $scope.$watch('readOnly',function(olValue, newValue){
                self.fields.readonly = $scope.readonly;
             })

             $scope.$watch('block',function(olValue, newValue){
                self.fields.block = $scope.block;
             })

             $scope.$watch(function () {
                return self.fields.block.content;
             },function(value){
                saveBlock();
             });

             function deleteBlock(){
                  var confirmPopup = itPopup.confirm({
                              title: "{{'DELETE_BLOCK_TITLE' | translate}}",
                              text: "{{'DELETE_BLOCK_CONFIRM' | translate}}",
                              buttons: [

                                  {
                                      text: 'Cancel',
                                      type: '',
                                      onTap: function () {
                                          return false;
                                      }
                                  },
                                  {
                                      text: 'ok',
                                      type: '',
                                      onTap: function () {
                                          return true;
                                      }
                                  }
                                 ]
                          });
                          confirmPopup.then(function(res) {
                            BlockService.custom.delete(self.fields.block);
                            self.fields.block = {};
                            itNotifier.notifySuccess({
                                        content: "{{'BLOCK_DELETED_OK' | translate}}"
                                        });
                          },function(){
                            itNotifier.notifyError({
                                        content: "{{'BLOCK_DELETED_KO' | translate}}"
                                        });
                          });
             }

              function saveBlock() {
                    $log.log("Save Block "+JSON.stringify(self.fields.block))
                    BlockService.custom.save(self.fields.block);
                    itNotifier.notifySuccess({
                        content: "{{'BLOCK_SAVED_OK' | translate}}"
                    });

              }
        }]
    }
}
]);