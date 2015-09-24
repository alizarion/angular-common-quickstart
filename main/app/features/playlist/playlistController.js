'use strict';

angular.module('seed')
    .controller('PlaylistController', ['$scope', '$translate', function ($scope, $translate) {

        $scope.data = [
            {
                "artist": "Major Lazer & DJ Snake",
                "title": "Lean On",
                "ilike": false
            },
            {
                "artist": "Calvin Harris",
                "title": "Outside ft. Ellie Gouldind",
                "ilike": true
            },
            {
                "artist": "Skrillex and Diplo",
                "title": "Where are you now",
                "ilike": false
            },
            {
                "artist": "Avicii",
                "title": "Waiting for love",
                "ilike": true
            },
            {
                "artist": "Calvin Harris & Disciples",
                "title": "How Deep Is Your Love",
                "ilike": true
            },
            {
                "artist": "OMI (Felix Jaehn Remix)",
                "title": "Cheerleader",
                "ilike": true
            }
        ];

        $scope.masterDetails = {};

        $scope.masterDetails = {
            columnDefs : [{ field: "artist", displayName: $translate.instant("GLOBAL.ARTIST_LABEL"),  sortable:true},
                { field: "title", displayName: $translate.instant("GLOBAL.TITLE_LABEL"),  sortable:true},
                { field: "ilike", displayName: $translate.instant("PLAYLIST.ILIKE_LABEL"),   sortable:false}]

        };

        $scope.masterDetails.disableMultiSelect = false;
        $scope.masterDetails.navAlert = {
            text:'Vous n\'avez pas sauvegardé vos modifications',
            title:'Modification en cours'
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
                "artist" : "Artist " + ($scope.data.length+1) ,
                "title": "Title " + ($scope.data.length+1),
                "ilike" : true
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
