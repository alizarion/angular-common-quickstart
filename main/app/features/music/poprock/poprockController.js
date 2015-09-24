'use strict';

angular.module('seed')
    .controller('PoprockController', [
        '$scope',
        function ($scope) {

            $scope.data = [
                {
                    "artist": "Carly Rae Jepsen",
                    "title": "I Really Like You"
                },
                {
                    "artist": "Kygo",
                    "title": "Firestone ft. Conrad Sewel"
                },
                {
                    "artist": "The Weeknd",
                    "title": "Can't Feel My Face"
                },
                {
                    "artist": "One Direction",
                    "title": "Drag Me Down"
                },
                {
                    "artist": "Demi Lovato",
                    "title": "Cool for the Summer"
                },
                {
                    "artist": "Taylor Swift",
                    "title": "Wildest Dreams"
                }
            ];

        }]);
