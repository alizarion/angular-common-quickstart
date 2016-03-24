/**
 * Created by dge on 14/12/2015.
 */
'use strict';
angular.module('T4HTML')
    .factory('BlockService', ['$resource', 'CONFIG','$http',
        function ($resource, CONFIG, $http) {
            return {
                custom: $resource(
                    CONFIG.URL + '/blocks/available/:name/:verb'),
                original: $resource(
                    CONFIG.URL + '/blocks/original/'),
                customByOriginal: $resource(
                    CONFIG.URL + '/blocks/available/:name'),
                'new': function(name,verb,content,origin){
                    return {'name':name,'verb':verb,'content':content,'origin':origin};
                }
            }
        }]);