var Screenshot = require('./screenshot');

module.exports = function TakeScreenshot() {

    var screenshot = new Screenshot();
    this.After(function (scenario, callback) {
        if (scenario.isFailed()) {
            console.log('Scenario failed, take screenshot ');
            screenshot.takeScreenshot().then(function (image) {
                screenshot.attachToScenario(image, scenario).then(function () {
                    console.log('image attached to scenario! took!');
                    callback();
                });
            });
        } else {
            callback();
        }
    });
};