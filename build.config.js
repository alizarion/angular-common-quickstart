/**
 * Configuration du projet.
 */
var pkg = require('./package.json');


module.exports = {
    dist: 'dist',
    /**
     * Header de la distribution.
     */
    banner: '/*!\n' +
    ' * Copyright 2015 itesoft.\n' +
    ' * http://itesoft.com/\n' +
    ' *\n' +
    ' * <%= pkg.name %>, v<%= pkg.version %>\n' +
    ' * A powerful music manager.*/\n',

    closureStart: '(function() {var RELEASE_VERSION="1.0.0";\n',
    closureEnd: '\n})();',

    distFolder: 'dist',
    srcFolder: 'main',
    testFolder: 'test',
    reportFolder: 'report',

    /**
     * Liste des fichiers JS de l'application qui seront minifier pour la prod.
     */
    appFiles: [
        '!main/app/**/*Test.js',// Exclude test files
        'main/app/app.module.js',
        'main/app/**/*.js'
    ],


    excludeFromAppDist: {

        unitTest: [
            'test/unit/**/*Test.js'
        ],
        e2e: [
            'test/e2e/**/*.feature'
        ],
        e2eReportSite: 'report/site',
        e2eJsonReportOutputFile: ['report/report.json'],
        unminifiedDistFiles: [
            'main/**/pdf.js',
            'main/**/pdf.worker.js',
            'main/**/tiff.min.js'
        ]
    },

    excludedFilePattern: function () {
        var result = [];
        for (var key  in this.excludeFromAppDist) {
            for (var i = 0; i < this.excludeFromAppDist[key].length; i++) {
                result.push('!' + this.excludeFromAppDist[key][i]);
            }
        }
        return result;
    },
    /**
     * Liste des librairies minifié à utiliser en prod
     */
    vendorJavascriptFiles: [
        'main/assets/lib/angular-common/dist/assets/lib/vendor.min.js',
        'main/assets/lib/angular-common/dist/app/itesoft.min.js',
        'main/assets/lib/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
        'main/assets/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js'
    ],
    assetsDistFiles: [
        '!main/assets/lib/**/*.js',
        '!main/assets/lib/**/*.html',
        '!main/assets/lib/**/*.md',
        '!main/assets/lib/**/*.txt',
        '!main/assets/lib/**/*.json',
        '!main/assets/css/**/*',
        '!main/assets/scss/**/*.scss',
        '!main/assets/scss/**/*.less',
        'main/assets/**/*'
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
        'main/assets/lib/angular-common/dist/assets/fonts/itesoft-default-bundle.min.css'
    ]
};
