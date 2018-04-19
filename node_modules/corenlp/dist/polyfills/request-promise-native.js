"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// eslint-disable-next-line no-undef
exports.default = req => fetch(encodeURI(req.uri), _extends({}, req, {
  withCredentials: true
})).then(response => response.json());