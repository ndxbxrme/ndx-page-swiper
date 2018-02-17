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

  module.factory('SwiperPage', function() {
    var page;
    page = 0;
    return {
      getPage: function() {
        return page;
      },
      setPage: function(_page) {
        return page = _page;
      }
    };
  });

  module.directive('swiper', function($timeout, SwiperPage, $state, $window) {
    return {
      restrict: 'AE',
      transclude: true,
      template: '<div class="ndx-swiper-inner"><ng-transclude></ng-transclude></div>',
      scope: {
        page: '=?',
        nopages: '=?',
        change: '=?'
      },
      link: function(scope, elem, attrs) {
        var bodySelector, hammerSwiper, name, setPage, swiper, x;
        bodySelector = 'html, body';
        if ($window.navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
          bodySelector = 'body';
        }
        name = attrs.name;
        scope.page = scope.page || 0;
        setPage = function(page, immediate) {
          //$timeout ->
          if (page < 0) {
            page = 0;
          }
          if (page > scope.nopages - 1) {
            page = scope.nopages - 1;
          }
          if (!immediate) {
            swiper.addClass('animate').removeClass('dragging');
          } else {
            swiper.removeClass('animate').removeClass('dragging');
          }
          swiper.css({
            transform: 'translate3d(' + -100 * page + '%, 0, 0)'
          });
          return $timeout(function() {
            var i, len, newstate, oldPage, ref, state;
            oldPage = SwiperPage.getPage();
            scope.page = page;
            if (oldPage !== scope.page) {
              newstate = null;
              ref = $state.get();
              for (i = 0, len = ref.length; i < len; i++) {
                state = ref[i];
                if (state.params && state.params.page === page) {
                  newstate = state;
                }
              }
              if (newstate && newstate.name !== $state.current.name) {
                $timeout(function() {
                  return $state.go(newstate.name);
                }, 500);
              }
              SwiperPage.setPage(scope.page);
              if (typeof scope.change === "function") {
                scope.change(scope.page);
              }
              if ($(bodySelector).scrollTop()) {
                return $(bodySelector).animate({
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
            },
            goImmediate: function(page) {
              return setPage(page, true);
            }
          };
        }
        $(elem[0]).addClass('ndx-swiper');
        swiper = $('.ndx-swiper-inner', elem[0]);
        $timeout(function() {
          scope.nopages = scope.nopages || $('ng-transclude', swiper).children().length;
          return console.log(swiper.children().length);
        });
        swiper.css({
          transform: 'translate3d(' + -100 * scope.page + '%, 0, 0)'
        });
        setPage(SwiperPage.getPage(), true);
        hammerSwiper = new Hammer(elem[0]);
        hammerSwiper.get('pan').set({
          direction: Hammer.DIRECTION_HORIZONTAL,
          threshold: 60
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
