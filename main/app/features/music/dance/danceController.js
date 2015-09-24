'use strict';

angular.module('seed')
    .controller('DanceController', [
        '$scope',
        function ($scope) {

            $scope.data = [
                {
                    "artist": "Major Lazer & DJ Snake",
                    "title": "Lean On"
                },
                {
                    "artist": "Calvin Harris",
                    "title": "Outside ft. Ellie Gouldind"
                },
                {
                    "artist": "Skrillex and Diplo",
                    "title": "Where are you now"
                },
                {
                    "artist": "Avicii",
                    "title": "Waiting for love"
                },
                {
                    "artist": "Calvin Harris & Disciples",
                    "title": "How Deep Is Your Love"
                },
                {
                    "artist": "OMI (Felix Jaehn Remix)",
                    "title": "Cheerleader"
                }
            ];

        }]);
