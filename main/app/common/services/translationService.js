/**
 * @author sbn
 * @ngdoc service
 * @name ProductionManager.service:TranslationService
 * @module ProductionManager
 * @requires $q, $translate, $translatePartialLoader
 * @return promise
 * @description
 * Service to load translation part that are needed for view rendering.
 * MUST be used in route resolver to load translation part before
 * view rendering and avoid the display problems
 *
 * ```javascript
 * when('/supervise/activity', {
                templateUrl: 'app/features/activity/activityView.html',
                controller: 'SuperviseActivityController',
                resolve : {
                    translationPart: [ 'TranslationService',function(TranslationService){
                        return TranslationService('my-first-translation-part','my-second-translation-part');
                    }]
                }
            })
 * ```
 *
 */
'use strict';

angular.module('seed')
    .service('TranslationService',
    ['$q','$translate','$translatePartialLoader', function($q, $translate, $translatePartialLoader) {
        return function() {
            $translatePartialLoader.addPart('global');
            angular.forEach(arguments, function(translationKey) {
                $translatePartialLoader.addPart(translationKey);
            });

            return  $translate.refresh();
        };
    }]);