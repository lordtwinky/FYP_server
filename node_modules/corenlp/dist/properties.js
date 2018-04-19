'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @class
 * @classdesc Class representing a Properties set.
 */
class Properties {
  /**
   * Create an Properties
   * @param {Object} props
   */
  constructor(props) {
    this._props = _extends({}, props);
  }

  /**
   * Property setter
   * @param {string} name - the property name
   * @param {*} value - the property value
   */
  setProperty(name, value) {
    this._props[name] = value;
  }

  /**
   * Property getter
   * @param {string} name - the property name
   * @param {*} default - the defaut value to return if not set
   * @returns {*} value - the property value
   */
  getProperty(name, defaultValue = undefined) {
    if (typeof this._props[name] !== 'undefined') {
      return this._props[name];
    }
    return defaultValue;
  }

  /**
   * Returns an Object map of the given properties
   * @returns {Object} properties - the properties object
   */
  getProperties() {
    return _extends({}, this._props);
  }

  /**
   * Returns a JSON object of the given properties
   * @returns {Object} json - the properties object
   */
  toJSON() {
    return _extends({}, this._props);
  }

  /**
   * Returns a properties file-like string of the given properties
   * @returns {string} properties - the properties content
   */
  toPropertiessFileContent() {
    return Object.keys(this._props).map(propName => `${propName} = ${this._props[propName]}`).join('\n');
  }
}

exports.default = Properties;