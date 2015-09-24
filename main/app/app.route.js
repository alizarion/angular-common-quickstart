'use strict';

angular.module('seed').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/music/poprock', {
                templateUrl: 'app/features/music/poprock/poprockView.html',
                controller: 'PoprockController',
                title: 'MUSIC.POPROCK.TITLE',
                resolve: {
                    translationPart: [ 'TranslationService',function(TranslationService){
                       return TranslationService('poprock');
                    }]
                }
            })
            .when('/music/dance', {
                templateUrl: 'app/features/music/dance/danceView.html',
                controller: 'DanceController',
                title: 'MUSIC.DANCE.TITLE',
                resolve: {
                    translationPart: [ 'TranslationService',function(TranslationService){
                        return TranslationService('dance');
                    }]
                }
            })
            .when('/playlist', {
                templateUrl: 'app/features/playlist/playlistView.html',
                controller: 'PlaylistController',
                title: 'PLAYLIST.TITLE',
                resolve: {
                    translationPart : [ 'TranslationService',function(TranslationService){
                        return TranslationService('playlist');
                    }]
                }
            })
            .otherwise({
                redirectTo: '/music/poprock'
            });
    }]);