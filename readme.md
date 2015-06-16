# Tecnotree AngularJS generator

> Yeoman generator for AngularJS with TT-UI library - lets you quickly set up a project with sensible defaults and best practices.

This project is forked from yeoman/generator-angular(https://github.com/yeoman/generator-angular). See documentation for more details.

## Usage

For step-by-step instructions on using Yeoman and this generator to build a TODO AngularJS application from scratch see [this tutorial.](http://yeoman.io/codelab/)

Install Node.js using the manual on [https://nodejs.org/](https://nodejs.org/)

Run terminal to ensure if Node works properly. You should see version numbers in answer for following commands.
```
    node --version 
    npm --version
```

Install tools: Grunt `grunt-cli`, Bower `bower` and Yeoman `yo` globally
```
    npm install -g grunt-cli bower yo
```

Ensure whether everything works fine:
```
grunt --version
bower --version
yo --version
```

Install Angular Generator with TT UI Lib
```
npm install https://github.com/dobrek/generator-tecnotree-angular.git
```

Create directory for your new project and get into it
```
mkdir my-new-project && cd my-new-project
```

Run `yo tecnotree-angular`, optionally passing an app name:
```
yo tecnotree-angular [MyNewApp]
```

Choose whether you want to utilize Sass in your application, then select desired languages and default language. Or just hit enter to use default options (use Sass, language: en). 

Wait several minutes till the installation process ends.

Run project by typing `grunt serve`

As soon as `Waiting...` info appears in terminal, open a web browser and navigate to [http://localhost:9000/](http://localhost:9000/)

## Generators

Available generators:

* [tecnotree-angular](#app) (aka [tecnotree-angular:app](#app))
* [tecnotree-angular:controller](#controller)
* [tecnotree-angular:directive](#directive)
* [tecnotree-angular:filter](#filter)
* [tecnotree-angular:route](#route)
* [tecnotree-angular:service](#service)
* [tecnotree-angular:provider](#service)
* [tecnotree-angular:factory](#service)
* [tecnotree-angular:value](#service)
* [tecnotree-angular:constant](#service)
* [tecnotree-angular:decorator](#decorator)
* [tecnotree-angular:view](#view)

### App
Sets up a new AngularJS app, generating all the boilerplate you need to get started.

Example:
```bash
yo tecnotree-angular
```

### Route
Generates a controller and view, and configures a route in `app/scripts/app.js` connecting them.

Example:
```bash
yo tecnotree-angular:route myroute
```

Produces `app/scripts/controllers/myroute.js`:
```javascript
angular.module('myMod').controller('MyrouteCtrl', function () {
  // ...
});
```

Produces `app/views/myroute.html`:
```html
<p>This is the myroute view</p>
```

**Explicitly provide route URI**

Example:
```bash
yo tecnotree-angular:route myRoute --uri=my/route
```

Produces controller and view as above and adds a route to `app/scripts/app.js`
with URI `my/route`

### Controller
Generates a controller in `app/scripts/controllers`.

Example:
```bash
yo tecnotree-angular:controller user
```

Produces `app/scripts/controllers/user.js`:
```javascript
angular.module('myMod').controller('UserCtrl', function () {
  // ...
});
```
### Directive
Generates a directive in `app/scripts/directives`.

Example:
```bash
yo tecnotree-angular:directive myDirective
```

Produces `app/scripts/directives/myDirective.js`:
```javascript
angular.module('myMod').directive('myDirective', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      element.text('this is the myDirective directive');
    }
  };
});
```

### Filter
Generates a filter in `app/scripts/filters`.

Example:
```bash
yo tecnotree-angular:filter myFilter
```

Produces `app/scripts/filters/myFilter.js`:
```javascript
angular.module('myMod').filter('myFilter', function () {
  return function (input) {
    return 'myFilter filter:' + input;
  };
});
```

### View
Generates an HTML view file in `app/views`.

Example:
```bash
yo tecnotree-angular:view user
```

Produces `app/views/user.html`:
```html
<p>This is the user view</p>
```

### Service
Generates an AngularJS service.

Example:
```bash
yo tecnotree-angular:service myService
```

Produces `app/scripts/services/myService.js`:
```javascript
angular.module('myMod').service('myService', function () {
  // ...
});
```

You can also do `yo tecnotree-angular:factory`, `yo tecnotree-angular:provider`, `yo tecnotree-angular:value`, and `yo tecnotree-angular:constant` for other types of services.

### Decorator
Generates an AngularJS service decorator.

Example:
```bash
yo tecnotree-angular:decorator serviceName
```

Produces `app/scripts/decorators/serviceNameDecorator.js`:
```javascript
angular.module('myMod').config(function ($provide) {
    $provide.decorator('serviceName', function ($delegate) {
      // ...
      return $delegate;
    });
  });
```

## Options
In general, these options can be applied to any generator, though they only affect generators that produce scripts.

### CoffeeScript
For generators that output scripts, the `--coffee` option will output CoffeeScript instead of JavaScript.

For example:
```bash
yo tecnotree-angular:controller user --coffee
```

Produces `app/scripts/controller/user.coffee`:
```coffeescript
angular.module('myMod')
  .controller 'UserCtrl', ($scope) ->
```

A project can mix CoffeScript and JavaScript files.

To output JavaScript files, even if CoffeeScript files exist (the default is to output CoffeeScript files if the generator finds any in the project), use `--coffee=false`.

### Minification Safe

**tl;dr**: You don't need to write annotated code as the build step will
handle it for you.

By default, generators produce unannotated code. Without annotations, AngularJS's DI system will break when minified. Typically, these annotations that make minification safe are added automatically at build-time, after application files are concatenated, but before they are minified. The annotations are important because minified code will rename variables, making it impossible for AngularJS to infer module names based solely on function parameters.

The recommended build process uses `ng-annotate`, a tool that automatically adds these annotations. However, if you'd rather not use it, you have to add these annotations manually yourself. Why would you do that though? If you find a bug
in the annotated code, please file an issue at [ng-annotate](https://github.com/olov/ng-annotate/issues).


### Add to Index
By default, new scripts are added to the index.html file. However, this may not always be suitable. Some use cases:

* Manually added to the file
* Auto-added by a 3rd party plugin
* Using this generator as a subgenerator

To skip adding them to the index, pass in the skip-add argument:
```bash
yo tecnotree-angular:service serviceName --skip-add
```

## Bower Components

The following packages are always installed by the [app](#app) generator:

* angular
* angular-mocks

<!---
The following additional modules are available as components on bower, and installable via `bower install`:

* angular-animate
* angular-aria
* angular-cookies
* angular-messages
* angular-resource
* angular-sanitize

All of these can be updated with `bower update` as new versions of AngularJS are released.
-->
`json3` and `es5-shim` have been removed as Angular 1.3 has dropped IE8 support and that is the last version that needed these shims. If you still require these, you can include them with: `bower install --save json3 es5-shim`. `wiredep` should add them to your index.html file but if not you can manually add them.

## Configuration
Yeoman generated projects can be further tweaked according to your needs by modifying project files appropriately.

### Output
You can change the `app` directory by adding a `appPath` property to `bower.json`. For instance, if you wanted to easily integrate with Express.js, you could add the following:

```json
{
  "name": "yo-test",
  "version": "0.0.0",
  ...
  "appPath": "public"
}

```
This will cause Yeoman-generated client-side files to be placed in `public`.

Note that you can also achieve the same results by adding an `--appPath` option when starting generator:
```bash
yo tecnotree-angular [app-name] --appPath=public
```

## Testing

Running `grunt test` will run the unit tests with karma.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a PR, make sure that the commit messages match the [AngularJS conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/).

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/yeoman/generator-angular/releases)

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)