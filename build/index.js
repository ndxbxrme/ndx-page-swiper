(function() {
  'use strict';
  var e, module;

  module = null;

  try {
    module = angular.module('ndx');
  } catch (error) {
    e = error;
    module = angular.module('ndx-page-swiper', []);
  }

}).call(this);

//# sourceMappingURL=index.js.map
