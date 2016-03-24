'use strict';

angular.module('T4HTML').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/file/edit', {
                templateUrl: 'app/features/fileEditor/fileEditorView.html',
                controller: 'FileEditorController',
                title: '',
                resolve: {
                    translationPart: [ 'TranslationService',function(TranslationService){
                       return TranslationService('fileEditor');
                    }]
                }
            })
            .otherwise({
                redirectTo: '/file/edit'
            });
    }]);