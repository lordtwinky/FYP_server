'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _annotator = require('../annotator');

var _annotator2 = _interopRequireDefault(_annotator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class
 * @classdesc Class representing an TokenizerAnnotator. Identifies {@link Token}s
 * @extends Annotator
 * @memberof CoreNLP/simple/annotator
 * @requires tokenize
 * @see {@link https://stanfordnlp.github.io/CoreNLP/tokenize.html|TokenizerAnnotator}
 */
class TokenizerAnnotator extends _annotator2.default {
  /**
   * Create an Annotator
   * @param {Object} [options] a key-value map of options, without the annotator prefix
   */
  constructor(options = {}) {
    super('tokenize', _extends({
      language: 'Unspecified',
      // class: null, // throws error on CoreNLP server
      whitespace: false,
      keepeol: false,
      // options: null, // throws error on CoreNLP server
      verbose: false
    }, options));
  }
}

exports.default = TokenizerAnnotator;