'use strict'
module = null
try
  module = angular.module 'ndx'
catch e
  module = angular.module 'ndx', []
module.factory 'SwiperPage', ->
  page = 0
  getPage: ->
    page
  setPage: (_page) ->
    page = _page
module.directive 'swiper', ($timeout, SwiperPage, $state, $window) ->
  restrict: 'AE'
  transclude: true
  template: '<div class="ndx-swiper-inner"><ng-transclude></ng-transclude></div>'
  scope:
    page: '=?'
    nopages: '=?'
    change: '=?'
  link: (scope, elem, attrs) ->
    bodySelector = 'html, body'
    if $window.navigator.userAgent.match /(iPod|iPhone|iPad|Android)/
      bodySelector = 'body'
    name = attrs.name
    scope.page = scope.page or 0
    setPage = (page, immediate) ->
      #$timeout ->
      if page < 0
        page = 0
      if page > scope.nopages - 1
        page = scope.nopages - 1
      if not immediate
        swiper
        .addClass 'animate'
        .removeClass 'dragging'
      else
        swiper
        .removeClass 'animate'
        .removeClass 'dragging'
      swiper
      .css
        transform: 'translate3d(' + -100 * page + '%, 0, 0)'
      $timeout ->
        oldPage = SwiperPage.getPage()
        scope.page = page
        if oldPage isnt scope.page
          newstate = null
          for state in $state.get()
            if state.params and state.params.page is page
              newstate = state
          if newstate and newstate.name isnt $state.current.name
            $timeout ->
              $state.go newstate.name
            , 500
          SwiperPage.setPage scope.page
          scope.change? scope.page
          if $(bodySelector).scrollTop()
            $(bodySelector).animate
              scrollTop: 0
            , 400
    if name
      scope.$parent[name] =
        goToPage: (page) ->
          setPage page
        goImmediate: (page) ->
          setPage page, true
    $ elem[0]
    .addClass 'ndx-swiper'
    swiper = $ '.ndx-swiper-inner', elem[0]
    $timeout ->
      scope.nopages = scope.nopages or $('ng-transclude', swiper).children().length
      console.log swiper.children().length
    swiper
    .css
      transform: 'translate3d(' + -100 * scope.page + '%, 0, 0)'
    setPage SwiperPage.getPage(), true
    hammerSwiper = new Hammer elem[0]
    hammerSwiper.get 'pan'
    .set
      direction: Hammer.DIRECTION_HORIZONTAL
      threshold: 60
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