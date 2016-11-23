(function (module) {
    var World,
        chai,
        chaiAsPromised;
    chai = require('chai');
    chaiAsPromised = require('chai-as-promised');


    // cucumber world
    World = function () {
        this.World = function () {

            /**
             * the chai assertion lib
             * @type {object}
             */
            this.expect = chai.expect;


        };
    };

    module.exports = World;
}(module));