'use strict';

var LoginPage = require('./../../common-test/login/login.pageObject');


var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;
var loginPage = new LoginPage();

module.exports = function () {

    this.Given(/^User is on the Home page$/, function (callback) {
        browser.get('http://localhost:4000');
        loginPage.login('admin', 'admin');

        callback();
    });

    this.When(/^Test$/, function (callback) {
        console.log('Test ');
        callback();
    });


    this.Then(/^all music are displayed :$/, function (musics, callback) {

        callback();
    });

};
