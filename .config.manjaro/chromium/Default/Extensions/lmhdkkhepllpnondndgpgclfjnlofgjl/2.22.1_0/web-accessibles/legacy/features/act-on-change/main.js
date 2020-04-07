(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["core-js/modules/es6.regexp.replace", "core-js/modules/web.dom.iterable", "core-js/modules/es6.object.to-string", "core-js/modules/es6.set"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("core-js/modules/es6.regexp.replace"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.object.to-string"), require("core-js/modules/es6.set"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.es6Regexp, global.webDom, global.es6Object, global.es6);
    global.main = mod.exports;
  }
})(this, function (_es6Regexp, _webDom, _es6Object, _es) {
  "use strict";

  (function poll() {
    if (ynabToolKit.pageReady === true && typeof ynabToolKit.shared.feedChanges !== 'undefined') {
      // When this is true, the feature scripts will know they can use the mutationObserver
      ynabToolKit.actOnChangeInit = false; // Set 'ynabToolKit.debugNodes = true' to print changes the mutationObserver sees
      // during page interactions and updates to the developer tools console.
      // ynabToolKit.debugNodes = true;

      ynabToolKit.actOnChange = function () {
        var _MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        var observer = new _MutationObserver(function (mutations) {
          if (ynabToolKit.debugNodes) {
            console.log('MODIFIED NODES');
          }

          ynabToolKit.changedNodes = new Set();
          mutations.forEach(function (mutation) {
            var newNodes = mutation.target;
            var $nodes = $(newNodes); // jQuery set

            $nodes.each(function () {
              var nodeClass = $(this).attr('class');
              if (nodeClass) ynabToolKit.changedNodes.add(nodeClass.replace(/^ember-view /, ''));
            }); // each node mutation event
          }); // each mutation event

          if (ynabToolKit.debugNodes) {
            console.log(ynabToolKit.changedNodes);
            console.log('###');
          } // Now we are ready to feed the change digest to the
          // automatically setup feedChanges file/function


          if (ynabToolKit.changedNodes.size > 0) {
            ynabToolKit.shared.feedChanges({
              changedNodes: ynabToolKit.changedNodes
            });
          }
        }); // This finally says 'Watch for changes' and only needs to be called the one time

        observer.observe($('.ember-view.layout')[0], {
          subtree: true,
          childList: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['class']
        });
        ynabToolKit.actOnChangeInit = true;
      }; // Run listeners once


      ynabToolKit.actOnChange();
    } else if (typeof Ember !== 'undefined') {
      Ember.run.next(poll, 250);
    } else {
      setTimeout(poll, 250);
    }
  })();
});