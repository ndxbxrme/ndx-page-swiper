(function() {
  'use strict';
  var e, module;

  module = null;

  try {
    module = angular.module('ndx');
  } catch (error) {
    e = error;
    module = angular.module('ndx', []);
  }

  module.directive('swiper', function($timeout) {
    return {
      restrict: 'AE',
      scope: {
        page: '=?',
        nopages: '=?',
        change: '=?'
      },
      link: function(scope, elem, attrs) {
        var hammerSwiper, name, setPage, swiper, x;
        name = attrs.name;
        scope.page = scope.page || 0;
        setPage = function(page) {
          return $timeout(function() {
            var oldPage;
            oldPage = scope.page;
            scope.page = page;
            if (scope.page < 0) {
              scope.page = 0;
            }
            if (scope.page > scope.nopages - 1) {
              scope.page = scope.nopages - 1;
            }
            swiper.addClass('animate').removeClass('dragging').css({
              transform: 'translate3d(' + -100 * scope.page + '%, 0, 0)'
            });
            if (oldPage !== scope.page) {
              if (typeof scope.change === "function") {
                scope.change(scope.page);
              }
              if ($('html, body').scrollTop()) {
                return $('html, body').animate({
                  scrollTop: 0
                }, 400);
              }
            }
          });
        };
        if (name) {
          scope.$parent[name] = {
            goToPage: function(page) {
              return setPage(page);
            }
          };
        }
        swiper = $(elem[0]);
        scope.nopages = scope.nopages || swiper.children().length;
        swiper.addClass('ndx-swiper').css({
          transform: 'translate3d(' + -100 * scope.page + '%, 0, 0)'
        });
        hammerSwiper = new Hammer(elem[0]);
        hammerSwiper.get('pan').set({
          direction: Hammer.DIRECTION_HORIZONTAL,
          threshold: 100
        });
        x = 0;
        return hammerSwiper.on('panstart', function() {
          return swiper.removeClass('animate').addClass('dragging');
        }).on('panleft panright panup pandown', function(e) {
          x = parseInt(e.deltaX) / swiper[0].clientWidth * 100;
          return swiper.css({
            transform: 'translate3d(' + ((-100 * scope.page) + x) + '%, 0, 0)'
          });
        }).on('panend', function() {
          var page;
          page = scope.page;
          if (x < -50) {
            page++;
          }
          if (x > 50) {
            page--;
          }
          return setPage(page);
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=index.js.map
