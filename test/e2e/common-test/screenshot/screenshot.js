var Screenshot = function () {
    var self = this;

    /**
     * Task a screenshot
     * @param scenario
     * @returns {*}
     */
    this.takeScreenshot = function () {
        var deferred = protractor.promise.defer();
        browser.takeScreenshot().then(function (png) {
            var decodedImage = new Buffer(png, 'base64');
            deferred.fulfill(decodedImage);
        }, function (error) {
            console.log(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.attachToScenario = function (decodedImage, scenario) {
        var deferred = protractor.promise.defer();
        if (scenario == null || typeof scenario === 'undefined') {
            var error = 'Scenario provided is null or undefined';
            console.log(error);
            deferred.reject(error);
        } else if (decodedImage == null || typeof decodedImage === 'undefined') {
            var error = 'Decoded image provided is null or undefined';
            console.log(error);
            deferred.reject(error);
        } else {
            scenario.attach(decodedImage, 'image/png');
            deferred.fulfill(decodedImage);
        }

        return deferred.promise;
    }
};
module.exports = Screenshot;
