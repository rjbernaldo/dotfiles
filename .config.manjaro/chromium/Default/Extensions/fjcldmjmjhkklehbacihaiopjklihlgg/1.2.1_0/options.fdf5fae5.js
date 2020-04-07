// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({24:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var handleError = function handleError(e) {
    console.error('-------------------------------------');
    console.error('Something went wrong loading News Feed Eradicator. Please take a screenshot of these details:');
    console.error(e.stack);
    console.error('-------------------------------------');
};
exports.default = handleError;
},{}],75:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadSettings = loadSettings;
exports.saveSettings = saveSettings;
function loadSettings(callback) {
    chrome.storage.sync.get(null, function (data) {
        callback(data);
    });
}
;
function saveSettings(data) {
    chrome.storage.sync.set(data);
}
;
},{}],107:[function(require,module,exports) {
var global = arguments[3];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

exports.default = freeGlobal;
},{}],106:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _freeGlobal = require('./_freeGlobal.js');

var _freeGlobal2 = _interopRequireDefault(_freeGlobal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal2.default || freeSelf || Function('return this')();

exports.default = root;
},{"./_freeGlobal.js":107}],103:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _root = require('./_root.js');

var _root2 = _interopRequireDefault(_root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Built-in value references. */
var Symbol = _root2.default.Symbol;

exports.default = Symbol;
},{"./_root.js":106}],104:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Symbol = require('./_Symbol.js');

var _Symbol2 = _interopRequireDefault(_Symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol2.default ? _Symbol2.default.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

exports.default = getRawTag;
},{"./_Symbol.js":103}],105:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

exports.default = objectToString;
},{}],97:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Symbol = require('./_Symbol.js');

var _Symbol2 = _interopRequireDefault(_Symbol);

var _getRawTag = require('./_getRawTag.js');

var _getRawTag2 = _interopRequireDefault(_getRawTag);

var _objectToString = require('./_objectToString.js');

var _objectToString2 = _interopRequireDefault(_objectToString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol2.default ? _Symbol2.default.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? (0, _getRawTag2.default)(value) : (0, _objectToString2.default)(value);
}

exports.default = baseGetTag;
},{"./_Symbol.js":103,"./_getRawTag.js":104,"./_objectToString.js":105}],101:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

exports.default = overArg;
},{}],98:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _overArg = require('./_overArg.js');

var _overArg2 = _interopRequireDefault(_overArg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Built-in value references. */
var getPrototype = (0, _overArg2.default)(Object.getPrototypeOf, Object);

exports.default = getPrototype;
},{"./_overArg.js":101}],99:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

exports.default = isObjectLike;
},{}],95:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseGetTag = require('./_baseGetTag.js');

var _baseGetTag2 = _interopRequireDefault(_baseGetTag);

var _getPrototype = require('./_getPrototype.js');

var _getPrototype2 = _interopRequireDefault(_getPrototype);

var _isObjectLike = require('./isObjectLike.js');

var _isObjectLike2 = _interopRequireDefault(_isObjectLike);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!(0, _isObjectLike2.default)(value) || (0, _baseGetTag2.default)(value) != objectTag) {
    return false;
  }
  var proto = (0, _getPrototype2.default)(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

exports.default = isPlainObject;
},{"./_baseGetTag.js":97,"./_getPrototype.js":98,"./isObjectLike.js":99}],102:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],100:[function(require,module,exports) {
var global = arguments[3];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill.js');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var root; /* global window */

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
},{"./ponyfill.js":102}],96:[function(require,module,exports) {
module.exports = require('./lib/index');
},{"./lib/index":100}],89:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionTypes = undefined;
exports.default = createStore;

var _isPlainObject = require('lodash-es/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2.default)(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2.default] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2.default] = observable, _ref2;
}
},{"lodash-es/isPlainObject":95,"symbol-observable":96}],94:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],90:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash-es/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2.default)(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if ('development' !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        (0, _warning2.default)('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if ('development' !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if ('development' !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        (0, _warning2.default)(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
},{"./createStore":89,"lodash-es/isPlainObject":95,"./utils/warning":94}],91:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],93:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}
},{}],92:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2.default.apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":93}],79:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if ('development' !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2.default)('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2.default;
exports.combineReducers = _combineReducers2.default;
exports.bindActionCreators = _bindActionCreators2.default;
exports.applyMiddleware = _applyMiddleware2.default;
exports.compose = _compose2.default;
},{"./createStore":89,"./combineReducers":90,"./bindActionCreators":91,"./applyMiddleware":92,"./compose":93,"./utils/warning":94}],80:[function(require,module,exports) {
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
},{}],85:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    newFeatureIncrement: 1
};
},{}],86:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var BuiltinQuotes = exports.BuiltinQuotes = [{
    id: 1,
    text: "I have just three things to teach: simplicity, patience, compassion. These three are your greatest treasures.",
    source: "Lao Tzu"
}, {
    id: 2,
    text: "Do today what others won't and achieve tomorrow what others can't.",
    source: "Jerry Rice"
}, {
    id: 3,
    text: "In character, in manner, in style, in all things, the supreme excellence is simplicity.",
    source: "Henry Wadsworth Longfellow"
}, {
    id: 4,
    text: "If we don't discipline ourselves, the world will do it for us.",
    source: "William Feather"
}, {
    id: 5,
    text: "Rule your mind or it will rule you.",
    source: "Horace"
}, {
    id: 6,
    text: "All that we are is the result of what we have thought.",
    source: "Buddha"
}, {
    id: 7,
    text: "Doing just a little bit during the time we have available puts you that much further ahead than if you took no action at all.",
    source: "Pulsifer, Take Action; Don't Procrastinate"
}, {
    id: 8,
    text: "Never leave that till tomorrow which you can do today.",
    source: "Benjamin Franklin"
}, {
    id: 9,
    text: "Procrastination is like a credit card: it's a lot of fun until you get the bill.",
    source: "Christopher Parker"
}, {
    id: 10,
    text: "Someday is not a day of the week.",
    source: "Author Unknown"
}, {
    id: 11,
    text: "Tomorrow is often the busiest day of the week.",
    source: "Spanish Proverb"
}, {
    id: 12,
    text: "I can accept failure, everyone fails at something. But I can't accept not trying.",
    source: "Michael Jordan"
}, {
    id: 13,
    text: "There’s a myth that time is money. In fact, time is more precious than money. It’s a nonrenewable resource. Once you’ve spent it, and if you’ve spent it badly, it’s gone forever.",
    source: "Neil A. Fiore"
}, {
    id: 14,
    text: "Nothing can stop the man with the right mental attitude from achieving his goal; nothing on earth can help the man with the wrong mental attitude.",
    source: "Thomas Jefferson"
}, {
    id: 15,
    text: "There is only one success--to be able to spend your life in your own way.",
    source: "Christopher Morley"
}, {
    id: 16,
    text: "Success is the good fortune that comes from aspiration, desperation, perspiration and inspiration.",
    source: "Evan Esar"
}, {
    id: 17,
    text: "We are still masters of our fate. We are still captains of our souls.",
    source: "Winston Churchill"
}, {
    id: 18,
    text: "Our truest life is when we are in dreams awake.",
    source: "Henry David Thoreau"
}, {
    id: 19,
    text: "The best way to make your dreams come true is to wake up.",
    source: "Paul Valery"
}, {
    id: 20,
    text: "Life without endeavor is like entering a jewel mine and coming out with empty hands.",
    source: "Japanese Proverb"
}, {
    id: 21,
    text: "Happiness does not consist in pastimes and amusements but in virtuous activities.",
    source: "Aristotle"
}, {
    id: 22,
    text: "By constant self-discipline and self-control, you can develop greatness of character.",
    source: "Grenville Kleiser"
}, {
    id: 23,
    text: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.",
    source: "Vince Lombardi Jr."
}, {
    id: 24,
    text: "At the end of the day, let there be no excuses, no explanations, no regrets.",
    source: "Steve Maraboli"
}, {
    id: 25,
    text: "Inaction will cause a man to sink into the slough of despond and vanish without a trace.",
    source: "Farley Mowat"
}, {
    id: 26,
    text: "True freedom is impossible without a mind made free by discipline.",
    source: "Mortimer J. Adler"
}, {
    id: 27,
    text: "The most powerful control we can ever attain, is to be in control of ourselves.",
    source: "Chris Page"
}, {
    id: 28,
    text: "Idleness is only the refuge of weak minds, and the holiday of fools.",
    source: "Philip Dormer Stanhope"
}, {
    id: 29,
    text: "This is your life and it's ending one minute at a time.",
    source: "Tyler Durden, Fight Club"
}, {
    id: 30,
    text: "You create opportunities by performing, not complaining.",
    source: "Muriel Siebert"
}, {
    id: 31,
    text: "Great achievement is usually born of great sacrifice, and is never the result of selfishness.",
    source: "Napoleon Hill"
}, {
    id: 32,
    text: "Whether you think you can, or you think you can't, you're right.",
    source: "Henry Ford"
}, {
    id: 33,
    text: "Even if I knew that tomorrow the world would go to pieces, I would still plant my apple tree.",
    source: "Martin Luther"
}, {
    id: 34,
    text: "Great acts are made up of small deeds.",
    source: "Lao Tzu"
}, {
    id: 35,
    text: "The flame that burns Twice as bright burns half as long.",
    source: "Lao Tzu"
}, {
    id: 36,
    text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    source: "Antoine de Saint-Exupery"
}, {
    id: 37,
    text: "If you can't do great things, do small things in a great way.",
    source: "Napoleon Hill"
}, {
    id: 38,
    text: "When I let go of what I am, I become what I might be.",
    source: "Lao Tzu"
}, {
    id: 39,
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    source: "Ralph Waldo Emerson"
}, {
    id: 40,
    text: "Well done is better than well said.",
    source: "Benjamin Franklin"
}, {
    id: 41,
    text: "Whatever you think the world is withholding from you, you are withholding from the world.",
    source: "Ekhart Tolle"
}, {
    id: 42,
    text: "Muddy water is best cleared by leaving it alone.",
    source: "Alan Watts"
}, {
    id: 43,
    text: "Do, or do not. There is no try.",
    source: "Yoda"
}, {
    id: 44,
    text: "The superior man is modest in his speech, but exceeds in his actions.",
    source: "Confucius"
}, {
    id: 45,
    text: "Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.",
    source: "Helen Keller"
}, {
    id: 46,
    text: "We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.",
    source: "Marie Curie"
}, {
    id: 47,
    text: "If you look at what you have in life, you’ll always have more. If you look at what you don’t have in life, you’ll never have enough.",
    source: "Oprah Winfrey"
}, {
    id: 48,
    text: "You may encounter many defeats, but you must not be defeated. In fact, it may be necessary to encounter the defeats, so you can know who you are, what you can rise from, how you can still come out of it.",
    source: "Maya Angelou"
}, {
    id: 49,
    text: "We need to start work with the idea that we’re going to learn every day. I learn, even at my position, every single day.",
    source: "Chanda Kochhar"
}, {
    id: 50,
    text: "There are two kinds of people, those who do the work and those who take the credit. Try to be in the first group; there is less competition there.",
    source: "Indira Gandhi"
}, {
    id: 51,
    text: "You can’t be that kid standing at the top of the waterslide, overthinking it. You have to go down the chute.",
    source: "Tina Fey"
}, {
    id: 52,
    text: "Above all, be the heroine of your life, not the victim.",
    source: "Nora Ephron"
}, {
    id: 53,
    text: "Learn from the mistakes of others. You can’t live long enough to make them all yourself.",
    source: "Eleanor Roosevelt"
}, {
    id: 54,
    text: "What you do makes a difference, and you have to decide what kind of difference you want to make.",
    source: "Jane Goodall"
}, {
    id: 55,
    text: "One of the secrets to staying young is to always do things you don’t know how to do, to keep learning.",
    source: "Ruth Reichl"
}, {
    id: 56,
    text: "If you don’t risk anything, you risk even more.",
    source: "Erica Jong"
}, {
    id: 57,
    text: "When the whole world is silent, even one voice becomes powerful.",
    source: "Malala Yousafzai"
}, {
    id: 58,
    text: "The most common way people give up their power is by thinking they don’t have any.",
    source: "Alice Walker"
}, {
    id: 59,
    text: "My philosophy is that not only are you responsible for your life, but doing the best at this moment puts you in the best place for the next moment.",
    source: "Oprah Winfrey"
}, {
    id: 60,
    text: "Don’t be intimidated by what you don’t know. That can be your greatest strength and ensure that you do things differently from everyone else.",
    source: "Sara Blakely"
}, {
    id: 61,
    text: "If I had to live my life again, I’d make the same mistakes, only sooner.",
    source: "Tallulah Bankhead"
}, {
    id: 62,
    text: "Never limit yourself because of others’ limited imagination; never limit others because of your own limited imagination.",
    source: "Mae C. Jemison"
}, {
    id: 63,
    text: "If you obey all the rules, you miss all the fun.",
    source: "Katharine Hepburn"
}, {
    id: 64,
    text: "Life shrinks or expands in proportion to one’s courage.",
    source: "Anaïs Nin"
}, {
    id: 65,
    text: "Avoiding danger is no safer in the long run than outright exposure. The fearful are caught as often as the bold.",
    source: "Helen Keller"
}, {
    id: 66,
    text: "How wonderful it is that nobody need wait a single moment before beginning to improve the world.",
    source: "Anne Frank"
}, {
    id: 67,
    text: "So often people are working hard at the wrong thing. Working on the right thing is probably more important than working hard.",
    source: "Caterina Fake"
}, {
    id: 68,
    text: "There are still many causes worth sacrificing for, so much history yet to be made.",
    source: "Michelle Obama"
}, {
    id: 69,
    text: "Nothing is impossible; the word itself says ‘I’m possible’!",
    source: "Audrey Hepburn"
}, {
    id: 70,
    text: "You only live once, but if you do it right, once is enough.",
    source: "Mae West"
}];
},{}],66:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.areNewFeaturesAvailable = areNewFeaturesAvailable;
exports.getBuiltinQuotes = getBuiltinQuotes;
exports.currentQuote = currentQuote;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _quote = require('../quote');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function areNewFeaturesAvailable(state) {
    return _config2.default.newFeatureIncrement > state.featureIncrement;
}
function getBuiltinQuotes(state) {
    if (!state.builtinQuotesEnabled) return [];
    return _quote.BuiltinQuotes.filter(function (quote) {
        return state.hiddenBuiltinQuotes.indexOf(quote.id) === -1;
    });
}
function currentQuote(state) {
    var emptyQuote = { id: null, text: "No quotes found!", source: "" };
    if (state.currentQuoteID == null) return emptyQuote;
    if (state.isCurrentQuoteCustom) {
        return state.customQuotes.find(function (quote) {
            return quote.id === state.currentQuoteID;
        }) || emptyQuote;
    } else {
        return _quote.BuiltinQuotes.find(function (quote) {
            return quote.id === state.currentQuoteID;
        }) || emptyQuote;
    }
}
},{"../config":85,"../quote":86}],65:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.menuToggle = exports.menuHide = exports.ActionTypes = undefined;
exports.hideInfoPanel = hideInfoPanel;
exports.showInfoPanel = showInfoPanel;
exports.toggleShowQuotes = toggleShowQuotes;
exports.toggleBuiltinQuotes = toggleBuiltinQuotes;
exports.addQuote = addQuote;
exports.resetHiddenQuotes = resetHiddenQuotes;
exports.removeCurrentQuote = removeCurrentQuote;
exports.selectNewQuote = selectNewQuote;
exports.setQuoteText = setQuoteText;
exports.setQuoteSource = setQuoteSource;
exports.startEditing = startEditing;
exports.cancelEditing = cancelEditing;

var _selectors = require('./selectors');

var ActionTypes = exports.ActionTypes = undefined;
(function (ActionTypes) {
    ActionTypes[ActionTypes["TOGGLE_SHOW_QUOTES"] = 'TOGGLE_SHOW_QUOTES'] = "TOGGLE_SHOW_QUOTES";
    ActionTypes[ActionTypes["TOGGLE_BUILTIN_QUOTES"] = 'TOGGLE_BUILTIN_QUOTES'] = "TOGGLE_BUILTIN_QUOTES";
    ActionTypes[ActionTypes["SELECT_NEW_QUOTE"] = 'SELECT_NEW_QUOTE'] = "SELECT_NEW_QUOTE";
    ActionTypes[ActionTypes["HIDE_QUOTE"] = 'HIDE_QUOTE'] = "HIDE_QUOTE";
    ActionTypes[ActionTypes["DELETE_QUOTE"] = 'DELETE_QUOTE'] = "DELETE_QUOTE";
    ActionTypes[ActionTypes["ADD_QUOTE"] = 'ADD_QUOTE'] = "ADD_QUOTE";
    ActionTypes[ActionTypes["RESET_HIDDEN_QUOTES"] = 'RESET_HIDDEN_QUOTES'] = "RESET_HIDDEN_QUOTES";
})(ActionTypes || (exports.ActionTypes = ActionTypes = {}));
function generateID() {
    var key = '';
    while (key.length < 16) {
        key += Math.random().toString(16).substr(2);
    }
    return key.substr(0, 16);
}
function hideInfoPanel() {
    return {
        type: "INFO_PANEL_SHOW",
        show: "HIDE"
    };
}
function showInfoPanel() {
    return {
        type: "INFO_PANEL_SHOW",
        show: "SHOW"
    };
}
function toggleShowQuotes() {
    return {
        type: ActionTypes.TOGGLE_SHOW_QUOTES
    };
}
function toggleBuiltinQuotes() {
    return function (dispatch) {
        dispatch({
            type: ActionTypes.TOGGLE_BUILTIN_QUOTES
        });
        dispatch(selectNewQuote());
    };
}
function addQuote(text, source) {
    var id = generateID();
    return {
        type: ActionTypes.ADD_QUOTE,
        id: id,
        text: text,
        source: source
    };
}
function resetHiddenQuotes() {
    return {
        type: ActionTypes.RESET_HIDDEN_QUOTES
    };
}
function removeCurrentQuote() {
    return function (dispatch, getState) {
        var state = getState();
        if (state.isCurrentQuoteCustom) {
            dispatch({
                type: ActionTypes.DELETE_QUOTE,
                id: state.currentQuoteID
            });
        } else {
            dispatch({
                type: ActionTypes.HIDE_QUOTE,
                id: state.currentQuoteID
            });
        }
        dispatch(selectNewQuote());
    };
}
function selectNewQuote() {
    return function (dispatch, getState) {
        var state = getState();
        var builtinQuotes = (0, _selectors.getBuiltinQuotes)(state);
        var customQuotes = state.customQuotes;
        var allQuotes = builtinQuotes.concat(customQuotes);
        if (allQuotes.length < 1) {
            return dispatch({
                type: ActionTypes.SELECT_NEW_QUOTE,
                isCustom: false,
                id: null
            });
        }
        var quoteIndex = Math.floor(Math.random() * allQuotes.length);
        dispatch({
            type: ActionTypes.SELECT_NEW_QUOTE,
            isCustom: quoteIndex >= builtinQuotes.length,
            id: allQuotes[quoteIndex].id
        });
    };
}
function setQuoteText(text) {
    return {
        type: "QUOTE_EDIT",
        action: { type: "SET_TEXT", text: text }
    };
}
function setQuoteSource(source) {
    return {
        type: "QUOTE_EDIT",
        action: { type: "SET_SOURCE", source: source }
    };
}
function startEditing() {
    return {
        type: "QUOTE_EDIT",
        action: { type: "START" }
    };
}
function cancelEditing() {
    return {
        type: "QUOTE_EDIT",
        action: { type: "CANCEL" }
    };
}
var menuHide = exports.menuHide = function menuHide() {
    return {
        type: "QUOTE_MENU_SHOW",
        show: "HIDE"
    };
};
var menuToggle = exports.menuToggle = function menuToggle() {
    return {
        type: "QUOTE_MENU_SHOW",
        show: "TOGGLE"
    };
};
},{"./selectors":66}],76:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _actions = require('./actions');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function showQuotes() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var action = arguments[1];

    switch (action.type) {
        case _actions.ActionTypes.TOGGLE_SHOW_QUOTES:
            return !state;
    }
    return state;
}
function builtinQuotesEnabled() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var action = arguments[1];

    switch (action.type) {
        case _actions.ActionTypes.TOGGLE_BUILTIN_QUOTES:
            return !state;
    }
    return state;
}
function showInfoPanel() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var action = arguments[1];

    switch (action.type) {
        case "INFO_PANEL_SHOW":
            switch (action.show) {
                case "SHOW":
                    return true;
                case "HIDE":
                    return false;
                case "TOGGLE":
                    return !state;
            }
    }
    return state;
}
function featureIncrement() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var action = arguments[1];

    switch (action.type) {
        case "INFO_PANEL_SHOW":
            switch (action.show) {
                case "SHOW":
                    return _config2.default.newFeatureIncrement;
            }
    }
    return state;
}
function isCurrentQuoteCustom() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var action = arguments[1];

    switch (action.type) {
        case _actions.ActionTypes.SELECT_NEW_QUOTE:
            return action.isCustom;
        case _actions.ActionTypes.ADD_QUOTE:
            return true;
    }
    return state;
}
function currentQuoteID() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var action = arguments[1];

    switch (action.type) {
        case _actions.ActionTypes.SELECT_NEW_QUOTE:
            return action.id;
        case _actions.ActionTypes.ADD_QUOTE:
            return action.id;
    }
    return state;
}
function hiddenBuiltinQuotes() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var action = arguments[1];

    switch (action.type) {
        case _actions.ActionTypes.HIDE_QUOTE:
            if (action.id == null) return state;
            return state.concat([action.id]);
        case _actions.ActionTypes.RESET_HIDDEN_QUOTES:
            return [];
    }
    return state;
}
function customQuotes() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var action = arguments[1];

    switch (action.type) {
        case _actions.ActionTypes.ADD_QUOTE:
            return state.concat([{
                id: action.id,
                text: action.text,
                source: action.source
            }]);
        case _actions.ActionTypes.DELETE_QUOTE:
            if (action.id == null) return state;
            return state.filter(function (quote) {
                return quote.id !== action.id;
            });
    }
    return state;
}
var editingText = function editingText() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var action = arguments[1];

    switch (action.type) {
        case "QUOTE_EDIT":
            switch (action.action.type) {
                case "START":
                    return "";
                case "CANCEL":
                    return "";
                case "SET_TEXT":
                    return action.action.text;
            }
    }
    return state;
};
var editingSource = function editingSource() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var action = arguments[1];

    switch (action.type) {
        case "QUOTE_EDIT":
            switch (action.action.type) {
                case "START":
                    return "";
                case "CANCEL":
                    return "";
                case "SET_SOURCE":
                    return action.action.source;
            }
    }
    return state;
};
var isQuoteMenuVisible = function isQuoteMenuVisible() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var action = arguments[1];

    switch (action.type) {
        case "QUOTE_MENU_SHOW":
            switch (action.show) {
                case "SHOW":
                    return true;
                case "HIDE":
                    return false;
                case "TOGGLE":
                    return !state;
            }
    }
    return state;
};
var isEditingQuote = function isEditingQuote() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var action = arguments[1];

    switch (action.type) {
        case "QUOTE_EDIT":
            switch (action.action.type) {
                case "START":
                    return true;
                case "CANCEL":
                    return false;
            }
    }
    return state;
};
exports.default = (0, _redux.combineReducers)({
    showQuotes: showQuotes,
    builtinQuotesEnabled: builtinQuotesEnabled,
    showInfoPanel: showInfoPanel,
    featureIncrement: featureIncrement,
    isCurrentQuoteCustom: isCurrentQuoteCustom,
    currentQuoteID: currentQuoteID,
    hiddenBuiltinQuotes: hiddenBuiltinQuotes,
    customQuotes: customQuotes,
    editingSource: editingSource,
    editingText: editingText,
    isQuoteMenuVisible: isQuoteMenuVisible,
    isEditingQuote: isEditingQuote
});
},{"redux":79,"./actions":65,"../config":85}],41:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createStore = createStore;

var _webextension = require('../webextension');

var browser = _interopRequireWildcard(_webextension);

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function saveSettings(state) {
    var data = {
        showQuotes: state.showQuotes,
        builtinQuotesEnabled: state.builtinQuotesEnabled,
        featureIncrement: state.featureIncrement,
        hiddenBuiltinQuotes: state.hiddenBuiltinQuotes,
        customQuotes: state.customQuotes
    };
    browser.saveSettings(data);
}
function createStore() {
    return new Promise(function (resolve) {
        browser.loadSettings(function (initialState) {
            var store = (0, _redux.createStore)(_reducer2.default, initialState, (0, _redux.applyMiddleware)(_reduxThunk2.default));
            store.dispatch((0, _actions.selectNewQuote)());
            store.subscribe(function () {
                saveSettings(store.getState());
            });
            resolve(store);
        });
    });
}
},{"../webextension":75,"redux":79,"redux-thunk":80,"./reducer":76,"./actions":65}],45:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}
exports.vnode = vnode;
exports.default = vnode;
//# sourceMappingURL=vnode.js.map
},{}],46:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.primitive = primitive;
//# sourceMappingURL=is.js.map
},{}],30:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var is = require("./is");
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        data = b;
        if (is.array(c)) {
            children = c;
        }
        else if (is.primitive(c)) {
            text = c;
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (is.array(b)) {
            children = b;
        }
        else if (is.primitive(b)) {
            text = b;
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i]))
                children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i], undefined);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode_1.vnode(sel, data, children, text, undefined);
}
exports.h = h;
;
exports.default = h;
//# sourceMappingURL=h.js.map
},{"./vnode":45,"./is":46}],64:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QuoteEditor = undefined;

var _h = require('snabbdom/h');

var _actions = require('../store/actions');

var QuoteEditor = exports.QuoteEditor = function QuoteEditor(store) {
    var state = store.getState();
    var text = state.editingText;
    var source = state.editingSource;
    var onChangeText = function onChangeText(e) {
        store.dispatch((0, _actions.setQuoteText)(e.target.value));
    };
    var onChangeSource = function onChangeSource(e) {
        store.dispatch((0, _actions.setQuoteSource)(e.target.value));
    };
    var onSave = function onSave() {
        store.dispatch((0, _actions.addQuote)(text, source));
        store.dispatch((0, _actions.cancelEditing)());
    };
    var onCancel = function onCancel() {
        store.dispatch((0, _actions.cancelEditing)());
    };
    return (0, _h.h)('div', [(0, _h.h)('p.nfe-quote-text', [(0, _h.h)('textarea.nfe-editor-quote', { props: {
            placeholder: 'Quote',
            value: text,
            autoFocus: true
        }, on: {
            change: onChangeText
        } })]), (0, _h.h)('p.nfe-quote-source', [(0, _h.h)('span', '~ '), (0, _h.h)('input.nfe-editor-source', { props: {
            type: 'text',
            placeholder: 'Source',
            value: source
        }, on: {
            change: onChangeSource
        } })]), (0, _h.h)('div', [(0, _h.h)('button.nfe-button', { on: { click: onCancel } }, 'Cancel'), (0, _h.h)('button.nfe-button.nfe-button-primary', { on: { click: onSave } }, 'Save')])]);
};
},{"snabbdom/h":30,"../store/actions":65}],58:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QuoteDisplay = undefined;

var _h = require('snabbdom/h');

var _selectors = require('../store/selectors');

var _actions = require('../store/actions');

var _quoteEditor = require('./quote-editor');

var MenuItem = function MenuItem(store, action, children) {
    var onClick = function onClick(e) {
        e.preventDefault();
        store.dispatch((0, _actions.menuHide)());
        store.dispatch(action);
    };
    return (0, _h.h)('li', [(0, _h.h)('a.nfe-quote-action-menu-item', { props: { href: '#' }, on: { click: onClick } }, children)]);
};
var QuoteMenu = function QuoteMenu(store) {
    return (0, _h.h)('div.nfe-quote-action-menu-content', [(0, _h.h)('ul', [MenuItem(store, (0, _actions.removeCurrentQuote)(), 'Remove this quote'), MenuItem(store, (0, _actions.selectNewQuote)(), 'See another quote'), MenuItem(store, (0, _actions.startEditing)(), 'Enter custom quote...')])]);
};
var QuoteDisplay = exports.QuoteDisplay = function QuoteDisplay(store) {
    var state = store.getState();
    var quote = (0, _selectors.currentQuote)(state);
    if (quote == null) return null;
    if (state.isEditingQuote) {
        return (0, _h.h)('div.nfe-quote', [(0, _quoteEditor.QuoteEditor)(store)]);
    }
    var toggleMenu = function toggleMenu() {
        return store.dispatch((0, _actions.menuToggle)());
    };
    return (0, _h.h)('div.nfe-quote', [(0, _h.h)('nfe-quote-action-menu', [(0, _h.h)('a.nfe-quote-action-menu-button', { props: { href: '#' }, on: { click: toggleMenu } }, "▾"), state.isQuoteMenuVisible ? QuoteMenu(store) : null]), (0, _h.h)('div', [(0, _h.h)('p.nfe-quote-text', [(0, _h.h)('span', '“'), (0, _h.h)('span', quote.text), (0, _h.h)('span', '”')]), (0, _h.h)('p.nfe-quote-source', [(0, _h.h)('span', '~ '), (0, _h.h)('span', quote.source)])])]);
};
},{"snabbdom/h":30,"../store/selectors":66,"../store/actions":65,"./quote-editor":64}],65:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Settings = undefined;

var _h = require('snabbdom/h');

var _actions = require('../store/actions');

var CheckboxField = function CheckboxField(store, checked, text, toggleAction) {
    var disabled = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    return (0, _h.h)('label', [(0, _h.h)('input', { props: {
            type: 'checkbox',
            checked: checked,
            disabled: disabled
        }, on: {
            change: function change() {
                return store.dispatch(toggleAction);
            }
        } }), (0, _h.h)('span', text)]);
};
var Settings = exports.Settings = function Settings(store) {
    var state = store.getState();
    var fieldShowQuotes = CheckboxField(store, state.showQuotes, 'Show Quotes', (0, _actions.toggleShowQuotes)());
    var fieldShowBuiltin = CheckboxField(store, state.builtinQuotesEnabled, 'Enable Built-in Quotes', (0, _actions.toggleBuiltinQuotes)(), !state.showQuotes);
    var hiddenQuoteCount = state.hiddenBuiltinQuotes.length;
    var hiddenQuoteReset = function hiddenQuoteReset(e) {
        e.preventDefault();
        store.dispatch((0, _actions.resetHiddenQuotes)());
    };
    var hiddenQuotes = (0, _h.h)('span.nfe-settings-hidden-quote-count', [(0, _h.h)('span', ' ' + hiddenQuoteCount + ' hidden - '), (0, _h.h)('a', { props: { href: '#' }, on: { click: hiddenQuoteReset } }, 'Reset')]);
    var customQuotes = function customQuotes() {
        if (state.customQuotes.length > 0) {
            return (0, _h.h)('label', state.customQuotes.length + ' custom quotes');
        }
        return (0, _h.h)('label', 'You can now add your own custom quotes! ' + 'Just click the arrow menu beside the quote text.');
    };
    return (0, _h.h)('form.nfe-settings', [(0, _h.h)('fieldset', [(0, _h.h)('legend', [fieldShowQuotes]), fieldShowBuiltin, hiddenQuoteCount > 0 ? hiddenQuotes : null, (0, _h.h)('p', [customQuotes()])])]);
};
},{"snabbdom/h":30,"../store/actions":65}],59:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InfoPanel = undefined;

var _h = require('snabbdom/h');

var _actions = require('../store/actions');

var _settings = require('./settings');

var Heading = function Heading(store) {
    var closeInfoPanel = function closeInfoPanel() {
        store.dispatch((0, _actions.hideInfoPanel)());
    };
    return [(0, _h.h)('h1', 'News Feed Eradicator'), (0, _h.h)('a.nfe-close-button', {
        props: { title: 'Close information panel' },
        on: { click: closeInfoPanel }
    }, 'X')];
};
var Icon = function Icon(svgPath) {
    return function (color) {
        return (0, _h.h)('svg', { attrs: {
                x: '0px',
                y: '0px',
                width: '32px',
                height: '32px',
                viewBox: '0 0 32 32',
                'enable-background': 'new 0 0 32 32'
            } }, [(0, _h.h)('path', { attrs: { fill: color, d: svgPath } })]);
    };
};
var FacebookIcon = Icon("M30.7,0H1.3C0.6,0,0,0.6,0,1.3v29.3C0,31.4,0.6,32,1.3,32H17V20h-4v-5h4v-4 c0-4.1,2.6-6.2,6.3-6.2C25.1,4.8,26.6,5,27,5v4.3l-2.6,0c-2,0-2.5,1-2.5,2.4V15h5l-1,5h-4l0.1,12h8.6c0.7,0,1.3-0.6,1.3-1.3V1.3 C32,0.6,31.4,0,30.7,0z");
var TwitterIcon = Icon("M32,6.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6C25.7,3.8,24,3,22.2,3 c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5C10.3,10.8,5.5,8.2,2.2,4.2c-0.6,1-0.9,2.1-0.9,3.3c0,2.3,1.2,4.3,2.9,5.5 c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1C2.9,27.9,6.4,29,10.1,29c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C30,8.5,31.1,7.4,32,6.1z");
var Share = function Share() {
    return [(0, _h.h)('h2', 'Share'), (0, _h.h)('div.nfe-social-media-icons', [(0, _h.h)('a.nfe-social-media-icon', { props: { href: 'https://www.facebook.com/NewsFeedEradicator/' } }, [FacebookIcon('#4f92ff')]), (0, _h.h)('a.nfe-social-media-icon', { props: { href: 'https://twitter.com/NewsFeedErad' } }, [TwitterIcon('#4f92ff')])])];
};
var Contribute = function Contribute() {
    return [(0, _h.h)('h2', 'Contribute'), (0, _h.h)('p', [(0, _h.h)('span', 'News Feed Eradicator is open source. '), (0, _h.h)('a', { props: { href: 'https://github.com/jordwest/news-feed-eradicator/' } }, 'Fork on Github')])];
};
var Remove = function Remove() {
    return [(0, _h.h)('h2', 'Remove'), (0, _h.h)('ul', [(0, _h.h)('li', [(0, _h.h)('a', { props: {
            href: 'https://west.io/news-feed-eradicator/remove.html'
        } }, 'Fork on Github')])])];
};
var InfoPanel = exports.InfoPanel = function InfoPanel(store) {
    return (0, _h.h)('div.nfe-info-panel', [(0, _h.h)('div.nfe-info-col', [].concat(Heading(store), (0, _h.h)('hr'), (0, _h.h)('h2', 'Settings'), (0, _settings.Settings)(store), (0, _h.h)('hr'), Share(), (0, _h.h)('hr'), Contribute(), (0, _h.h)('hr'), Remove()))]);
};
},{"snabbdom/h":30,"../store/actions":65,"./settings":65}],13:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NewsFeedEradicator = undefined;

var _quoteDisplay = require('./quote-display');

var _quoteDisplay2 = _interopRequireDefault(_quoteDisplay);

var _infoPanel = require('./info-panel');

var _infoPanel2 = _interopRequireDefault(_infoPanel);

var _actions = require('../store/actions');

var _selectors = require('../store/selectors');

var _h = require('snabbdom/h');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NewsFeedEradicator = exports.NewsFeedEradicator = function NewsFeedEradicator(store) {
    var state = store.getState();
    // TODO: Add quotes component
    var quoteDisplay = state.showQuotes ? (0, _quoteDisplay2.default)(store) : null;
    var newFeatureLabel = (0, _selectors.areNewFeaturesAvailable)(state) ? (0, _h.h)("span.nfe-label.nfe-new-features", "New Features!") : null;
    var infoPanel = state.showInfoPanel ? (0, _infoPanel2.default)(store) : null;
    var onShowInfoPanel = function onShowInfoPanel() {
        return store.dispatch((0, _actions.showInfoPanel)());
    };
    var link = (0, _h.h)("a.nfe-info-link", { on: { click: onShowInfoPanel } }, [(0, _h.h)("span", "News Feed Eradicator"), newFeatureLabel]);
    // Entire app component
    return (0, _h.h)("div", [infoPanel, quoteDisplay, link]);
};
},{"./quote-display":58,"./info-panel":59,"../store/actions":65,"../store/selectors":66,"snabbdom/h":30}],51:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.vnode = vnode;
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}
exports.default = vnode;
//# sourceMappingURL=vnode.js.map
},{}],52:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.primitive = primitive;
var array = exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
//# sourceMappingURL=is.js.map
},{}],53:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
var htmlDomApi = exports.htmlDomApi = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    isElement: isElement,
    isText: isText,
    isComment: isComment
};
exports.default = htmlDomApi;
//# sourceMappingURL=htmldomapi.js.map
},{}],54:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.h = h;

var _vnode = require('./vnode');

var _is = require('./is');

var is = _interopRequireWildcard(_is);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {},
        children,
        text,
        i;
    if (c !== undefined) {
        data = b;
        if (is.array(c)) {
            children = c;
        } else if (is.primitive(c)) {
            text = c;
        } else if (c && c.sel) {
            children = [c];
        }
    } else if (b !== undefined) {
        if (is.array(b)) {
            children = b;
        } else if (is.primitive(b)) {
            text = b;
        } else if (b && b.sel) {
            children = [b];
        } else {
            data = b;
        }
    }
    if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i])) children[i] = (0, _vnode.vnode)(undefined, undefined, undefined, children[i], undefined);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return (0, _vnode.vnode)(sel, data, children, text, undefined);
}
;
exports.default = h;
//# sourceMappingURL=h.js.map
},{"./vnode":51,"./is":52}],55:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.thunk = undefined;

var _h = require('./h');

function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
    var i,
        old = oldVnode.data,
        cur = thunk.data;
    var oldArgs = old.args,
        args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
        return;
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
var thunk = exports.thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return (0, _h.h)(sel, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: fn,
        args: args
    });
};
exports.default = thunk;
//# sourceMappingURL=thunk.js.map
},{"./h":54}],28:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.thunk = exports.h = undefined;

var _h = require('./h');

Object.defineProperty(exports, 'h', {
    enumerable: true,
    get: function () {
        return _h.h;
    }
});

var _thunk = require('./thunk');

Object.defineProperty(exports, 'thunk', {
    enumerable: true,
    get: function () {
        return _thunk.thunk;
    }
});
exports.init = init;

var _vnode = require('./vnode');

var _vnode2 = _interopRequireDefault(_vnode);

var _is = require('./is');

var is = _interopRequireWildcard(_is);

var _htmldomapi = require('./htmldomapi');

var _htmldomapi2 = _interopRequireDefault(_htmldomapi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isUndef(s) {
    return s === undefined;
}
function isDef(s) {
    return s !== undefined;
}
var emptyNode = (0, _vnode2.default)('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
    return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i,
        map = {},
        key,
        ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined) map[key] = i;
        }
    }
    return map;
}
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function init(modules, domApi) {
    var i,
        j,
        cbs = {};
    var api = domApi !== undefined ? domApi : _htmldomapi2.default;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function emptyNodeAt(elm) {
        var id = elm.id ? '#' + elm.id : '';
        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return (0, _vnode2.default)(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = api.parentNode(childElm);
                api.removeChild(parent_1, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var i,
            data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode);
                data = vnode.data;
            }
        }
        var children = vnode.children,
            sel = vnode.sel;
        if (sel === '!') {
            if (isUndef(vnode.text)) {
                vnode.text = '';
            }
            vnode.elm = api.createComment(vnode.text);
        } else if (sel !== undefined) {
            // Parse selector
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
            if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
            if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            } else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            i = vnode.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create) i.create(emptyNode, vnode);
                if (i.insert) insertedVnodeQueue.push(vnode);
            }
        } else {
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var i,
            j,
            data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
            if (vnode.children !== undefined) {
                for (j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j];
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i_1 = void 0,
                listeners = void 0,
                rm = void 0,
                ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1) cbs.remove[i_1](ch, rm);
                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                        i_1(ch, rm);
                    } else {
                        rm();
                    }
                } else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0,
            newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            } else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            } else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            } else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    } else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var i, hook;
        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode);
        }
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (oldVnode === vnode) return;
        if (vnode.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
            i = vnode.data.hook;
            if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            } else if (isDef(ch)) {
                if (isDef(oldVnode.text)) api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            } else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            } else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        } else if (oldVnode.text !== vnode.text) {
            api.setTextContent(elm, vnode.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode);
        }
    }
    return function patch(oldVnode, vnode) {
        var i, elm, parent;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        } else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
        return vnode;
    };
}
//# sourceMappingURL=snabbdom.js.map
},{"./vnode":51,"./is":52,"./htmldomapi":53,"./h":54,"./thunk":55}],31:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateProps(oldVnode, vnode) {
    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in oldProps) {
        if (!props[key]) {
            delete elm[key];
        }
    }
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
exports.propsModule = { create: updateProps, update: updateProps };
exports.default = exports.propsModule;
//# sourceMappingURL=props.js.map
},{}],32:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var colonChar = 58;
var xChar = 120;
function updateAttrs(oldVnode, vnode) {
    var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    for (key in attrs) {
        var cur = attrs[key];
        var old = oldAttrs[key];
        if (old !== cur) {
            if (cur === true) {
                elm.setAttribute(key, "");
            }
            else if (cur === false) {
                elm.removeAttribute(key);
            }
            else {
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                }
                else if (key.charCodeAt(3) === colonChar) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}
exports.attributesModule = { create: updateAttrs, update: updateAttrs };
exports.default = exports.attributesModule;
//# sourceMappingURL=attributes.js.map
},{}],33:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === "object") {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode);
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i]);
            }
        }
    }
}
function handleEvent(event, vnode) {
    var name = event.type, on = vnode.data.on;
    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function updateEventListeners(oldVnode, vnode) {
    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }
    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                oldElm.removeEventListener(name, oldListener, false);
            }
        }
        else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
        }
    }
    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode.listener = oldVnode.listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;
        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                elm.addEventListener(name, listener, false);
            }
        }
        else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
exports.eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
};
exports.default = exports.eventListenersModule;
//# sourceMappingURL=eventlisteners.js.map
},{}],47:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
exports.htmlDomApi = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    isElement: isElement,
    isText: isText,
    isComment: isComment,
};
exports.default = exports.htmlDomApi;
//# sourceMappingURL=htmldomapi.js.map
},{}],34:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var htmldomapi_1 = require("./htmldomapi");
function toVNode(node, domApi) {
    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    var text;
    if (api.isElement(node)) {
        var id = node.id ? '#' + node.id : '';
        var cn = node.getAttribute('class');
        var c = cn ? '.' + cn.split(' ').join('.') : '';
        var sel = api.tagName(node).toLowerCase() + id + c;
        var attrs = {};
        var children = [];
        var name_1;
        var i = void 0, n = void 0;
        var elmAttrs = node.attributes;
        var elmChildren = node.childNodes;
        for (i = 0, n = elmAttrs.length; i < n; i++) {
            name_1 = elmAttrs[i].nodeName;
            if (name_1 !== 'id' && name_1 !== 'class') {
                attrs[name_1] = elmAttrs[i].nodeValue;
            }
        }
        for (i = 0, n = elmChildren.length; i < n; i++) {
            children.push(toVNode(elmChildren[i]));
        }
        return vnode_1.default(sel, { attrs: attrs }, children, undefined, node);
    }
    else if (api.isText(node)) {
        text = api.getTextContent(node);
        return vnode_1.default(undefined, undefined, undefined, text, node);
    }
    else if (api.isComment(node)) {
        text = api.getTextContent(node);
        return vnode_1.default('!', {}, [], text, node);
    }
    else {
        return vnode_1.default('', {}, [], undefined, node);
    }
}
exports.toVNode = toVNode;
exports.default = toVNode;
//# sourceMappingURL=tovnode.js.map
},{"./vnode":45,"./htmldomapi":47}],11:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isAlreadyInjected = isAlreadyInjected;
exports.default = injectUI;

var _handleError = require('./handle-error');

var _handleError2 = _interopRequireDefault(_handleError);

var _store = require('../store');

var _index = require('../components/index');

var _index2 = _interopRequireDefault(_index);

var _snabbdom = require('snabbdom');

var _h = require('snabbdom/h');

var _props = require('snabbdom/modules/props');

var _props2 = _interopRequireDefault(_props);

var _attributes = require('snabbdom/modules/attributes');

var _attributes2 = _interopRequireDefault(_attributes);

var _eventlisteners = require('snabbdom/modules/eventlisteners');

var _eventlisteners2 = _interopRequireDefault(_eventlisteners);

var _tovnode = require('snabbdom/tovnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storePromise = (0, _store.createStore)();
function isAlreadyInjected() {
    return document.querySelector('#nfe-container') != null;
}
function injectUI(streamContainer) {
    var nfeContainer = document.createElement("div");
    nfeContainer.id = "nfe-container";
    streamContainer.appendChild(nfeContainer);
    var patch = (0, _snabbdom.init)([_props2.default, _attributes2.default, _eventlisteners2.default]);
    var vnode = (0, _tovnode.toVNode)(nfeContainer);
    storePromise.then(function (store) {
        var render = function render() {
            var newVnode = (0, _h.h)("div#nfe-container", [(0, _index2.default)(store)]);
            patch(vnode, newVnode);
            vnode = newVnode;
        };
        render();
        store.subscribe(render);
    }).catch(_handleError2.default);
}
},{"./handle-error":24,"../store":41,"../components/index":13,"snabbdom":28,"snabbdom/h":30,"snabbdom/modules/props":31,"snabbdom/modules/attributes":32,"snabbdom/modules/eventlisteners":33,"snabbdom/tovnode":34}],59:[function(require,module,exports) {
'use strict';

var _injectUi = require('./lib/inject-ui');

var _injectUi2 = _interopRequireDefault(_injectUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _injectUi2.default)(document.querySelector('#options-container'));
},{"./lib/inject-ui":11}],60:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '63063' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[60,59], null)
//# sourceMappingURL=/options.fdf5fae5.map