/**
 * Configuration du projet.
 */
var pkg = require('./package.json');

module.exports = {
    dist: 'dist',
    /**
     * Header de la distribution.
     */
    banner:
    '/*!\n' +
    ' * Copyright 2015 itesoft.\n' +
    ' * http://itesoft.com/\n' +
    ' *\n' +
    ' * <%= pkg.name %>, v<%= pkg.version %>\n' +
    ' * A powerful music manager.*/\n' ,

    closureStart: '(function() {var RELEASE_VERSION="1.0.0";\n',
    closureEnd: '\n})();',

    /**
     * Liste des fichiers JS de l'application qui seront minifier pour la prod.
     */
    appFiles: [
        '!main/app/**/*Test.js',// Exclude test files
        'main/app/app.module.js',
        'main/app/**/*.js'
    ],

    /**
     * Liste des librairies minifié à utiliser en prod
     */
    vendorJavascriptFiles: [
        'main/assets/lib/angular-common/dist/assets/lib/vendor.min.js',
        'main/assets/lib/angular-common/dist/app/itesoft.min.js',
        'main/assets/lib/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
        'main/assets/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js'
    ],
    /**
     *
     * Fichiers de locales pour les formats, les monnaies, les jours, mois et autres.
     * A ne PAS minifier pour l'utilisation d'Angular Dynamic Locale
     *
     */
    localeJsFiles: [
        'main/assets/lib/angular-i18n/angular-locale_fr.js',
        'main/assets/lib/angular-i18n/angular-locale_en.js',
        'main/assets/lib/angular-i18n/angular-locale_de.js'
    ],
    vendorCssFiles: [
        'main/assets/lib/font-awesome/css/font-awesome.min.css',
        'main/assets/lib/angular-common/dist/assets/fonts/itesoft-bundle.min.css'
    ]
};