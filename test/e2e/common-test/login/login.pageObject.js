var LoginPage = function () {


    this.login = function (login, password) {

        console.log("Connecting to Music Manager ...");
        this.login = element(by.model('loginData.login'));
        this.password = element(by.model('loginData.password'));
        this.button = element(by.buttonText('Connexion'));

        this.login.sendKeys(login);
        this.password.sendKeys(password);
        this.button.click();

        console.log("Connecting to Music Manager Done.");
    };
};
module.exports = LoginPage;
