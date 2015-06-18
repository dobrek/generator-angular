'use strict';

describe('Controller: <%= classedName %>Ctrl', function () {

  // load the controller's module
  beforeEach(module('<%= scriptAppName %>'));

  var <%= classedName.split('.').join('_') %>Ctrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    <%= classedName.split('.').join('_') %>Ctrl = $controller('<%= classedName %>Ctrl', {
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(<%= classedName.split('.').join('_') %>Ctrl.awesomeThings.length).toBe(3);
  });
});
