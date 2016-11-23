'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

module.exports = function () {

    this.Given(/^I am on Music Manager login page$/, function () {
        /*browser.get(this, 'http://localhost:4000', function (result) {
         setTimeout(callback, 1000);
         });*/
        browser.get('http://localhost:4000');
        console.log("Given step!");
    });

    this.When(/^I enter username as "([^"]*)"$/, function (login, callback) {
        element(by.model('loginData.login')).sendKeys(login);
        //this.World.meow();
        callback();
    });

    this.When(/^I enter password as "([^"]*)"$/, function (password, callback) {
        element(by.model('loginData.password')).sendKeys(password);
        callback();
    });

    this.When(/^I click on login button$/, function (callback) {
        element(by.buttonText('Connexion')).click();
        callback();
    });

    this.Then(/^Login should success$/, function (callback) {
        expect(browser.getLocationAbsUrl()).to.eventually.equal('/music/poprock4564848484').notify(callback);
    });

};
