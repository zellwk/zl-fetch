(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.zlFetch = factory());
}(this, (function () { 'use strict';

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
  }

  var slicedToArray = _slicedToArray;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  /* global Headers btoa */
  var setHeaders = function setHeaders() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$headers = _ref.headers,
        headers = _ref$headers === void 0 ? {} : _ref$headers,
        body = _ref.body,
        _ref$method = _ref.method,
        method = _ref$method === void 0 ? 'get' : _ref$method,
        auth = _ref.auth;

    if (typeof Headers === 'undefined') {
      require('cross-fetch/polyfill');
    }

    var h = new Headers(headers); // Sets content type to 'application/json' for POST, PUT, PATCH, DELETE requests

    if (!h.get('content-type') && method !== 'get') {
      h.set('content-type', 'application/json');
    }

    if (auth) {
      // Basic Auth
      if (_typeof_1(auth) === 'object') {
        var username = auth.username,
            password = auth.password;
        if (!username) throw new Error('Username required for basic authentication');
        if (!password) throw new Error('Password required for basic authentication');
        var encode;

        if (typeof btoa === 'undefined') {
          encode = btoa;
        } else {
          encode = require('btoa');
        }

        h.set('Authorization', 'Basic ' + encode("".concat(username, ":").concat(password)));
      } else {
        // Bearer Auth
        h.set('Authorization', "Bearer ".concat(auth));
      }
    }

    return h;
  };

  var queryStringify = function queryStringify(params) {
    if (!params) return;
    return Object.entries(params).reduce(function (acc, entry, index) {
      var _entry = slicedToArray(entry, 2),
          param = _entry[0],
          value = _entry[1];

      var encoded = index === 0 ? "".concat(param, "=").concat(encodeURIComponent(value)) : "&".concat(param, "=").concat(encodeURIComponent(value));
      return "".concat(acc).concat(encoded);
    }, '');
  };
  /**
   * Appends queries to URL
   * @param {Object} opts
   */


  var createURL = function createURL(opts) {
    var url = opts.url,
        queries = opts.queries;
    if (!queries) return url;
    return "".concat(url, "?").concat(queryStringify(queries));
  };

  var formatBody = function formatBody(opts) {
    var method = opts.method;
    if (method === 'get') return;
    var type = opts.headers.get('content-type');
    if (!type) return;
    if (type.includes('x-www-form-urlencoded')) return queryStringify(opts.body);
    if (type.includes('json')) return JSON.stringify(opts.body);
    return opts.body;
  }; // Defaults to GET method
  // Defaults content type to application/json
  // Creates authorization headers automatically


  var createRequestOptions = (function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var opts = Object.assign({}, options);
    opts.url = createURL(opts);
    opts.method = opts.method || 'get';
    opts.headers = setHeaders(opts);
    opts.body = formatBody(opts); // Removes options that are not native to Fetch

    delete opts.auth;
    return opts;
  });

  // window.fetch response headers contains entries method.
  var getBrowserFetchHeaders = function getBrowserFetchHeaders(response) {
    var headers = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = response.headers.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = slicedToArray(_step.value, 2),
            header = _step$value[0],
            value = _step$value[1];

        headers[header] = value;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return headers;
  }; // Node fetch response headers does not contain entries method.


  var getNodeFetchHeaders = function getNodeFetchHeaders(response) {
    var headers = {};
    var h = response.headers._headers;

    for (var header in h) {
      headers[header] = h[header].join('');
    }

    return headers;
  };

  var getHeaders = function getHeaders(response) {
    return response.headers.entries ? getBrowserFetchHeaders(response) : getNodeFetchHeaders(response);
  };

  var formatOutput = function formatOutput(response, body) {
    var headers = getHeaders(response);
    var returnValue = {
      body: body,
      headers: headers,
      response: response,
      status: response.status,
      statusText: response.statusText
    };
    return response.ok ? Promise.resolve(returnValue) : Promise.reject(returnValue);
  };

  var parseResponse = function parseResponse(response, type) {
    // Response object can only be used once.
    // We clone the response object here so users can use it again if they want to.
    // Checks required because browser support isn't solid.
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/clone
    var clone = typeof response.clone === 'function' ? response.clone() : undefined;
    var passedResponse = clone || response; // This will do response.json(), response.text(), etc.
    // We use bracket notation to allow multiple types to be parsed at the same time.

    return response[type]().then(function (body) {
      return formatOutput(passedResponse, body);
    });
  };

  var handleResponse = function handleResponse(response) {
    var type = response.headers.get('content-type');
    if (type.includes('json')) return parseResponse(response, 'json');
    if (type.includes('text')) return parseResponse(response, 'text');
    if (type.includes('image')) return parseResponse(response, 'blob'); // Need to check for FormData, Blob and ArrayBuffer content types

    throw new Error("zlFetch does not support content-type ".concat(type, " yet"));
  };
  /**
   * Formats all errors into zlFetch style error
   * @param {Object} error - The error object
   */

  var handleError = function handleError(error) {
    if (error.message === 'Failed to fetch') {
      /* eslint-disable */
      return Promise.reject({
        error: error
      });
      /* eslint-enable */
    }

    return Promise.reject(error);
  };

  /* globals fetch */

  if (typeof fetch === 'undefined') {
    require('cross-fetch/polyfill');
  }

  var zlFetch = function zlFetch(url, options) {
    var opts = createRequestOptions(Object.assign({
      url: url
    }, options));
    return fetch(opts.url, opts).then(handleResponse)["catch"](handleError);
  }; // ========================
  // Shorthands
  // ========================


  var methods = ['get', 'post', 'put', 'patch', 'delete'];

  var _loop = function _loop() {
    var method = _methods[_i];

    zlFetch[method] = function (url, options) {
      options = Object.assign({
        method: method
      }, options);
      return zlFetch(url, options);
    };
  };

  for (var _i = 0, _methods = methods; _i < _methods.length; _i++) {
    _loop();
  }

  return zlFetch;

})));
//# sourceMappingURL=index.js.map
