'use strict'
module = null
try
  module = angular.module 'ndx'
catch e
  module = angular.module 'ndx', []
moodule.directive 'swiper', ($timeout) ->
  restrict: 'AE'
  scope:
    page: '='
    nopages: '='
    change: '='
  link: (scope, elem, attrs) ->
    name = attrs.name
    setPage = (page) ->
      $timeout ->
        oldPage = scope.page
        scope.page = page
        if scope.page < 0
          scope.page = 0
        if scope.page > scope.nopages - 1
          scope.page = scope.nopages - 1
        swiper
        .addClass 'animate'
        .removeClass 'dragging'
        .css
          transform: 'translate3d(' + -100 * scope.page + '%, 0, 0)'
        if oldPage isnt scope.page
          scope.change scope.page
          if $('html, body').scrollTop()
            $('html, body').animate
              scrollTop: 0
            , 400
    if name
      scope.$parent[name] =
        goToPage: (page) ->
          setPage page
    swiper = $ elem[0]
    swiper
    .addClass 'ndx-swiper'
    .css
      transform: 'translate3d(' + -100 * scope.page + '%, 0, 0)'
    hammerSwiper = new Hammer elem[0]
    hammerSwiper.get 'pan'
    .set
      direction: Hammer.DIRECTION_HORIZONTAL
      threshold: 100
    x = 0
    hammerSwiper
    .on 'panstart', ->
      swiper
      .removeClass 'animate'
      .addClass 'dragging'
    .on 'panleft panright panup pandown', (e) ->
      x = parseInt(e.deltaX) / swiper[0].clientWidth * 100
      swiper.css
        transform: 'translate3d(' + ((-100 * scope.page) + x) + '%, 0, 0)'
    .on 'panend', ->
      page = scope.page
      if x < -50
        page++
      if x > 50
        page--
      setPage page