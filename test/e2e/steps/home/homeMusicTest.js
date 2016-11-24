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

    this.When(/^Empty when$/, function (callback) {
        console.log('Empty when');
        callback();
    });


    this.Then(/^all musics are displayed :$/, function (musics, callback) {
        var test = element.all(by.repeater('item in data')).get(0).getText();
        expect(Promise.resolve(test)).to.eventually.equal('Carlysdd Rae Jepsedgfdsgfgdfgfd').notify(callback);
        var assertions = [];
        //Check text of all cells of musics
        var rows = element.all(by.repeater('item in data').column('item.artist')).then(function (rows) {
            console.log('row = ' + rows);
            console.log('row = ' + rows.length);
            for (var i = 0; i < rows.length; i++) {
                var expected = musics.hashes()[i];
                rows[i].getText().then(function (value) {
                    console.log('value = ' + value);
                    console.log('expected.artist = ' + expected.artist);
                    assertions.push(expect(Promise.resolve(value)).to.eventually.equal(expected.artist));

                });
                console.log('after promise');
            }
            Promise.all(assertions).then(function (values) {
                console.log(values);
                callback();
            });

        }, function (err) {
            console.log('error = ' + err);
            callback(err);
        });
    });

};
