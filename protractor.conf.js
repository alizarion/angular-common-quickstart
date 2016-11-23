exports.config = {
    allScriptsTimeout: 11000,
    multiCapabilities: [/*{
     'browserName': 'firefox'
     },*/ {
        'browserName': 'chrome'
    }],
    baseUrl: 'http://localhost:4000/',
    // set to "custom" instead of cucumber.
    framework: 'custom',
    // path relative to the current config file
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    // require feature files
    specs: [
        'test/e2e/features/**/*.feature'
    ],
    cucumberOpts: {
        // require step definitions
        require: ['test/e2e/steps/**/*.js', 'test/e2e/common-test/**/*.js',],
        format: 'json'
    }
};