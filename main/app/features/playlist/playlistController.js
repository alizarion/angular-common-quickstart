'use strict';

angular.module('MusicManager')
    .controller('PlaylistController', ['$scope', '$translate', function ($scope, $translate) {

        $scope.data = [
            {
                "name": "Liste 1",
                "description": "Ma liste 1",
                "shared": false
            },
            {
                "name": "Liste 2",
                "description": "Ma liste 2",
                "shared": true
            },
            {
                "name": "Liste 3",
                "description": "Ma liste 3",
                "shared": true
            },
            {
                "name": "Liste 4",
                "description": "Ma liste 4",
                "shared": false
            },
            {
                "name": "Liste 5",
                "description": "Ma liste 5",
                "shared": false
            }
        ];

        $scope.masterDetails = {};

        $scope.masterDetails = {
            columnDefs : [{ field: "name", displayName: $translate.instant("PLAYLIST.NAME_LABEL"),  sortable:true},
                { field: "description", displayName: $translate.instant("PLAYLIST.DESCRIPTION_LABEL"),  sortable:true},
                { field: "shared", displayName: $translate.instant("PLAYLIST.SHARED_LABEL"),   sortable:false}]

        };

        $scope.masterDetails.disableMultiSelect = false;
        $scope.masterDetails.navAlert = {
            title: $translate.instant("PLAYLIST.MODIFICATION_POPUP.TITLE"),
            text: $translate.instant("PLAYLIST.MODIFICATION_POPUP.MESSAGE")
        };

        function _removeItems(items,dataList){
            angular.forEach(items,function(entry){
                var index = dataList.indexOf(entry);
                dataList.splice(index, 1);
            })
        }

        $scope.deleteSelectedItems = function(){
            _removeItems($scope.masterDetails.getSelectedItems(), $scope.data);
        };

        $scope.saveCurrentItem = function(){
            angular.copy( $scope.masterDetails.getCurrentItemWrapper().currentItem,$scope.data[$scope.masterDetails.getCurrentItemWrapper().index])

            $scope.$broadcast('unlockCurrentItem');
        };

        $scope.undoChange = function(){
            $scope.masterDetails.undoChangeCurrentItem();
            $scope.masterDetails.fillHeight();
        };

        $scope.addNewItem = function(){
            var newItem =  {
                "name" : "Liste " + ($scope.data.length+1) ,
                "description": "Ma liste " + ($scope.data.length+1),
                "shared" : true
            };
            $scope.data.push(newItem);
            $scope.masterDetails.setCurrentItem(newItem).then(function(success){
                $scope.$broadcast('lockCurrentItem',false);
            },function(error){

            });
        };

        $scope.hasChanged = function(){
            if($scope.masterDetails.getCurrentItemWrapper() != null){
                return $scope.masterDetails.getCurrentItemWrapper().hasChanged;
            } else {
                return false;
            }
        }

    }]);
