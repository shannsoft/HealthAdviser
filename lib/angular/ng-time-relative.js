(function(e){if("function"==typeof bootstrap)bootstrap("ng-time-relative",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeNgTimeRelative=e}else"undefined"!=typeof window?window.ngTimeRelative=e():global.ngTimeRelative=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function(global){'use strict';

exports = module.exports = function(module) {
  module.

    constant('timeRelativeConfig', {
      calendar: {
        en: {
          lastDay : '[Yesterday], LT',
          sameDay : '[Today], LT',
          nextDay : '[Tomorrow], LT',
          lastWeek : 'dddd, LT',
          nextWeek : 'Next dddd, LT',
          sameElse : 'LL'
        }
      }
    }).

    directive('relative', directive).

    run(['moment', 'timeRelativeConfig', function(moment, timeRelativeConfig) {
      angular.forEach(timeRelativeConfig.calendar, function(translation, lang) {
        moment.lang(lang, {calendar: translation});
      });
    }]);
};

exports.directive = directive;

if ('angular' in global) {
  var mod = angular.module('timeRelative', []);
  if ('moment' in global) {
    mod.constant('moment', moment);
    moment.lang('en', {});
  }
  exports(mod);
}

function directive($timeout, moment) {
  return {
    restrict: 'AC',
    scope: {
      datetime: '@'
    },
    link: function(scope, element, attrs) {
      var timeout;

      scope.$watch('datetime', function(dateString) {
        $timeout.cancel(timeout);

        var date = moment(dateString);
        if (!date || !date.isValid()) throw new Error('Invalid date');

        var to = function() { return moment(attrs.to); };
        var withoutSuffix = 'withoutSuffix' in attrs;

        if (!attrs.title)
          element.attr('title', date.format('LLLL'));

        function updateTime() {
          element.text(diffString(date, to()));
        }

        function diffString(a, b) {
          if (Math.abs(a.clone().startOf('day').diff(b, 'days', true)) < 1)
            return a.from(b, withoutSuffix);
          else
            return a.calendar(b);
        }

        function updateLater() {
          updateTime();
          timeout = $timeout(function() {
            updateLater();
          }, nextUpdateIn());
        }

        function nextUpdateIn() {
          var delta = Math.abs(moment().diff(date));
          if (delta < 45e3) return 45e3 - delta;
          if (delta < 90e3) return 90e3 - delta;
          if (delta < 45 * 60e3) return 60e3 - (delta + 30e3) % 60e3;
          return 3660e3 - delta % 3600e3;
        }

        element.bind('$destroy', function() {
          $timeout.cancel(timeout);
        });

        updateLater();
      });
    }
  };
}

directive.$inject = ['$timeout', 'moment'];

})(window)
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVwaGFuL0NvZGUvbmctdGltZS1yZWxhdGl2ZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGdsb2JhbCl7J3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcbiAgbW9kdWxlLlxuXG4gICAgY29uc3RhbnQoJ3RpbWVSZWxhdGl2ZUNvbmZpZycsIHtcbiAgICAgIGNhbGVuZGFyOiB7XG4gICAgICAgIGVuOiB7XG4gICAgICAgICAgbGFzdERheSA6ICdbWWVzdGVyZGF5XSwgTFQnLFxuICAgICAgICAgIHNhbWVEYXkgOiAnW1RvZGF5XSwgTFQnLFxuICAgICAgICAgIG5leHREYXkgOiAnW1RvbW9ycm93XSwgTFQnLFxuICAgICAgICAgIGxhc3RXZWVrIDogJ2RkZGQsIExUJyxcbiAgICAgICAgICBuZXh0V2VlayA6ICdOZXh0IGRkZGQsIExUJyxcbiAgICAgICAgICBzYW1lRWxzZSA6ICdMTCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLlxuXG4gICAgZGlyZWN0aXZlKCdyZWxhdGl2ZScsIGRpcmVjdGl2ZSkuXG5cbiAgICBydW4oWydtb21lbnQnLCAndGltZVJlbGF0aXZlQ29uZmlnJywgZnVuY3Rpb24obW9tZW50LCB0aW1lUmVsYXRpdmVDb25maWcpIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aW1lUmVsYXRpdmVDb25maWcuY2FsZW5kYXIsIGZ1bmN0aW9uKHRyYW5zbGF0aW9uLCBsYW5nKSB7XG4gICAgICAgIG1vbWVudC5sYW5nKGxhbmcsIHtjYWxlbmRhcjogdHJhbnNsYXRpb259KTtcbiAgICAgIH0pO1xuICAgIH1dKTtcbn07XG5cbmV4cG9ydHMuZGlyZWN0aXZlID0gZGlyZWN0aXZlO1xuXG5pZiAoJ2FuZ3VsYXInIGluIGdsb2JhbCkge1xuICB2YXIgbW9kID0gYW5ndWxhci5tb2R1bGUoJ3RpbWVSZWxhdGl2ZScsIFtdKTtcbiAgaWYgKCdtb21lbnQnIGluIGdsb2JhbCkge1xuICAgIG1vZC5jb25zdGFudCgnbW9tZW50JywgbW9tZW50KTtcbiAgICBtb21lbnQubGFuZygnZW4nLCB7fSk7XG4gIH1cbiAgZXhwb3J0cyhtb2QpO1xufVxuXG5mdW5jdGlvbiBkaXJlY3RpdmUoJHRpbWVvdXQsIG1vbWVudCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUMnLFxuICAgIHNjb3BlOiB7XG4gICAgICBkYXRldGltZTogJ0AnXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHZhciB0aW1lb3V0O1xuXG4gICAgICBzY29wZS4kd2F0Y2goJ2RhdGV0aW1lJywgZnVuY3Rpb24oZGF0ZVN0cmluZykge1xuICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dCk7XG5cbiAgICAgICAgdmFyIGRhdGUgPSBtb21lbnQoZGF0ZVN0cmluZyk7XG4gICAgICAgIGlmICghZGF0ZSB8fCAhZGF0ZS5pc1ZhbGlkKCkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBkYXRlJyk7XG5cbiAgICAgICAgdmFyIHRvID0gZnVuY3Rpb24oKSB7IHJldHVybiBtb21lbnQoYXR0cnMudG8pOyB9O1xuICAgICAgICB2YXIgd2l0aG91dFN1ZmZpeCA9ICd3aXRob3V0U3VmZml4JyBpbiBhdHRycztcblxuICAgICAgICBpZiAoIWF0dHJzLnRpdGxlKVxuICAgICAgICAgIGVsZW1lbnQuYXR0cigndGl0bGUnLCBkYXRlLmZvcm1hdCgnTExMTCcpKTtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVUaW1lKCkge1xuICAgICAgICAgIGVsZW1lbnQudGV4dChkaWZmU3RyaW5nKGRhdGUsIHRvKCkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRpZmZTdHJpbmcoYSwgYikge1xuICAgICAgICAgIGlmIChNYXRoLmFicyhhLmNsb25lKCkuc3RhcnRPZignZGF5JykuZGlmZihiLCAnZGF5cycsIHRydWUpKSA8IDEpXG4gICAgICAgICAgICByZXR1cm4gYS5mcm9tKGIsIHdpdGhvdXRTdWZmaXgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBhLmNhbGVuZGFyKGIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTGF0ZXIoKSB7XG4gICAgICAgICAgdXBkYXRlVGltZSgpO1xuICAgICAgICAgIHRpbWVvdXQgPSAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHVwZGF0ZUxhdGVyKCk7XG4gICAgICAgICAgfSwgbmV4dFVwZGF0ZUluKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbmV4dFVwZGF0ZUluKCkge1xuICAgICAgICAgIHZhciBkZWx0YSA9IE1hdGguYWJzKG1vbWVudCgpLmRpZmYoZGF0ZSkpO1xuICAgICAgICAgIGlmIChkZWx0YSA8IDQ1ZTMpIHJldHVybiA0NWUzIC0gZGVsdGE7XG4gICAgICAgICAgaWYgKGRlbHRhIDwgOTBlMykgcmV0dXJuIDkwZTMgLSBkZWx0YTtcbiAgICAgICAgICBpZiAoZGVsdGEgPCA0NSAqIDYwZTMpIHJldHVybiA2MGUzIC0gKGRlbHRhICsgMzBlMykgJSA2MGUzO1xuICAgICAgICAgIHJldHVybiAzNjYwZTMgLSBkZWx0YSAlIDM2MDBlMztcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuYmluZCgnJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVwZGF0ZUxhdGVyKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmRpcmVjdGl2ZS4kaW5qZWN0ID0gWyckdGltZW91dCcsICdtb21lbnQnXTtcblxufSkod2luZG93KSJdfQ==(1)
});
;