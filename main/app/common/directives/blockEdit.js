'use strict';

angular.module('T4HTML').directive('blockEdit', [ function () {
    return {
        restrict: 'E',
        templateUrl: 'app/common/directives/blockEditTemplate.html',
        scope: {
            block: '='
        },
        controllerAs: 'blockEditController',
        controller:  ['$scope','$rootScope','$log','EVENT','BlockService','CONFIG',function ($scope,$rootScope,$log,EVENT,BlockService,CONFIG) {
            var self = this;

            self.fields = {
                blockBefore: undefined,
                blockAfter: undefined,
                block: {},
                loaded: false
            };

             self.fn = {
                createBeforeBlock: createBeforeBlock,
                createAfterBlock: createAfterBlock,
                deleteBeforeBlock: deleteBeforeBlock,
                deleteAfterBlock:  deleteAfterBlock
             };

             self.fields.block = $scope.block;
             $scope.$watch('block',function(olValue, newValue){
                 self.fields.block = $scope.block;
             })

             BlockService.customByOriginal.query({'name':self.fields.block.name},function(data){
                angular.forEach(data, function(block){
                    if(block.verb == CONFIG.BEFORE_VERB){
                        self.fields.blockBefore = block;
                    }
                    if(block.verb == CONFIG.AFTER_VERB){
                        self.fields.blockAfter = block;
                    }
                })
                if(!self.fields.blockBefore){
                    self.fields.blockBefore = BlockService.new(self.fields.block.name,CONFIG.BEFORE_VERB,'')
                }
                if(!self.fields.blockAfter){
                    self.fields.blockAfter = BlockService.new(self.fields.block.name,CONFIG.AFTER_VERB,'')
                }
                self.fields.loaded = true;
             })

             function createBeforeBlock(block){
                self.fields.blockBefore = BlockService.new(self.fields.block.name,"before","","custom")
                $log.log("BlockEdit create before "+JSON.stringify(self.fields.blockBefore));
                //$rootScope.$emit(EVENT.CREATE_CUSTOM_BLOCK,customBlock);
             }

             function createAfterBlock(block){
                self.fields.blockAfter = BlockService.new(self.fields.block.name,"after","","custom")
                //$rootScope.$emit(EVENT.CREATE_CUSTOM_BLOCK,customBlock);
             }

             function deleteBeforeBlock(block){
                BlockService.custom.delete(self.fields.blockBefore);
                self.fields.blockBefore = undefined;
             }

             function deleteAfterBlock(block){
                BlockService.custom.delete(self.fields.blockAfter);
                self.fields.blockAfter = undefined;
             }
        }]
    }
}
]);