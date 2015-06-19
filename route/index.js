'use strict';
var path = require('path');
var chalk = require('chalk');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
  this.option('uri', {
    desc: 'Allow a custom uri for routing',
    type: String,
    required: false
  });

  var bower = require(path.join(process.cwd(), 'bower.json'));
  var match = require('fs').readFileSync(path.join(
    this.env.options.appPath,
    'scripts/app.' + (this.env.options.coffee ? 'coffee' : 'js')
  ), 'utf-8').match(/\.when/);

  if (
    bower.dependencies['angular-route'] ||
    bower.devDependencies['angular-route'] ||
    match !== null
  ) {
    this.foundWhenForRoute = true;
  }

  this.hookFor('tecnotree-angular:controller');
  this.hookFor('tecnotree-angular:view');
};

util.inherits(Generator, ScriptBase);

Generator.prototype.rewriteAppJs = function () {
  var coffee = this.env.options.coffee;

  if (!this.foundWhenForRoute) {
    this.on('end', function () {
      this.log(chalk.yellow(
        '\nangular-route is not installed. Skipping adding the route to ' +
        'scripts/app.' + (coffee ? 'coffee' : 'js')
      ));
    });
    return;
  }

  this.uri = this.name;
  if (this.options.uri) {
    this.uri = this.options.uri;
  }

  var config = {
    file: path.join(
      this.env.options.appPath,
      'scripts/app.' + (coffee ? 'coffee' : 'js')
    ),
    needle: '// needle:route-generator',
    splicable: [
      "  url:'/" + this.uri + "'" + (coffee ? "" : ","),
      "  templateUrl: 'views/" + this.name.toLowerCase() + ".tpl.html'" + (coffee ? "" : "," ),
      "  controller: '" + this.classedName + "Ctrl'" + (coffee ? "" : ","),
      "  controllerAs: '" + this.name.toLowerCase() + "'"
    ]
  };

  if (coffee) {
    config.splicable.unshift(".state '" + this.name.toLowerCase() + "',");
  }
  else {
    config.splicable.unshift(".state('" + this.name.toLowerCase() + "', {");
    config.splicable.push("})");
  }

  angularUtils.rewriteFile(config);
};
