'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

module.exports = function () {

    this.Given(/^I am on Music Manager login page$/, function () {
        browser.get('http://localhost:4000');
    });

    this.When(/^I enter username as "([^"]*)"$/, function (login, callback) {
        element(by.model('loginData.login')).sendKeys(login);
        callback();
    });

    this.When(/^I enter password as "([^"]*)"$/, function (password, callback) {
        element(by.model('loginData.password')).sendKeys(password);
        callback();
    });

    this.When(/^I validate my credentials$/, function (callback) {
        element(by.buttonText('Connexion')).click();
        callback();
    });

    this.Then(/^Login should success$/, function (callback) {
        expect(browser.getLocationAbsUrl()).to.eventually.equal('/music/poprock').notify(callback);

    });

};
