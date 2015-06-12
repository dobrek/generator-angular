'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var wiredep = require('wiredep');
var chalk = require('chalk');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

  this.option('app-suffix', {
    desc: 'Allow a custom suffix to be added to the module name',
    type: String
  });
  this.env.options['app-suffix'] = this.options['app-suffix'];
  this.scriptAppName = this.appname + angularUtils.appName(this);

  args = ['main'];

  if (typeof this.env.options.appPath === 'undefined') {
    this.option('appPath', {
      desc: 'Allow to choose where to write the files'
    });

    this.env.options.appPath = this.options.appPath;

    if (!this.env.options.appPath) {
      try {
        this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
      } catch (e) {}
    }
    this.env.options.appPath = this.env.options.appPath || 'app';
    this.options.appPath = this.env.options.appPath;
  }

  this.appPath = this.env.options.appPath;

  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee', {
      desc: 'Generate CoffeeScript instead of JavaScript'
    });

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.appPath, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  this.hookFor('tecnotree-angular:common', {
    args: args
  });

  this.hookFor('tecnotree-angular:main', {
    args: args
  });

  this.hookFor('tecnotree-angular:controller', {
    args: args
  });

  this.on('end', function () {
    var jsExt = this.options.coffee ? 'coffee' : 'js';

    var bowerComments = [
      'bower:js',
      'endbower'
    ];
    if (this.options.coffee) {
      bowerComments.push('bower:coffee');
      bowerComments.push('endbower');
    }

    this.invoke('karma:app', {
      options: {
        'skip-install': this.options['skip-install'],
        'base-path': '../',
        'coffee': this.options.coffee,
        'travis': true,
        'files-comments': bowerComments.join(','),
        'app-files': 'app/scripts/**/*.' + jsExt,
        'test-files': [
          'test/mock/**/*.' + jsExt,
          'test/spec/**/*.' + jsExt
        ].join(','),
        'bower-components-path': 'bower_components'
      }
    });

    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-message'],
      callback: this._injectDependencies.bind(this)
    });

    if (this.env.options.ngRoute) {
      this.invoke('tecnotree-angular:route', {
        args: ['about']
      });
    }
  });

  this.pkg = require('../package.json');
  this.sourceRoot(path.join(__dirname, '../templates/common'));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  if (!this.options['skip-welcome-message']) {
    this.log(yosay());
    this.log(
      chalk.magenta(
        'Out of the box I include Bootstrap and some AngularJS recommended modules.' +
        '\n'
      )
    );
  }

  if (this.options.minsafe) {
    this.log.error(
      'The --minsafe flag has been removed. For more information, see' +
      '\nhttps://github.com/dobrek/generator-tecnotree-angular#minification-safe.' +
      '\n'
    );
  }
};

Generator.prototype.askForCompass = function askForCompass() {
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'compass',
    message: 'Would you like to use Sass?',
    default: true
  }], function (props) {
    this.compass = props.compass;
    
    // Install Bootstrap by default
    this.bootstrap = true;
    // Install Sass version of Bootstrap 
    this.compassBootstrap = props.compass;

    cb();
  }.bind(this));
};

Generator.prototype.askForLanguages = function askForLanguages() {
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'languages',
    message: 'Which languages would you like to use?',
    choices: [
    {
      value: 'en',
      name: 'English',
      checked: true
    }, {
      value: 'fr',
      name: 'Français',
      checked: false
    }, {
      value: 'pl',
      name: 'Polski',
      checked: false
    }
    ]
  }];

  this.prompt(prompts, function (props) {
    this.availableLanguages = props.languages;

    for (var i = this.availableLanguages.length - 1; i >= 0; i--) {
        this.template('app/langs/_lang.json', 'app/langs/lang-'+ this.availableLanguages[i] +'.json');
    };

    cb();
  }.bind(this));
};

Generator.prototype.readIndex = function readIndex() {
  this.ngRoute = this.env.options.ngRoute;
  this.indexFile = this.engine(this.read('app/index.html'), this);
};

Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  var cssFile = 'styles/main.' + (this.compass ? 's' : '') + 'css';
  this.copy(
    path.join('app', cssFile),
    path.join(this.appPath, cssFile)
  );
};

Generator.prototype.appJs = function appJs() {
  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/scripts.js',
    sourceFileList: ['scripts/app.js', 'scripts/controllers/main.js'],
    searchPath: ['.tmp', this.appPath]
  });
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.indexFile = this.indexFile.replace(/&apos;/g, "'");
  this.write(path.join(this.appPath, 'index.html'), this.indexFile);
};

Generator.prototype.packageFiles = function packageFiles() {
  this.coffee = this.env.options.coffee;
  this.template('root/_bower.json', 'bower.json');
  this.template('root/_bowerrc', '.bowerrc');
  this.template('root/_package.json', 'package.json');
  this.template('root/_Gruntfile.js', 'Gruntfile.js');
  this.template('root/README.md', 'README.md');
};

Generator.prototype._injectDependencies = function _injectDependencies() {
  if (this.options['skip-install']) {
    this.log(
      'After running `npm install & bower install`, inject your front end dependencies' +
      '\ninto your source code by running:' +
      '\n' +
      '\n' + chalk.yellow.bold('grunt wiredep')
    );
  } else {
    this.spawnCommand('grunt', ['wiredep']);
  }
};
