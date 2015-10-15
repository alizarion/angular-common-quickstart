
#Build & Run
##Prérequis

git avec prise en charge du prompt sous windows.

npm. testé et validé avec la version [0.12.2 de nodejs](https://nodejs.org/dist/v0.12.2/).

installer bower et gulp en globale :

        npm install bower -g
        npm install gulp -g
        
##Build

        npm install 
        bower install
        gulp build

##Run
        gulp serve
        
démarre un serveur http sur le [port 3000](http://localhost:3000/).



## Directory structure

Since a large AngularJS application has many components it's best to structure it in a directory hierarchy.

                .
                |--- index.html
                |--- app
                |   |--- app.module.js
                |   |--- app.route.js
                |   |--- app.template.html
                |   |--- common
                |   |   |--- controllers
                |   |   |--- directives
                |   |   |--- filters
                |   |   --- services
                |    --- features
                |       |--- firstFeature
                |       |   |--- home
                |       |   |   |--- firstController.js
                |       |   |   |--- secondController.js
                |       |   |   |--- directive1Directive.js
                |       |   |   |--- filter1Filter.js
                |       |   |   |--- filter2Filter.js
                |       |   |   |--- resource1Resource.js
                |       |   |   |--- service1Service.js
                |       |   |   |--- service2Service.js
                |       |   |--- about
                |       |       |--- ThirdController.js
                |       |       |--- directive2Directive.js
                |       |       |--- directive3.js
                |       |       |--- filter3.js
                |       |       |--- service3Service.js
                |        --- secondFeature
                |           |--- users
                |               |--- fourthController.js
                |               |--- directive4.js
                |               |--- filter5.js
                |               |--- resource2Resource.js
                |               |--- service4Service.js
                |               |--- service5.js
                --- assets
                    |--- css
                    |--- fonts
                    |--- img
                    |--- js
                    |--- lib
                    |--- locale
                    |--- scss
                    
                    
## Others

* Use:
    * `$timeout` instead of `setTimeout`
    * `$interval` instead of `setInterval`
    * `$window` instead of `window`
    * `$document` instead of `document`
    * `$http` instead of `$.ajax`   
    
This will make your testing easier and in some cases prevent unexpected behaviou

# Controllers
* The naming of the controller is done using the controller's    
* Name your  directives file with lowerCamelCase[Controller.js].
* The naming of the controller is done using the controller's functionality (for example shopping cart, homepage, admin panel) and the substring `Controller` in the end.
* Controllers are plain javascript so they will be named UpperCamelCase (`HomePageController`, `ShoppingCartController`, `AdminPanelController`, etc.).

# Directives

* Name your directives with lowerCamelCase.
* Name your directive files with lowerCamelCase[Directive.js].
* Use `scope` instead of `$scope` in your link function. In the compile, post/pre link functions you have already defined arguments which will be passed when the function is invoked, you won't be able to change them using DI. This style is also used in AngularJS's source code.
* Use `pm` prefixe for your directives to prevent name collisions with third-party libraries, and end with `Directive.js`  ex :  `pmDropdownDirective.js`
* Do not use `ng`, `ui` or `it` prefixes since they are reserved for AngularJS and AngularJS UI and itesoft-angular-common.
* DOM manipulations must be done only through directives.
* Create an isolated scope when you develop reusable components.
* Use directives as attributes or elements instead of comments or classes, this will make your code more readable.
* Use `scope.$on('$destroy', fn)` for cleaning up. This is especially useful when you're wrapping third-party plugins as directives.

# Filters

* Name your filters with lowerCamelCase.
* Name your filter  files  with lowerCamelCase[Filter.js].
* Make your filters as light as possible. They are called often during the `$digest` loop so creating a slow filter will slow down your app.
* Do a single thing in your filters, keep them coherent. More complex manipulations can be achieved by piping existing filters.

# Services
* Name your service files with lowerCamelCase[Service.js].
* Use camelCase to name your services.
  * UpperCamelCase (PascalCase) for naming your services, used as constructor functions i.e.:

                    function MainCtrl($scope, User) {
                      $scope.user = new User('foo', 42);
                    }
                
                    module.controller('MainCtrl', MainCtrl);
                
                    function User(name, age) {
                      this.name = name;
                      this.age = age;
                    }
                
                    module.factory('User', function () {
                      return User;
                    });

  * lowerCamelCase for all other services.

* Encapsulate all the business logic in services. Prefer using it as your `model`.
