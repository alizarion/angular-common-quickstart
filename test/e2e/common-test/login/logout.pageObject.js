var LogoutPage = function() {

    this.logout = function() {
        this.buttonAdmin = element(by.id('admin-link'));
        this.buttonAdmin.click();
        this.button = element(by.id('disconnect-link'));
        console.log("Logout from DataEditor...");
        this.button.click();
        console.log("Logout from DataEditor Done.");
    };
};
module.exports = LogoutPage;
