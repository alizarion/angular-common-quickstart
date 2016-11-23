'use strict';
describe('MusicManager:unit Test', function () {


    // load the service's module
    beforeEach(module('itesoft'));
    beforeEach(module('MusicManager'));


    it('CurrentUser.fn.getDisplayName', inject(function (CurrentUser) {
        console.log("In test");
    }));
});