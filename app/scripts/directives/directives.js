'use strict';

angular.module('Directives', [])
.directive('ngAdapt', [ '$window', '$rootScope', function($window, $rootScope) {
	return {
		scope: {
			num: '=px'
		},
		link: function(scope, element) {
			function getScrollbarWidth() {
				var outer = document.createElement('div');
				outer.style.visibility = 'hidden';
				outer.style.width = '100px';
				outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

				document.body.appendChild(outer);

				var widthNoScroll = outer.offsetWidth;
				// force scrollbars
				outer.style.overflow = 'scroll';

				// add innerdiv
				var inner = document.createElement('div');
				inner.style.width = '100%';
				outer.appendChild(inner);

				var widthWithScroll = inner.offsetWidth;

				// remove divs
				outer.parentNode.removeChild(outer);

				return widthNoScroll - widthWithScroll;
			}
			var win = angular.element($window);
			$rootScope.$watch('windowSize.width', function(newVal){
				if(newVal > 767){
					scope.num = 128;
					angular.element(element).css('width', newVal - scope.num - getScrollbarWidth());
				}
				else{
					scope.num = 0;
					angular.element(element).css('width', '100%');
				}
			});
			win.bind('resize', function(){
				$rootScope.$apply(function(){
						//15px to balance the difference in the beginning (due to scrollbar)
						$rootScope.windowSize.width = win.width() + getScrollbarWidth();
						$rootScope.windowSize.height = win.height();
					});
			});
		}
	};
}])
.directive('twitterTimeline', [function() {
	return {
		restrict: 'A',
		scope: {
			cssUrl: '@',
			autoResize: '='
		},
		link: function (scope, element, attrs) {
			angular.element('body').removeAttr('data-twttr-rendered');

			element
			.attr('id', 'twitter-feed')
			.attr('width', '100%' || attrs.width)
			.attr('data-chrome', 'noheader transparent')
			.attr('data-widget-id', attrs.twitterTimeline)
			.addClass('twitter-timeline');

			function render() {
				var body = angular.element('.twitter-timeline').contents().find('body');

				if (scope.cssUrl) {
					body.prepend(angular.element('<link/>', { rel: 'stylesheet', href: scope.cssUrl, type: 'text/css' }));
				}

				function setHeight() {
					if (body.find('.stream').length === 0) {
						setTimeout(setHeight, 100);
					} else {
						body.find('.stream').addClass('stream-new').removeClass('stream').css('height', 'auto');
						angular.element('.twitter-timeline').css('height', (body.height() + 20) + 'px');
					}
				}

				if (scope.autoResize) {
					setHeight();
				}
			}

			if (!angular.element('#twitter-wjs').length) {
				angular.element.getScript((/^http:/.test(document.location)?'http':'https') + '://platform.twitter.com/widgets.js', function() {
					render();
					angular.element('.twitter-timeline').load(render);
				});
			}
		}
	};
}])
.directive('ngShowNext', [ '$document', function($document) {
	return {
		restrict: 'A',
		scope: {
			start: '=start',
			step: '&step',
			limit: '&limit',
			first: '=first'
		},
		link: function (scope, element) {
			function toArray(obj) {
				var array = [];
				for (var i = 0; i < obj.length; i++) {
					array[i] = obj[i];
				}
				return array;
			}

			// 		TODO:
			// 		- ON LOAD SHOW FIRST SIX
			// 		- ON REACHING THE END, RESTART BUTTON
			// 		- DOING THE SAME BUT WITH PREV

			// 		**/

			element.bind('click', function(){
				var instafeed = $document[0].getElementById('instafeed');
				var children = instafeed.children;
				var childrenArray = toArray(children);
				var prevBlock = childrenArray.slice(scope.start,(scope.start+scope.step()));
				scope.start = scope.start+scope.step();
				var nextBlock = childrenArray.slice(scope.start,(scope.start+scope.step()));

				angular.forEach(nextBlock, function(item){
					angular.element(item).removeClass('hidden');
				});
				angular.forEach(prevBlock, function(item){
					angular.element(item).addClass('hidden');
				});

				scope.$apply(function(){
					console.log(instafeed);
				});
			});

		}
	};
}])
.directive('ngAboutAnimate', [ '$document','$interval','$compile', function($document, $interval, $compile) {
	return {
		controller: 'AboutMeCtrl',
		restrict: 'A',
		scope: {
			steps: '&steps',
			section: '&section',
			chapters: '=chapters',
			stepsvisibility: '=stepsvisibility',
			setChapters: '&setChapters',
			showSteps: '&showSteps'
		},
		link: function (scope,element) {
			var steps = scope.steps();
			var _i = 0;
			var interval;
			var v = 2500;
			var adding = function addElements(){
				if(_i < steps.length){
					console.log(steps[_i]);
					var elem = $compile(steps[_i].content)(scope);
					if(steps[_i].clear === false){
						element.append(elem);
					}
					else{
						angular.element(element).empty();
						element.append(elem);
					}
					$interval.cancel(interval);
					v = steps[_i].interval;
					interval = $interval(addElements, v);
					_i++;

				}
			};
			interval = $interval(adding, v);
		}
	};
}])
.directive('ngVideoStartStopOnSize', [ '$rootScope', '$location', function($rootScope, $location) {
	return {
		restrict: 'A',
		scope: {
			onSize: '&onSize',
		},
		link: function (scope,element) {
			$rootScope.$watch('windowSize.width', function(newVal){
				//we'll play the vid if the window width is gt 767 and the user is in /
				if(newVal > 767 && $location.path() === '/'){
					angular.element(element).get(0).play();
				}
				else{
					angular.element(element).get(0).pause();
				}
			});
		}
	};
}]);