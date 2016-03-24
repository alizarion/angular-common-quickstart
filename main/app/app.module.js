'use strict';

angular.module('T4HTML', [
    'itesoft',
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'mgcrea.ngStrap.datepicker',
    'LocalStorageModule',
    'ui.codemirror',
    'ui.bootstrap.dropdown',
    'ngResource'
    ])
    .config(['itNotifierProvider', function (itNotifierProvider) {
        //configuration of default values
        itNotifierProvider.defaultOptions = {
            dismissOnTimeout: true,
            timeout: 4000,
            dismissButton: true,
            animation: 'fade',
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            compileContent: true,
            dismissOnClick: false,
            success:{dismissOnClick: true},//optional overload behavior toast success
            info:{dismissOnClick: true},//optional overload behavior toast info
            error:{dismissOnTimeout: false},//optional overload behavior toast error
            warning:{dismissOnTimeout: false}//optional overload behavior toast warning
        }}])
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
    }])

