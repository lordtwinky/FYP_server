'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _annotator = require('../annotator');

var _annotator2 = _interopRequireDefault(_annotator);

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

var _ssplit = require('./ssplit');

var _ssplit2 = _interopRequireDefault(_ssplit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class
 * @classdesc Class representing an RegexNERAnnotator.
 * @extends Annotator
 * @memberof CoreNLP/simple/annotator
 * @requires tokenize, ssplit, pos, regexner
 * @see {@link https://stanfordnlp.github.io/CoreNLP/regexner.html|RegexNERAnnotator}
 */
class RegexNERAnnotator extends _annotator2.default {
  /**
   * Create an Annotator
   * @param {Object} [options] a key-value map of options, without the annotator prefix
   */
  constructor(options = {}) {
    super('regexner', _extends({
      validpospattern: '(([ner:PERSON]*) /es/ /una/ /buena/ /persona/)',
      // ignorecase: null,
      // mapping: null,
      // mapping.header: null,
      // mapping.field.<fieldname>: null,
      // commonWords: null,
      // backgroundSymbol: null,
      // posmatchtype: null,
      // validpospattern: null,
      // noDefaultOverwriteLabels: null,
      verbose: true
    }, options), [new _tokenize2.default(), new _ssplit2.default()]);
  }
}

exports.default = RegexNERAnnotator;