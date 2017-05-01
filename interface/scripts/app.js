require('nw.gui').Window.get().showDevTools();
nw.Screen.Init();

(function (document) {
  'use strict';

  var app = document.querySelector('#app');

  app.baseUrl = '/';
  if (window.location.port === '') {
  }
  app.addEventListener('dom-change', function () {
    console.log('Our app is ready to rock!');
  });

  window.addEventListener('WebComponentsReady', function () {
      setTimeout(function () {
        console.log('initialized');
      }, 400);
  });

})(document);
