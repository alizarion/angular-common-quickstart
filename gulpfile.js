/**
 * Les dépendences du builder
 */
var pkg = require('./package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var footer = require('gulp-footer');
var clean = require('gulp-clean');
var flatten = require('gulp-flatten');
var buildConfig = require('./build.config.js');
var sh = require('shelljs');
var dedupe = require('gulp-dedupe');
var serve = require('gulp-serve');
var karma = require('gulp-karma');

/**
 * Execute les actions de build dans l'ordre
 */
gulp.task('build', function(callback){
    runSequence('clean',
        'sass',
        'vendor-js',
        'app-js',
        'html',
        'fonts',
        'vendor-css',
        'app-css',
        'images',
        'locales',
        'angular-locales',
        'favicon',
        callback);
});

/**
 *
 * Supression des fichiers du precedent build
 *
 */
gulp.task('clean', function () {
    return gulp.src(['dist/assets','dist/app', 'dist/favicon.ico'],
        {force: true})
        .pipe(clean());
});

/**
 * Compile les fichier scss en css et les dépose dans le répertoire /main/assets/css
 */
gulp.task('sass', function(done) {
    gulp.src('./main/assets/scss/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./main/assets/css'))
        .on('end', done);
});

/**
 * Minifie les fichiers css vendor
 */
gulp.task('vendor-css', function(done) {
    gulp.src(buildConfig.vendorCssFiles)
        .pipe(concat('vendor.css'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./dist/assets/fonts'))
        .on('end', done);
});

/**
 * Minifie les fichiers css applicatifs
 */
gulp.task('app-css', function(done) {
    gulp.src('./main/assets/css/*.css')
        .pipe(concat('app.css'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./dist/assets/css'))
        .on('end', done);
});

/**
 * Concat, minifie et uglut le Javascript applicatif
 */
gulp.task('app-js', function() {
    return gulp.src(buildConfig.appFiles)
        .pipe(concat('app.min.js'))
        .pipe(header(buildConfig.closureStart))
        .pipe(footer(buildConfig.closureEnd))
        .pipe(uglify())
        .pipe(header(buildConfig.banner,{pkg:pkg}))
        .pipe(gulp.dest('dist/app'));
});

/**
 * Concat et Minifie le Javascript des librairies vendor utilisés.
 */
gulp.task('vendor-js', function() {
    return gulp.src(buildConfig.vendorJavascriptFiles)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('dist/assets/lib'));
});

/**
 * Copie des fichiers html de l'application
 *
 */
gulp.task('html', function() {
    gulp.src('./main/app/**/*.html')
        // And put it in the dist folder
        .pipe(gulp.dest('dist/app'));
});

/**
 * Copie des fonts présentes dans les librairies
 */
gulp.task('fonts', function() {
    gulp.src('main/assets/lib/**/*.{eot,svg,ttf,otf,woff,woff2}')
        .pipe(flatten())
        .pipe(dedupe({same: false}))
        .pipe(gulp.dest('./dist/assets/fonts'));
});

/**
 * Copie des images
 */
gulp.task('images', function() {
    gulp.src('./main/assets/img/**/*')
        .pipe(gulp.dest('./dist/assets/img'));
});

/**
 * Copie du favicon
 */
gulp.task('favicon', function() {
    gulp.src('./main/favicon.ico')
        .pipe(gulp.dest('./dist'));
});

/**
 * Copie des langues
 */
gulp.task('locales', function() {
    gulp.src('./main/assets/locale/*/*.json')
        .pipe(gulp.dest('./dist/assets/locale'));
});

/**
 *
 * Copie des locales pour angular $locale
 *
 */
gulp.task('angular-locales', function() {
gulp.src(buildConfig.localeJsFiles)
    .pipe(gulp.dest('./dist/assets/lib/angular-i18n'));
});

gulp.task('serve', serve('main'));

/**
 * Obsérve les modification des scss et compile en css
 */
gulp.task('watch', function() {
    gulp.watch('./main/assets/scss/**/*.scss', ['sass']);
});

/**
 * Lance l'installation des dépendences GIT
 */
gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

/**
 * Check l'installation de GIT
 */
gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

/**
 *
 * Supression des traductions fr
 *
 */
gulp.task('clean-trad-fr', function () {
    return gulp.src('./main/assets/locale/fr/**.json',
        {force: true})
        .pipe(clean());
});

/**
 *
 * Supression des traductions en
 *
 */
gulp.task('clean-trad-en', function () {
    return gulp.src('./main/assets/locale/en/**.json',
        {force: true})
        .pipe(clean());
});

/**
 *
 * Génération des traductions fr (sans nettoyage)
 *
 */
gulp.task('build-trad-fr-only', function () {
    return gulp.src([ '!./main/assets/locale/**-fr.json',
                      '!./main/assets/locale/**-en.json',
                      '!./main/assets/locale/**-de.json',
                      '!./main/assets/locale/fr.json',
                      '!./main/assets/locale/en.json',
                      '!./main/assets/locale/de.json',
                      './main/assets/locale/**.json'])
        .pipe(rename(function (path) {
          path.basename += "-fr";
        }))
        .pipe(gulp.dest('./main/assets/locale/fr'));
});

/**
 *
 * Génération des traductions en (sans nettoyage)
 *
 */
gulp.task('build-trad-en-only', function () {
    return gulp.src([ '!./main/assets/locale/**-fr.json',
                      '!./main/assets/locale/**-en.json',
                      '!./main/assets/locale/**-de.json',
                      '!./main/assets/locale/fr.json',
                      '!./main/assets/locale/en.json',
                      '!./main/assets/locale/de.json',
                      './main/assets/locale/**.json'])
        .pipe(rename(function (path) {
          path.basename += "-en";
        }))
        .pipe(gulp.dest('./main/assets/locale/en'));
});

/**
 * Génération des trads fr (avec nettoyage)
 */
gulp.task('build-trad-fr', function(callback){
    runSequence('clean-trad-fr',
            'build-trad-fr-only',
            callback);
});

/**
 * Génération des trads en (avec nettoyage)
 */
gulp.task('build-trad-en', function(callback){
    runSequence('clean-trad-en',
            'build-trad-en-only',
            callback);
});

/**
 * Test unitaire jasmine
 */
gulp.task('test', function() {

    /**Ajout des fihcier de test **/
    var allVendorFiles = buildConfig.vendorJavascriptFiles.slice();
    allVendorFiles.push('./main/assets/lib/angular-mocks/angular-mocks.js');
    var allAppFiles = buildConfig.appFiles.slice();
    allAppFiles = _removeValueFromArray(allAppFiles,'!main/app/**/*Test.js');
    var testFiles = allVendorFiles.concat(allAppFiles);

    return gulp.src(testFiles)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            console.log(err);
            this.emit('end');
        });
});


/**
 * Génération des trads fr + en
 */
gulp.task('build-trad', function(callback){
    runSequence('build-trad-fr',
            'build-trad-en',
            callback);
});


/**
 * Simple function to remove item from array by value.
 * @param array
 * @returns array without removed items.
 * @private
 */
function _removeValueFromArray(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}