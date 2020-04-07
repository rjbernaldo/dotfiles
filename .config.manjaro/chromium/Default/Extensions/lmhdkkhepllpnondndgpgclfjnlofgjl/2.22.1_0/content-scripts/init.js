/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 110);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(3);
var getKeys = __webpack_require__(37);
var redefine = __webpack_require__(29);
var global = __webpack_require__(8);
var hide = __webpack_require__(11);
var Iterators = __webpack_require__(22);
var wks = __webpack_require__(5);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(4);
var step = __webpack_require__(21);
var Iterators = __webpack_require__(22);
var toIObject = __webpack_require__(23);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(27)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(11)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(6)('wks');
var uid = __webpack_require__(10);
var Symbol = __webpack_require__(8).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(7);
var global = __webpack_require__(8);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(9) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(12);
var createDesc = __webpack_require__(20);
module.exports = __webpack_require__(16) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(13);
var IE8_DOM_DEFINE = __webpack_require__(15);
var toPrimitive = __webpack_require__(19);
var dP = Object.defineProperty;

exports.f = __webpack_require__(16) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(16) && !__webpack_require__(17)(function () {
  return Object.defineProperty(__webpack_require__(18)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(17)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
var document = __webpack_require__(8).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(14);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(24);
var defined = __webpack_require__(26);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(25);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(9);
var $export = __webpack_require__(28);
var redefine = __webpack_require__(29);
var hide = __webpack_require__(11);
var Iterators = __webpack_require__(22);
var $iterCreate = __webpack_require__(34);
var setToStringTag = __webpack_require__(46);
var getPrototypeOf = __webpack_require__(47);
var ITERATOR = __webpack_require__(5)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(8);
var core = __webpack_require__(7);
var hide = __webpack_require__(11);
var redefine = __webpack_require__(29);
var ctx = __webpack_require__(32);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(8);
var hide = __webpack_require__(11);
var has = __webpack_require__(30);
var SRC = __webpack_require__(10)('src');
var $toString = __webpack_require__(31);
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(7).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6)('native-function-to-string', Function.toString);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(33);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(35);
var descriptor = __webpack_require__(20);
var setToStringTag = __webpack_require__(46);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(11)(IteratorPrototype, __webpack_require__(5)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(13);
var dPs = __webpack_require__(36);
var enumBugKeys = __webpack_require__(44);
var IE_PROTO = __webpack_require__(43)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(18)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(45).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(12);
var anObject = __webpack_require__(13);
var getKeys = __webpack_require__(37);

module.exports = __webpack_require__(16) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(38);
var enumBugKeys = __webpack_require__(44);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(30);
var toIObject = __webpack_require__(23);
var arrayIndexOf = __webpack_require__(39)(false);
var IE_PROTO = __webpack_require__(43)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(23);
var toLength = __webpack_require__(40);
var toAbsoluteIndex = __webpack_require__(42);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(41);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(41);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(6)('keys');
var uid = __webpack_require__(10);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(8).document;
module.exports = document && document.documentElement;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(12).f;
var has = __webpack_require__(30);
var TAG = __webpack_require__(5)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(30);
var toObject = __webpack_require__(48);
var IE_PROTO = __webpack_require__(43)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(26);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(50);
var test = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(29)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(25);
var TAG = __webpack_require__(5)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBrowser", function() { return getBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBrowserName", function() { return getBrowserName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEnvironment", function() { return getEnvironment; });
/* harmony import */ var toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(62);

var getBrowser = () => {
  if (typeof browser !== 'undefined') {
    return browser;
  }

  if (typeof chrome !== 'undefined') {
    return chrome;
  }
};
function getBrowserName() {
  var _browser = getBrowser(); // browser is global so use _ to namespace


  var URL = _browser.runtime.getURL('');

  if (URL.startsWith(toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["BrowserExtensionPrefixMap"][toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["Browser"].Chrome])) {
    return toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["Browser"].Chrome;
  }

  if (URL.startsWith(toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["BrowserExtensionPrefixMap"][toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["Browser"].Firefox])) {
    return toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["Browser"].Firefox;
  }

  if (URL.startsWith(toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["BrowserExtensionPrefixMap"][toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["Browser"].Edge])) {
    return toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["Browser"].Edge;
  }

  return '';
}
function getEnvironment() {
  var _browser = getBrowser(); // browser is global so use _ to namespace


  var extensionId = _browser.runtime.id;
  var environment = toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["ExtensionIdEnvironmentMap"][extensionId];
  return environment || toolkit_core_common_constants__WEBPACK_IMPORTED_MODULE_0__["Environment"].Development;
}

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Browser", function() { return Browser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserExtensionPrefixMap", function() { return BrowserExtensionPrefixMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Environment", function() { return Environment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExtensionIds", function() { return ExtensionIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExtensionIdEnvironmentMap", function() { return ExtensionIdEnvironmentMap; });
var Browser = {
  Chrome: 'chrome',
  Edge: 'edge',
  Firefox: 'firefox'
};
var BrowserExtensionPrefixMap = {
  [Browser.Chrome]: 'chrome-extension://',
  [Browser.Edge]: 'ms-browser-extension://',
  [Browser.Firefox]: 'moz-extension://'
};
var Environment = {
  Beta: 'beta',
  Development: 'development',
  Production: 'production'
};
var ExtensionIds = {
  ChromeBeta: 'mkgdgjnaaejddflnldinkilabeglghlo',
  ChromeProduction: 'lmhdkkhepllpnondndgpgclfjnlofgjl',
  FirefoxProduction: '{4F1FB113-D7D8-40AE-A5BA-9300EAEA0F51}'
};
var ExtensionIdEnvironmentMap = {
  [ExtensionIds.ChromeBeta]: Environment.Beta,
  [ExtensionIds.ChromeProduction]: Environment.Production,
  [ExtensionIds.FirefoxProduction]: Environment.Production
};

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "featureSettingKey", function() { return featureSettingKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StorageArea", function() { return StorageArea; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolkitStorage", function() { return ToolkitStorage; });
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71);
/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(74);
/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(79);
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es7_object_entries__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(87);
/* harmony import */ var core_js_modules_es7_object_entries__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_entries__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(49);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es6_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(89);
/* harmony import */ var core_js_modules_es6_map__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_map__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(61);









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var FEATURE_SETTING_PREFIX = 'toolkit-feature:';
var featureSettingKey = featureName => `${FEATURE_SETTING_PREFIX}${featureName}`;
var StorageArea = {
  Local: 'local'
};
class ToolkitStorage {
  constructor(storageArea) {
    var _this = this;

    _defineProperty(this, "_browser", Object(toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_8__["getBrowser"])());

    _defineProperty(this, "_storageArea", 'local');

    _defineProperty(this, "_storageListeners", new Map());

    _defineProperty(this, "_listenForChanges", (changes, areaName) => {
      if (areaName !== this._storageArea) return;

      var _loop = function _loop() {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        if (_this._storageListeners.has(key)) {
          var listeners = _this._storageListeners.get(key);

          listeners.forEach(listener => {
            listener(value.newValue);
          });
        }
      };

      for (var _i = 0, _Object$entries = Object.entries(changes); _i < _Object$entries.length; _i++) {
        _loop();
      }
    });

    if (storageArea) {
      this._storageArea = storageArea;
    }

    this._browser.storage.onChanged.addListener(this._listenForChanges);
  } // many features have been built with the assumption that settings come back
  // as strings and it's just easier to maintain that assumption rather than update
  // those features. so override options with parse: false when getting feature settings


  getFeatureSetting(settingName) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var getFeatureSettingOptions = _objectSpread({
      parse: false
    }, options);

    return this.getStorageItem(featureSettingKey(settingName), getFeatureSettingOptions);
  }

  getFeatureSettings(settingNames) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var getFeatureSettingsOptions = _objectSpread({
      parse: false
    }, options);

    return Promise.all(settingNames.map(settingName => {
      return this.getStorageItem(featureSettingKey(settingName), getFeatureSettingsOptions);
    }));
  }

  setFeatureSetting(settingName, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.setStorageItem(featureSettingKey(settingName), value, options);
  }

  removeFeatureSetting(settingName) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.removeStorageItem(featureSettingKey(settingName), options);
  }

  getStorageItem(itemKey) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this._get(itemKey, options).then(value => {
      if (typeof value === 'undefined' && typeof options.default !== 'undefined') {
        return options.default;
      }

      return value;
    });
  }

  removeStorageItem(itemKey) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this._remove(itemKey, options);
  }

  setStorageItem(itemKey, itemData) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this._set(itemKey, itemData, options);
  }

  getStoredFeatureSettings() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._get(null, options).then(allStorage => {
      var storedSettings = [];

      for (var _i2 = 0, _Object$entries2 = Object.entries(allStorage); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 1),
            key = _Object$entries2$_i[0];

        if (key.startsWith(FEATURE_SETTING_PREFIX)) {
          storedSettings.push(key.replace(FEATURE_SETTING_PREFIX, ''));
        }
      }

      return storedSettings;
    });
  }

  onStorageItemChanged(storageKey, callback) {
    if (this._storageListeners.has(storageKey)) {
      var listeners = this._storageListeners.get(storageKey);

      this._storageListeners.set(storageKey, [...listeners, callback]);
    } else {
      this._storageListeners.set(storageKey, [callback]);
    }
  }

  offStorageItemChanged(storageKey, callback) {
    if (this._storageListeners.has(storageKey)) {
      var listeners = this._storageListeners.get(storageKey);

      this._storageListeners.set(storageKey, listeners.filter(listener => listener !== callback));
    }
  }

  onFeatureSettingChanged(settingName, callback) {
    this.onStorageItemChanged(featureSettingKey(settingName), callback);
  }

  offFeatureSettingChanged(settingName, callback) {
    this.offStorageItemChanged(featureSettingKey(settingName), callback);
  }

  _get(key, options) {
    var getOptions = _objectSpread({
      parse: true,
      storageArea: this._storageArea
    }, options);

    return new Promise((resolve, reject) => {
      try {
        this._browser.storage[getOptions.storageArea].get(key, data => {
          // if we're fetching everything -- don't try parsing it
          if (key === null) {
            return resolve(data);
          }

          try {
            if (getOptions.parse) {
              resolve(JSON.parse(data[key]));
            } else {
              resolve(data[key]);
            }
          } catch (_ignore) {
            resolve(data[key]);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  _remove(key, options) {
    var storageArea = options.storageArea || this._storageArea;
    return new Promise((resolve, reject) => {
      try {
        this._browser.storage[storageArea].remove(key, resolve);
      } catch (e) {
        reject(e);
      }
    });
  }

  _set(key, value, options) {
    var storageArea = options.storageArea || this._storageArea;
    return new Promise((resolve, reject) => {
      try {
        var update = {
          [key]: value
        };

        this._browser.storage[storageArea].set(update, resolve);
      } catch (e) {
        reject(e);
      }
    });
  }

}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__(28);
var ownKeys = __webpack_require__(65);
var toIObject = __webpack_require__(23);
var gOPD = __webpack_require__(68);
var createProperty = __webpack_require__(70);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__(66);
var gOPS = __webpack_require__(67);
var anObject = __webpack_require__(13);
var Reflect = __webpack_require__(8).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(38);
var hiddenKeys = __webpack_require__(44).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(69);
var createDesc = __webpack_require__(20);
var toIObject = __webpack_require__(23);
var toPrimitive = __webpack_require__(19);
var has = __webpack_require__(30);
var IE8_DOM_DEFINE = __webpack_require__(15);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(16) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 69 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(12);
var createDesc = __webpack_require__(20);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(72)('asyncIterator');


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(8);
var core = __webpack_require__(7);
var LIBRARY = __webpack_require__(9);
var wksExt = __webpack_require__(73);
var defineProperty = __webpack_require__(12).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(8);
var has = __webpack_require__(30);
var DESCRIPTORS = __webpack_require__(16);
var $export = __webpack_require__(28);
var redefine = __webpack_require__(29);
var META = __webpack_require__(75).KEY;
var $fails = __webpack_require__(17);
var shared = __webpack_require__(6);
var setToStringTag = __webpack_require__(46);
var uid = __webpack_require__(10);
var wks = __webpack_require__(5);
var wksExt = __webpack_require__(73);
var wksDefine = __webpack_require__(72);
var enumKeys = __webpack_require__(76);
var isArray = __webpack_require__(77);
var anObject = __webpack_require__(13);
var isObject = __webpack_require__(14);
var toObject = __webpack_require__(48);
var toIObject = __webpack_require__(23);
var toPrimitive = __webpack_require__(19);
var createDesc = __webpack_require__(20);
var _create = __webpack_require__(35);
var gOPNExt = __webpack_require__(78);
var $GOPD = __webpack_require__(68);
var $GOPS = __webpack_require__(67);
var $DP = __webpack_require__(12);
var $keys = __webpack_require__(37);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(66).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(69).f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(9)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(10)('meta');
var isObject = __webpack_require__(14);
var has = __webpack_require__(30);
var setDesc = __webpack_require__(12).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(17)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(37);
var gOPS = __webpack_require__(67);
var pIE = __webpack_require__(69);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(25);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(23);
var gOPN = __webpack_require__(66).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(13);
var toObject = __webpack_require__(48);
var toLength = __webpack_require__(40);
var toInteger = __webpack_require__(41);
var advanceStringIndex = __webpack_require__(80);
var regExpExec = __webpack_require__(82);
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__(83)('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__(81)(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(41);
var defined = __webpack_require__(26);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(50);
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(84);
var redefine = __webpack_require__(29);
var hide = __webpack_require__(11);
var fails = __webpack_require__(17);
var defined = __webpack_require__(26);
var wks = __webpack_require__(5);
var regexpExec = __webpack_require__(85);

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__(85);
__webpack_require__(28)({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__(86);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(13);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(28);
var $entries = __webpack_require__(88)(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(16);
var getKeys = __webpack_require__(37);
var toIObject = __webpack_require__(23);
var isEnum = __webpack_require__(69).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || isEnum.call(O, key)) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(90);
var validate = __webpack_require__(98);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(99)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(12).f;
var create = __webpack_require__(35);
var redefineAll = __webpack_require__(91);
var ctx = __webpack_require__(32);
var anInstance = __webpack_require__(92);
var forOf = __webpack_require__(93);
var $iterDefine = __webpack_require__(27);
var step = __webpack_require__(21);
var setSpecies = __webpack_require__(97);
var DESCRIPTORS = __webpack_require__(16);
var fastKey = __webpack_require__(75).fastKey;
var validate = __webpack_require__(98);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(29);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(32);
var call = __webpack_require__(94);
var isArrayIter = __webpack_require__(95);
var anObject = __webpack_require__(13);
var toLength = __webpack_require__(40);
var getIterFn = __webpack_require__(96);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(13);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(22);
var ITERATOR = __webpack_require__(5)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(50);
var ITERATOR = __webpack_require__(5)('iterator');
var Iterators = __webpack_require__(22);
module.exports = __webpack_require__(7).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(8);
var dP = __webpack_require__(12);
var DESCRIPTORS = __webpack_require__(16);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(8);
var $export = __webpack_require__(28);
var redefine = __webpack_require__(29);
var redefineAll = __webpack_require__(91);
var meta = __webpack_require__(75);
var forOf = __webpack_require__(93);
var anInstance = __webpack_require__(92);
var isObject = __webpack_require__(14);
var fails = __webpack_require__(17);
var $iterDetect = __webpack_require__(100);
var setToStringTag = __webpack_require__(46);
var inheritIfRequired = __webpack_require__(101);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(5)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
var setPrototypeOf = __webpack_require__(102).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(14);
var anObject = __webpack_require__(13);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(32)(Function.call, __webpack_require__(68).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUserSettings", function() { return getUserSettings; });
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(107);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "settingMigrationMap", function() { return _settings__WEBPACK_IMPORTED_MODULE_2__["settingMigrationMap"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "allToolkitSettings", function() { return _settings__WEBPACK_IMPORTED_MODULE_2__["allToolkitSettings"]; });

/* harmony import */ var toolkit_core_common_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(63);





var storage = new toolkit_core_common_storage__WEBPACK_IMPORTED_MODULE_3__["ToolkitStorage"]();

function ensureSettingIsValid(name, value) {
  var validValue = value;

  if (value === 'true' || value === 'false') {
    validValue = JSON.parse(value);
    return storage.setFeatureSetting(name, JSON.parse(value));
  }

  return validValue;
}

function getUserSettings() {
  return new Promise(function (resolve) {
    storage.getStoredFeatureSettings().then(storedFeatureSettings => {
      var settingPromises = _settings__WEBPACK_IMPORTED_MODULE_2__["allToolkitSettings"].map(setting => {
        var settingIsPersisted = storedFeatureSettings.includes(setting.name);

        if (settingIsPersisted) {
          return storage.getFeatureSetting(setting.name).then(persistedValue => ensureSettingIsValid(setting.name, persistedValue));
        }

        var migrationSetting = _settings__WEBPACK_IMPORTED_MODULE_2__["settingMigrationMap"][setting.name];

        if (migrationSetting && storedFeatureSettings.includes(migrationSetting.oldSettingName)) {
          var oldSettingName = migrationSetting.oldSettingName,
              settingMapping = migrationSetting.settingMapping;
          return storage.getFeatureSetting(oldSettingName).then(oldPersistedValue => {
            var newSetting = oldPersistedValue;

            if (settingMapping) {
              newSetting = settingMapping[oldPersistedValue];
            }

            return storage.setFeatureSetting(setting.name, newSetting).then(() => ensureSettingIsValid(setting.name, newSetting));
          });
        }

        return storage.setFeatureSetting(setting.name, setting.default).then(() => storage.getFeatureSetting(setting.name));
      });
      Promise.all(settingPromises).then(persistedSettings => {
        var userSettings = _settings__WEBPACK_IMPORTED_MODULE_2__["allToolkitSettings"].reduce((allSettings, currentSetting, index) => {
          allSettings[currentSetting.name] = persistedSettings[index];
          return allSettings;
        }, {});
        resolve(userSettings);
      });
    });
  });
}

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settingMigrationMap", function() { return settingMigrationMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "allToolkitSettings", function() { return allToolkitSettings; });
/* eslint-disable */

/*
 ***********************************************************
 * Warning: This is a file generated by the build process. *
 *                                                         *
 * Any changes you make manually will be overwritten       *
 * the next time you run ./build or build.bat!             *
 ***********************************************************
*/
if (typeof window.ynabToolKit === 'undefined') {
  window.ynabToolKit = {};
}

var settingMigrationMap = {
  "CategorySoloMode": {
    "oldSettingName": "ToggleMasterCategories",
    "settingMapping": {
      "true": "cat-toggle-all"
    }
  },
  "AutoEnableRunningBalance": {
    "oldSettingName": "RunningBalance",
    "settingMapping": {
      "0": false,
      "1": true,
      "2": true
    }
  }
};
var allToolkitSettings = [{
  "name": "l10n",
  "title": "Localization of YNAB",
  "default": "0",
  "section": "general",
  "type": "select",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Czech (56%)",
    "value": "czech"
  }, {
    "name": "Tagalog (1%)",
    "value": "tagalog"
  }, {
    "name": "Catalan (1%)",
    "value": "catalan"
  }, {
    "name": "Portuguese, Brazilian (100%)",
    "value": "portuguese, brazilian"
  }, {
    "name": "Chinese Simplified (5%)",
    "value": "chinese simplified"
  }, {
    "name": "Russian (29%)",
    "value": "russian"
  }, {
    "name": "Finnish (32%)",
    "value": "finnish"
  }, {
    "name": "Icelandic (3%)",
    "value": "icelandic"
  }, {
    "name": "Spanish (66%)",
    "value": "spanish"
  }, {
    "name": "Vietnamese (6%)",
    "value": "vietnamese"
  }, {
    "name": "Hungarian (34%)",
    "value": "hungarian"
  }, {
    "name": "Turkish (55%)",
    "value": "turkish"
  }, {
    "name": "Swedish (29%)",
    "value": "swedish"
  }, {
    "name": "Japanese (1%)",
    "value": "japanese"
  }, {
    "name": "German (63%)",
    "value": "german"
  }, {
    "name": "Latvian (7%)",
    "value": "latvian"
  }, {
    "name": "Ukrainian (3%)",
    "value": "ukrainian"
  }, {
    "name": "Italian (8%)",
    "value": "italian"
  }, {
    "name": "Chinese Traditional (21%)",
    "value": "chinese traditional"
  }, {
    "name": "Danish (27%)",
    "value": "danish"
  }, {
    "name": "Polish (63%)",
    "value": "polish"
  }, {
    "name": "Serbian (Cyrillic) (89%)",
    "value": "serbian (cyrillic)"
  }, {
    "name": "French (51%)",
    "value": "french"
  }, {
    "name": "Norwegian (36%)",
    "value": "norwegian"
  }, {
    "name": "Romanian (1%)",
    "value": "romanian"
  }, {
    "name": "Portuguese (26%)",
    "value": "portuguese"
  }, {
    "name": "Indonesian (55%)",
    "value": "indonesian"
  }, {
    "name": "Slovenian (1%)",
    "value": "slovenian"
  }, {
    "name": "Arabic (17%)",
    "value": "arabic"
  }, {
    "name": "Lithuanian (1%)",
    "value": "lithuanian"
  }, {
    "name": "Dutch (44%)",
    "value": "dutch"
  }],
  "actions": {
    "portuguese": ["injectScript", "legacy/features/l10n/locales/Portuguese.js", "injectScript", "legacy/features/l10n/main.js"],
    "czech": ["injectScript", "legacy/features/l10n/locales/Czech.js", "injectScript", "legacy/features/l10n/main.js"],
    "japanese": ["injectScript", "legacy/features/l10n/locales/Japanese.js", "injectScript", "legacy/features/l10n/main.js"],
    "spanish": ["injectScript", "legacy/features/l10n/locales/Spanish.js", "injectScript", "legacy/features/l10n/main.js"],
    "polish": ["injectScript", "legacy/features/l10n/locales/Polish.js", "injectScript", "legacy/features/l10n/main.js"],
    "arabic": ["injectScript", "legacy/features/l10n/locales/Arabic.js", "injectScript", "legacy/features/l10n/main.js"],
    "swedish": ["injectScript", "legacy/features/l10n/locales/Swedish.js", "injectScript", "legacy/features/l10n/main.js"],
    "icelandic": ["injectScript", "legacy/features/l10n/locales/Icelandic.js", "injectScript", "legacy/features/l10n/main.js"],
    "vietnamese": ["injectScript", "legacy/features/l10n/locales/Vietnamese.js", "injectScript", "legacy/features/l10n/main.js"],
    "romanian": ["injectScript", "legacy/features/l10n/locales/Romanian.js", "injectScript", "legacy/features/l10n/main.js"],
    "slovenian": ["injectScript", "legacy/features/l10n/locales/Slovenian.js", "injectScript", "legacy/features/l10n/main.js"],
    "german": ["injectScript", "legacy/features/l10n/locales/German.js", "injectScript", "legacy/features/l10n/main.js"],
    "dutch": ["injectScript", "legacy/features/l10n/locales/Dutch.js", "injectScript", "legacy/features/l10n/main.js"],
    "portuguese, brazilian": ["injectScript", "legacy/features/l10n/locales/Portuguese, Brazilian.js", "injectScript", "legacy/features/l10n/main.js"],
    "serbian (cyrillic)": ["injectScript", "legacy/features/l10n/locales/Serbian (Cyrillic).js", "injectScript", "legacy/features/l10n/main.js"],
    "danish": ["injectScript", "legacy/features/l10n/locales/Danish.js", "injectScript", "legacy/features/l10n/main.js"],
    "indonesian": ["injectScript", "legacy/features/l10n/locales/Indonesian.js", "injectScript", "legacy/features/l10n/main.js"],
    "tagalog": ["injectScript", "legacy/features/l10n/locales/Tagalog.js", "injectScript", "legacy/features/l10n/main.js"],
    "hungarian": ["injectScript", "legacy/features/l10n/locales/Hungarian.js", "injectScript", "legacy/features/l10n/main.js"],
    "ukrainian": ["injectScript", "legacy/features/l10n/locales/Ukrainian.js", "injectScript", "legacy/features/l10n/main.js"],
    "lithuanian": ["injectScript", "legacy/features/l10n/locales/Lithuanian.js", "injectScript", "legacy/features/l10n/main.js"],
    "french": ["injectScript", "legacy/features/l10n/locales/French.js", "injectScript", "legacy/features/l10n/main.js"],
    "catalan": ["injectScript", "legacy/features/l10n/locales/Catalan.js", "injectScript", "legacy/features/l10n/main.js"],
    "russian": ["injectScript", "legacy/features/l10n/locales/Russian.js", "injectScript", "legacy/features/l10n/main.js"],
    "finnish": ["injectScript", "legacy/features/l10n/locales/Finnish.js", "injectScript", "legacy/features/l10n/main.js"],
    "norwegian": ["injectScript", "legacy/features/l10n/locales/Norwegian.js", "injectScript", "legacy/features/l10n/main.js"],
    "chinese traditional": ["injectScript", "legacy/features/l10n/locales/Chinese Traditional.js", "injectScript", "legacy/features/l10n/main.js"],
    "turkish": ["injectScript", "legacy/features/l10n/locales/Turkish.js", "injectScript", "legacy/features/l10n/main.js"],
    "chinese simplified": ["injectScript", "legacy/features/l10n/locales/Chinese Simplified.js", "injectScript", "legacy/features/l10n/main.js"],
    "latvian": ["injectScript", "legacy/features/l10n/locales/Latvian.js", "injectScript", "legacy/features/l10n/main.js"],
    "italian": ["injectScript", "legacy/features/l10n/locales/Italian.js", "injectScript", "legacy/features/l10n/main.js"]
  },
  "description": "Localization of interface."
}, {
  "name": "AutoDistributeSplits",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Add Auto-Distribute Button To Split Transactions",
  "description": "Allows you to distribute the remaining amount in a split transaction proportionally to sub-transactions"
}, {
  "name": "AutoEnableRunningBalance",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Automatically Enable Running Balance",
  "description": "Enables YNAB's native \"Running Balance\" by default for each account register."
}, {
  "name": "AutomaticallyMarkAsCleared",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Automatically Mark Transaction as Cleared",
  "description": "Automatically mark transaction as cleared when you enter it manually."
}, {
  "name": "BottomNotificationBar",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Bottom Notification Bar",
  "description": "Move the notification bar to the bottom as an overlay. This prevents the transactions from \"jumping around.\""
}, {
  "name": "BulkManagePayees",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Bulk Manage Payees",
  "description": "Adds an option to the transaction edit drop-down menu to manage payees for the current selection."
}, {
  "name": "CalendarFirstDay",
  "type": "select",
  "default": "0",
  "section": "accounts",
  "title": "First Day of the Week in Calendar",
  "description": "Change the first day of the week when viewing the calendar.",
  "options": [{
    "name": "Default (Sunday)",
    "value": "0"
  }, {
    "name": "Monday",
    "value": "1"
  }, {
    "name": "Tuesday",
    "value": "2"
  }, {
    "name": "Wednesday",
    "value": "3"
  }, {
    "name": "Thursday",
    "value": "4"
  }, {
    "name": "Friday",
    "value": "5"
  }, {
    "name": "Saturday",
    "value": "6"
  }]
}, {
  "name": "ChangeEnterBehavior",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Change Behaviour of Enter Key When Adding Transactions",
  "description": "When you press enter while adding transactions, the default behaviour is 'Save and add another'. This option changes it to just 'Save'."
}, {
  "name": "ChangeMemoEnterBehavior",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Change Behaviour of Enter Key on the Memo field When Adding or Editing Transactions",
  "description": "When you press enter on the memo field while adding or editing a transaction, the default behaviour is 'Save' or 'Save and add another'. This option changes it to move to the next field."
}, {
  "name": "CheckNumbers",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Add Check Number Column",
  "description": "Adds the check number column to your account view."
}, {
  "name": "ClearSelection",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Clear Selection",
  "description": "Adds an option to the transaction edit drop-down menu to clear the current selection."
}, {
  "name": "ConfirmKeyboardCancelationOfTransactionChanges",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Confirm keyboard-initiated transaction cancelation",
  "description": "Displays a pop-up confirmation prompt when transaction row's \"Cancel\" action is triggered by keyboard press (\"Enter\"). This guards against inadvertent discarding of complex split transaction entries in keyboard driven entry workflows."
}, {
  "name": "CustomFlagNames",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Set Custom Flag Names (with Tooltips)",
  "description": "Adds the ability to set custom flag names. Tooltip for the flag name will only be visible when the cursor is hovered over the flag. *__Note__: Custom flag names are stored locally in the browser in which they are set and will __not__ be carried over to other browsers/computers. Custom flag names will be lost if browser data is cleared.*"
}, {
  "name": "DeselectTransactionsOnSave",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Deselect Transactions on Save",
  "description": "Deselects all transactions after any transaction is saved."
}, {
  "name": "EasyTransactionApproval",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Easy Transaction Approval",
  "description": "Quickly approve scheduled or linked transactions by selecting the transaction(s) and pressing 'a' or 'enter' on your keyboard. Alternately, approve single scheduled or linked transactions by right clicking on the blue 'i' or link icon."
}, {
  "name": "AccountsEmphasizedOutflows",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Emphasize Outflows",
  "description": "Make values in the outflow column red and put them in parenthesis."
}, {
  "name": "LargerClickableIcons",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Larger Clickable Area for Icons",
  "description": "Makes the uncleared, cleared and reconciled icons easier to select."
}, {
  "name": "ReconciledTextColor",
  "type": "select",
  "default": false,
  "section": "accounts",
  "title": "Reconciled Text Colour",
  "description": "Makes the text on reconciled transactions appear in a more obvious colour of your choosing.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Green",
    "value": "1"
  }, {
    "name": "Light gray",
    "value": "2"
  }, {
    "name": "Dark gray",
    "value": "3"
  }, {
    "name": "Dark gray with green background",
    "value": "4"
  }]
}, {
  "name": "RightClickToEdit",
  "type": "checkbox",
  "default": true,
  "section": "accounts",
  "title": "Show Menu When Right Clicking On Transaction",
  "description": "Right clicking on a transaction will show the contextual menu, allowing easy access to the Edit menu options."
}, {
  "name": "RowHeight",
  "type": "select",
  "default": "0",
  "section": "accounts",
  "title": "Height of Rows in Account Register",
  "description": "Change the height of transaction rows so more of them are displayed on the screen.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Compact",
    "value": "1"
  }, {
    "name": "Slim",
    "value": "2"
  }]
}, {
  "name": "SetMultipleFlags",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Edit Multiple Flags at Once",
  "description": "Adds a button to the edit dialog which allows you to set the flag. If multiple transactions are selected, all transactions are updated."
}, {
  "name": "ShowCategoryBalance",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Show Available Category Balance on Hover",
  "description": "Adds the total available balance to the category tooltip on each row in the Accounts register."
}, {
  "name": "SpareChange",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Show Spare Change",
  "description": "Imagine if you paid for all purchases in whole dollars. Shows a total of the spare change you would accumulate for the selected outflow transactions."
}, {
  "name": "SplitTransactionAutoAdjust",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Auto Adjust Split Transactions",
  "description": "When entering split transactions, each additional split will be auto-filled with the current remaining amount."
}, {
  "name": "AccountsStripedRows",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Striped Transaction Rows",
  "description": "Shows a light gray background on every other transaction row."
}, {
  "name": "SwapClearedFlagged",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Swap cleared and flagged columns",
  "description": "Place the Cleared column on the left and the Flagged column on the right sides of an account screen."
}, {
  "name": "ToggleSplits",
  "type": "checkbox",
  "default": false,
  "section": "accounts",
  "title": "Add a Toggle Splits Button to the Account(s) toolbar",
  "description": "Clicking the Toggle Splits button shows or hides all sub-transactions within all split transactions."
}, {
  "name": "ToggleTransactionFilters",
  "type": "select",
  "default": "0",
  "section": "accounts",
  "title": "Toggle Scheduled and Reconciled Transaction Buttons",
  "description": "Easily show and hide scheduled and reconciled transactions with one click.",
  "options": [{
    "name": "Disabled",
    "value": "0"
  }, {
    "name": "Show Icons",
    "value": "1"
  }, {
    "name": "Show Icons and Text Labels",
    "value": "2"
  }]
}, {
  "name": "DisableToolkit",
  "type": "checkbox",
  "default": false,
  "section": "advanced",
  "title": "Disable Toolkit for YNAB",
  "description": "Turn all features on and off with a single switch."
}, {
  "name": "DisplayTargetGoalAmount",
  "type": "select",
  "default": "0",
  "section": "budget",
  "title": "Display Target Goal Amount And Overbudget Warning",
  "description": "Adds a 'Goal' column which displays the target goal amount for every category with a goal, and a warning in red if you have budgeted beyond your goal.",
  "options": [{
    "name": "Do not display goal amount (default)",
    "value": "0"
  }, {
    "name": "Display goal amount and warn of overbudget with red",
    "value": "1"
  }, {
    "name": "Display goal amount but show overbudget as green",
    "value": "2"
  }, {
    "name": "Display goal amount with no emphasis",
    "value": "3"
  }]
}, {
  "name": "GoalIndicator",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Add Goals Indication",
  "description": "Add indicators for subcategories with goals. Types: (M)onthly goal,  target by (D)ate goal, (T)arget without date, and (U)pcoming transactions."
}, {
  "name": "GoalWarningColor",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Goal Indicator Warning Color",
  "description": "Change the orange goal underfunded warning to blue, to better differentiate it from credit card overspending."
}, {
  "name": "HighlightNegatives",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Highlight all Negative Category Balances Red",
  "description": "Ensure all negative balances are highlighted red instead of yellow, even with credit card spending."
}, {
  "name": "BudgetCategoryFeatures",
  "section": "system",
  "default": true
}, {
  "name": "TargetBalanceWarning",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Warn When Target Balance is Not Reached",
  "description": "Will highlight balances of categories with Target Balances that have not yet been met."
}, {
  "name": "BudgetProgressBars",
  "type": "select",
  "default": false,
  "hidden": false,
  "section": "budget",
  "title": "Budget Rows Progress Bars",
  "description": "Add progress bars and a vertical bar that shows how far you are through the month to category rows.",
  "options": [{
    "name": "Off",
    "value": "0"
  }, {
    "name": "Goals progress",
    "value": "goals"
  }, {
    "name": "Pacing progress",
    "value": "pacing"
  }, {
    "name": "Pacing on name column and goals on budgeted column",
    "value": "both"
  }]
}, {
  "name": "BudgetSpendingGoal",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Spending Goal",
  "description": "Allows the monthly funding goal to be set as a max spending goal for each category."
}, {
  "name": "CategoryActivityCopy",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Add Copy Transactions button to the Category Popup",
  "description": "Adds a button to the category activity popup to allow you to copy the transactions to the clipboard (able to be pasted into a spreadsheet app)."
}, {
  "name": "CategoryActivityPopupWidth",
  "type": "select",
  "default": "0",
  "section": "budget",
  "title": "Width of Category Popup",
  "description": "Makes the screen that pops up when you click on activity from a budget category wider so you can see more details of the transactions listed.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Medium",
    "value": "1"
  }, {
    "name": "Large",
    "value": "2"
  }]
}, {
  "name": "CategorySoloMode",
  "type": "select",
  "default": false,
  "section": "budget",
  "title": "Category Solo Mode and Toggle Master Categories",
  "description": "Keeps only the selected category open collapsing all others and adds a button to the Budget Toolbar to open or close all master categories at once.",
  "options": [{
    "name": "Off",
    "value": "0"
  }, {
    "name": "Enable Category Solo Mode",
    "value": "cat-solo-mode"
  }, {
    "name": "Enable Toggle All Categories",
    "value": "cat-toggle-all"
  }, {
    "name": "Enable both",
    "value": "cat-solo-mode-toggle-all"
  }]
}, {
  "name": "CheckCreditBalances",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Paid in Full Credit Card Assist",
  "description": "Highlights credit card category balances with a yellow warning if the balance of the category does not match the account balance. Adds a button to the Inspector to rectify the difference."
}, {
  "name": "CreditCardEmoji",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Credit Card Emoji",
  "description": "Adds a credit card emoji 💳 to the \"Credit Card Payments\" category."
}, {
  "name": "DateOfMoney",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Date Of Money",
  "description": "Hover the mouse over Age of Money to display the date of the income.\n For example, on 11th January with Age of Money = 10, Date of Money would be 1st January."
}, {
  "name": "DaysOfBuffering",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Days of Buffering Metric",
  "description": "This calculation shows how long your money would likely last if you never earned another cent based on your average spending. We know that no month is 'average' but this should give you some idea of how much of a buffer you have. Equal to budget accounts total divided by the average daily outflow. That comes from sum of all outflow transactions from on budget accounts only divided by the age of budget in days. You can also change the number of days taken into account by this metric with the 'Days of Buffering History Lookup' setting."
}, {
  "name": "DaysOfBufferingHistoryLookup",
  "type": "select",
  "default": "0",
  "section": "budget",
  "title": "Days of Buffering History Lookup",
  "description": "How old transactions should be used for average daily outflow calculation.",
  "options": [{
    "name": "All",
    "value": "0"
  }, {
    "name": "1 year",
    "value": "12"
  }, {
    "name": "6 months",
    "value": "6"
  }, {
    "name": "3 months",
    "value": "3"
  }, {
    "name": "1 month",
    "value": "1"
  }]
}, {
  "name": "DaysOfBufferingDate",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Days Of Buffering Metric - Date",
  "description": "Hover the mouse over Days of Buffering to display the equivalent Date for Days of Buffering.\n For example, on 1st January with Days of Buffering = 10, Date of Buffering would be 11th January."
}, {
  "name": "DisplayTotalMonthlyGoals",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Display Total Monthly Goals",
  "description": "Adds a 'Total Monthly Goals' to the budget inspector, which displays the total amount of monthly funding goals."
}, {
  "name": "DisplayUpcomingAmount",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Show Upcoming Transaction Total",
  "description": "Adds the total of upcoming transactions alongside activity for each category."
}, {
  "name": "EnlargeCategoriesDropdown",
  "type": "checkbox",
  "default": true,
  "section": "budget",
  "title": "Make the Categories Dropdown Larger",
  "description": "The Categories Dropdown that shows in the move money modal is quite small. Show more categories if the page real estate allows for it."
}, {
  "name": "EnterToMove",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Add \"Enter\" Shortcut to the Move Popup",
  "description": "Pressing Enter in the Move Popup acts like clicking the OK button, instead of losing focus or doing nothing."
}, {
  "name": "FilterCategories",
  "type": "checkbox",
  "default": true,
  "section": "budget",
  "title": "Enable Categories Filter",
  "description": "Enable textbox at budget page for categories filtering"
}, {
  "name": "HideAgeOfMoney",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Hide Age of Money Calculation",
  "description": "Hides the Age of Money calculation. Some users find it's not relevant or helpful for them, so they'd rather hide it. NOTE: YNAB will continue to run its Age of Money calculations, so the data will be up to date if you decide to show it again."
}, {
  "name": "HideTotalAvailable",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Hide Total Available",
  "description": "Hides the \"Total Available\" section in the budget inspector."
}, {
  "name": "CurrentMonthIndicator",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Current Month Indicator",
  "description": "Changes the header bar's background color to a lighter blue when viewing the current month to better differentiate between months."
}, {
  "name": "IncomeFromLastMonth",
  "type": "select",
  "default": "0",
  "section": "budget",
  "title": "Income From Last Month",
  "description": "Show total of incoming transactions for last month in the header.",
  "options": [{
    "name": "Disabled",
    "value": "0"
  }, {
    "name": "Use previous month",
    "value": "1"
  }, {
    "name": "Use month before last",
    "value": "2"
  }, {
    "name": "Use two months before last",
    "value": "3"
  }, {
    "name": "Use three months before last",
    "value": "4"
  }]
}, {
  "name": "LinkToInflows",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Link to Inflows",
  "description": "Clicking on the \"Total Inflows\" section of the budget inspector will link to the inflow transactions for that month."
}, {
  "name": "MonthlyNotesPopupWidth",
  "type": "select",
  "default": "0",
  "section": "budget",
  "title": "Width of Monthly Notes Popup",
  "description": "Makes the screen that pops up when you click on 'Enter a note...' below the month name wider so you can add more text.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Medium",
    "value": "1"
  }, {
    "name": "Large",
    "value": "2"
  }]
}, {
  "name": "NotesAsMarkdown",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Allow Markdown in Notes",
  "description": "Adds Markdown parsing to notes, allowing support for links, bullet points, and other formatting tools. Learn how to use Markdown [here](https://www.markdownguide.org/cheat-sheet)."
}, {
  "name": "Pacing",
  "type": "select",
  "default": false,
  "section": "budget",
  "title": "Add Pacing to the Budget",
  "description": "Add a column for 'pacing' which shows you how much money you've spent based on how far you are through the month. Note that clicking on the pacing value will toggle emphasis, allowing you to selectively enable the feature per category.",
  "options": [{
    "name": "Disabled",
    "value": "0"
  }, {
    "name": "Show Full Amount",
    "value": "1"
  }, {
    "name": "Show Simple Indicator",
    "value": "2"
  }, {
    "name": "Show Days Ahead/Behind Schedule",
    "value": "3"
  }]
}, {
  "name": "QuickBudgetWarning",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Warn When Clicking a Quick Budget Option",
  "description": "When this feature is activated, there will be a warning if you have already budgeted something."
}, {
  "name": "RemovePositiveHighlight",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Unhighlight all Positive Category Balances",
  "description": "Removes the highlight colour from positive (or zero) category balances and colours positive balances green instead."
}, {
  "name": "RemoveZeroCategories",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Remove Zero and Negative Categories When Covering Over-Budgeting",
  "description": "\nDefault YNAB behaviour is to show these categories when covering overbudgeting, but since they've got no money in them they won't help you. Let's clean up the menu.\n"
}, {
  "name": "ResizeInspector",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Allow Resizing of Inspector",
  "description": "Adds a button to the Budget Toolbar that allows resizing the Budget Inspector to predetermined widths of 33% (YNAB default), 25%, 20%, 15%, or 0%. Note that smaller values maybe not be suitable on small screens."
}, {
  "name": "RowsHeight",
  "type": "select",
  "default": "0",
  "section": "budget",
  "title": "Height of Budget Rows",
  "description": "Makes the budget rows skinnier than the default YNAB style so that you can fit more on the screen.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Compact",
    "value": "1"
  }, {
    "name": "Slim",
    "value": "2"
  }, {
    "name": "Slim with smaller font",
    "value": "3"
  }]
}, {
  "name": "SeamlessBudgetHeader",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Seamless Budget Header",
  "description": "Remove the borders between selected month, funds and Age of Money in the budget header."
}, {
  "name": "StealingFromFuture",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Stealing From Future Alert",
  "description": "Highlights \"Budget Next Month\" red when you've gone negative as some point in the future."
}, {
  "name": "StripedBudgetRows",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "Striped Budget Rows",
  "description": "Shows a light gray background on alternating category rows."
}, {
  "name": "ToBeBudgetedWarning",
  "type": "checkbox",
  "default": false,
  "section": "budget",
  "title": "To Be Budgeted Warning",
  "description": "Changes the 'To Be Budgeted' background color to yellow if there is unallocated money left to be budgeted."
}, {
  "name": "AccountsDisplayDensity",
  "type": "select",
  "default": "0",
  "section": "general",
  "title": "Account Name Height",
  "description": "Makes the account names smaller so that you can see more of the account names and fit more on the screen.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Compact",
    "value": "1"
  }, {
    "name": "Slim",
    "value": "2"
  }]
}, {
  "name": "BetterScrollbars",
  "type": "select",
  "default": "0",
  "section": "general",
  "title": "Better scrollbars",
  "description": "Provides smaller and cleaner scrollbars across the application.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Small",
    "value": "1"
  }, {
    "name": "Tiny",
    "value": "2"
  }, {
    "name": "Off",
    "value": "3"
  }]
}, {
  "name": "BudgetQuickSwitch",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "Budget Quick Switch",
  "description": "Adds the list of budgets to the Open Budget dropdown so you don't have to navigate to the 'Open Budget' page to switch budgets."
}, {
  "name": "CollapseSideMenu",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "Collapsable Side Menu",
  "description": "Adds a button that can collapse the menu on the left so you can see more of your accounts or budget data."
}, {
  "name": "ColourBlindMode",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "Colour Blind Mode",
  "description": "Changes colours like red, yellow and green in the interface to colours and shapes that are more easily distinguishable by colourblind people."
}, {
  "name": "EditAccountButton",
  "type": "select",
  "default": "0",
  "section": "general",
  "title": "Hide Edit Account Button",
  "description": "Allows you to hide the edit account button to help prevent accidentally clicking on it.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Hidden (right-click to edit)",
    "value": "2"
  }]
}, {
  "name": "GoogleFontsSelector",
  "type": "select",
  "default": "0",
  "section": "general",
  "title": "Interface Font",
  "description": "Select a font from the Google Fonts library or choose to use your system font.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Open Sans",
    "value": "1"
  }, {
    "name": "Roboto",
    "value": "2"
  }, {
    "name": "Roboto Condensed",
    "value": "3"
  }, {
    "name": "Droid Sans",
    "value": "4"
  }, {
    "name": "Inconsolata",
    "value": "5"
  }, {
    "name": "System font",
    "value": "6"
  }]
}, {
  "name": "HideAccountBalancesType",
  "type": "select",
  "default": "0",
  "section": "general",
  "title": "Hide Account Balances",
  "description": "Allows you to hide account type totals and/or account balances.",
  "options": [{
    "name": "Disabled",
    "value": "0"
  }, {
    "name": "Hide All",
    "value": "1"
  }, {
    "name": "Hide Account Type Totals",
    "value": "2"
  }, {
    "name": "Hide Account Balances",
    "value": "3"
  }]
}, {
  "name": "HideClosedAccounts",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "Hide Closed Accounts",
  "description": "This feature hides the closed accounts section in the side menu. View the account-options popup (click your e-mail) to show or hide the closed accounts."
}, {
  "name": "HideHelp",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "Hide Help (?) Button",
  "description": "This feature hides the blue help (?) button in the bottom right corner of the screen. View the account-options popup (click your e-mail) to show or hide the help button."
}, {
  "name": "HideReferralBanner",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "Hide Referral Banner",
  "description": "YNAB shows a \"Share YNAB, Get YNAB free\" banner. If you'd rather not see this banner, you can turn this feature on to hide it."
}, {
  "name": "ImportNotification",
  "type": "select",
  "default": "0",
  "section": "general",
  "title": "Show Import Notifications in Navigation Sidebar",
  "description": "Underline account names in the navigation sidebar that have transactions to be imported. Hovering the mouse over the account name will display the number of transactions to be imported.",
  "options": [{
    "name": "Off",
    "value": "0"
  }, {
    "name": "On - Underline account names in white",
    "value": "1"
  }, {
    "name": "On - Underline account names in red",
    "value": "2"
  }]
}, {
  "name": "NavDisplayDensity",
  "type": "select",
  "default": "0",
  "section": "general",
  "title": "Navigation Tabs Height",
  "description": "Makes the navigation tabs (Budget, Reports, etc) smaller, and with less padding, so that you can see more of the sidebar on the screen.",
  "options": [{
    "name": "Default",
    "value": "0"
  }, {
    "name": "Compact",
    "value": "1"
  }, {
    "name": "Slim",
    "value": "2"
  }]
}, {
  "name": "POSStyleCurrencyEntryMode",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "POS-style currency entry mode",
  "description": "Allow entry of currency values without decimal separators (as done in real-life on POS terminals). For example, entering a figure of \"500\" will expand to \"5.00\". Values containing decimal separator of current account are left unmodified (e.g. \"50.00\" will stay \"50.00\"). As a shorthand, values ending with \"-\" will be expanded to full monetary unit (e.g. \"50-\" will result in \"50.00\"). Math operations are supported as well (e.g. \"50*5\" becomes \"2.50\")."
}, {
  "name": "PrintingImprovements",
  "type": "checkbox",
  "default": true,
  "section": "general",
  "title": "Printing Improvements",
  "description": "Changes print styles so budget and account sections can be easily printed. Due to the number of columns, the account section should be printed using landscape orientation."
}, {
  "name": "PrivacyMode",
  "type": "select",
  "default": "0",
  "section": "general",
  "title": "Privacy Mode",
  "description": "Obscures dollar amounts everywhere until hovered. In toggle mode, a lock icon will appear to the right of your budget name in the top left corner of YNAB. Click to enable or disable privacy mode.",
  "options": [{
    "name": "Disabled",
    "value": "0"
  }, {
    "name": "Always On",
    "value": "1"
  }, {
    "name": "Add Toggle Button",
    "value": "2"
  }]
}, {
  "name": "ResizeSidebar",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "Allow Resizing of Side Menu",
  "description": "Allows the Side Menu on the left to be resized. Resizing also allows longer account names to show up completely."
}, {
  "name": "SquareNegativeMode",
  "type": "checkbox",
  "default": false,
  "section": "general",
  "title": "Square Negative Mode",
  "description": "Changes the round borders on all negative numbers to square. Helps them become more of an eyesore so you want to get rid of them!"
}, {
  "name": "CompactIncomeVsExpense",
  "type": "checkbox",
  "default": false,
  "section": "reports",
  "title": "Compact Income vs. Expense",
  "description": "Modifies styling of the Income vs. Expense report so it doesn't use too much white space on the page."
}, {
  "name": "IncomeVsExpenseHoverHighlight",
  "type": "checkbox",
  "default": true,
  "section": "reports",
  "title": "Highlight Income vs Expense Row on Hover",
  "description": "Provides a highlight over the currently hovered row on the native YNAB Income vs Expense report."
}, {
  "name": "ViewZeroAsEmpty",
  "type": "checkbox",
  "default": false,
  "section": "reports",
  "title": "View Zero as Empty",
  "description": "If a cell is zero, replace it with an empty cell so it is easier to focus on non-zero cells. \"Total\" rows are not modified."
}, {
  "name": "ToolkitReports",
  "section": "general",
  "default": true,
  "type": "checkbox",
  "title": "Toolkit Reports",
  "description": "Adds Toolkit Reports to the sidebar. Current reports include: Net Worth, Spending By Category/Payee, and Income vs Expense"
}]; // eslint-disable-next-line quotes, object-curly-spacing, quote-props

window.ynabToolKit.settings = allToolkitSettings; // We don't update these from anywhere else, so go ahead and freeze / seal the object so nothing can be injected.

Object.freeze(window.ynabToolKit.settings);
Object.seal(window.ynabToolKit.settings);

/***/ }),
/* 108 */,
/* 109 */,
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(61);
/* harmony import */ var toolkit_core_common_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(63);
/* harmony import */ var toolkit_core_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(106);
/* harmony import */ var _dom_injectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(111);



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }






var storage = new toolkit_core_common_storage__WEBPACK_IMPORTED_MODULE_3__["ToolkitStorage"]();

function applySettingsToDom(userSettings) {
  toolkit_core_settings__WEBPACK_IMPORTED_MODULE_4__["allToolkitSettings"].forEach(setting => {
    var userSettingValue = userSettings[setting.name]; // Check for specific upgrade path where a boolean setting gets
    // changed to a select. Previous value will be 'true' but
    // that should map to '1' in select land.
    // eslint-disable-next-line eqeqeq

    if (setting.actions && userSettingValue === true && '1' in setting.actions && !('true' in setting.actions)) {
      userSettingValue = '1';
    }

    if (setting.actions && userSettingValue in setting.actions) {
      var selectedActions = setting.actions[userSettingValue.toString()];

      for (var i = 0; i < selectedActions.length; i += 2) {
        var action = selectedActions[i];
        var target = selectedActions[i + 1];

        if (action === 'injectCSS') {
          Object(_dom_injectors__WEBPACK_IMPORTED_MODULE_5__["injectCSS"])(`web-accessibles/${target}`);
        } else if (action === 'injectScript') {
          Object(_dom_injectors__WEBPACK_IMPORTED_MODULE_5__["injectScript"])(`web-accessibles/${target}`);
        } else {
          var error = `Invalid Action: "${action}". Only injectCSS and injectScript are currently supported.`;
          throw error;
        }
      }
    }
  });
}

function sendToolkitBootstrap(options) {
  var browser = Object(toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_2__["getBrowser"])();
  var environment = Object(toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_2__["getEnvironment"])();
  var manifest = browser.runtime.getManifest();
  window.postMessage({
    type: 'ynab-toolkit-bootstrap',
    ynabToolKit: {
      assets: {
        logo: browser.runtime.getURL('assets/images/logos/toolkitforynab-logo-400.png')
      },
      environment,
      extensionId: browser.runtime.id,
      name: manifest.name,
      options,
      version: manifest.version
    }
  }, '*');
}

function messageHandler(event) {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'ynab-toolkit-loaded':
        initializeYNABToolkit();
        break;

      case 'ynab-toolkit-error':
        handleToolkitError(event.data.context);
        break;
    }
  }
}

function handleToolkitError(context) {
  Object(toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_2__["getBrowser"])().runtime.sendMessage({
    type: 'error',
    context
  });
}

function initializeYNABToolkit() {
  return _initializeYNABToolkit.apply(this, arguments);
}

function _initializeYNABToolkit() {
  _initializeYNABToolkit = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var userSettings;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Object(toolkit_core_settings__WEBPACK_IMPORTED_MODULE_4__["getUserSettings"])();

          case 2:
            userSettings = _context.sent;
            sendToolkitBootstrap(userSettings);
            /* Load this to setup shared utility functions */

            Object(_dom_injectors__WEBPACK_IMPORTED_MODULE_5__["injectScript"])('web-accessibles/legacy/features/shared/main.js');
            /* Global toolkit css. */

            Object(_dom_injectors__WEBPACK_IMPORTED_MODULE_5__["injectCSS"])('web-accessibles/legacy/features/shared/main.css');
            /* This script to be built automatically by the python script */

            Object(_dom_injectors__WEBPACK_IMPORTED_MODULE_5__["injectScript"])('web-accessibles/legacy/features/act-on-change/feedChanges.js');
            /* Load this to setup behaviors when the DOM updates and shared functions */

            Object(_dom_injectors__WEBPACK_IMPORTED_MODULE_5__["injectScript"])('web-accessibles/legacy/features/act-on-change/main.js');
            applySettingsToDom(userSettings);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _initializeYNABToolkit.apply(this, arguments);
}

function init() {
  return _init.apply(this, arguments);
}

function _init() {
  _init = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var isToolkitDisabled;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return storage.getFeatureSetting('DisableToolkit');

          case 2:
            isToolkitDisabled = _context2.sent;

            if (!isToolkitDisabled) {
              _context2.next = 6;
              break;
            }

            console.log(`${Object(toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_2__["getBrowser"])().runtime.getManifest().name} is disabled!`);
            return _context2.abrupt("return");

          case 6:
            // Load the toolkit bundle onto the YNAB dom
            Object(_dom_injectors__WEBPACK_IMPORTED_MODULE_5__["injectScript"])('web-accessibles/ynab-toolkit.js'); // wait for the bundle to tell us it's loaded

            window.addEventListener('message', messageHandler);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _init.apply(this, arguments);
}

init();

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectCSS", function() { return injectCSS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectScript", function() { return injectScript; });
/* harmony import */ var toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61);

function injectCSS(path) {
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', Object(toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_0__["getBrowser"])().runtime.getURL(path));
  document.getElementsByTagName('head')[0].appendChild(link);
}
function injectScript(path) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', Object(toolkit_core_common_web_extensions__WEBPACK_IMPORTED_MODULE_0__["getBrowser"])().runtime.getURL(path));
  document.getElementsByTagName('head')[0].appendChild(script);
}

/***/ })
/******/ ]);