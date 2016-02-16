'use strict';

angular.module('MusicManager', [
    'itesoft',
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'mgcrea.ngStrap.datepicker',
    'LocalStorageModule',
    'ui.bootstrap.dropdown'
    ])
    .config(['$translateProvider', '$translatePartialLoaderProvider', 'tmhDynamicLocaleProvider', function ($translateProvider, $translatePartialLoaderProvider, tmhDynamicLocaleProvider) {
        // Declare languages mapping
        $translateProvider.registerAvailableLanguageKeys(['en', 'fr', 'de'], {
            'en_US': 'en',
            'en_GB': 'en',
            'fr_FR': 'fr',
            'fr-CA': 'fr',
            'de-DE': 'de'
        }).determinePreferredLanguage();

        // Use partial loader
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'assets/locale/{lang}/{part}-{lang}.json'
        });

        $translateProvider.useSanitizeValueStrategy();
    }])
    .config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('assets/lib/angular-i18n/angular-locale_{{locale}}.js')
    }])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('quickstart');
    }])
    .run(['$rootScope', '$route', '$translate','tmhDynamicLocale','localStorageService', function ($rootScope, $route, $translate, tmhDynamicLocale,localStorageService) {
        $rootScope.$on('$routeChangeSuccess', function () {
            $rootScope.pageTitle = $route.current.title;
        });

        $rootScope.$on('$translateChangeSuccess', function (event, data) {
            var langKey = data.language;
            if (langKey) {
                tmhDynamicLocale.set(langKey.replace('_','-'));
            }
            else {
                tmhDynamicLocale.set($translate.preferredLanguage());
            }
        });
    }]);

