'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _annotator = require('../annotator');

var _annotator2 = _interopRequireDefault(_annotator);

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class
 * @classdesc Class representing an WordsToSentenceAnnotator.
 *            Combines multiple {@link Token}s into sentences
 * @extends Annotator
 * @memberof CoreNLP/simple/annotator
 * @requires tokenize, ssplit
 * @see {@link https://stanfordnlp.github.io/CoreNLP/ssplit.html|WordsToSentenceAnnotator}
 */
class WordsToSentenceAnnotator extends _annotator2.default {
  /**
   * Create an Annotator
   * @param {Object} [options] a key-value map of options, without the annotator prefix
   */
  constructor(options = {}) {
    super('ssplit', _extends({
      eolonly: false,
      isOneSentence: false,
      newlineIsSentenceBreak: 'never',
      boundaryMultiTokenRegex: null,
      boundaryTokenRegex: '\\.|[!?]+',
      boundariesToDiscard: null,
      htmlBoundariesToDiscard: null,
      tokenPatternsToDiscard: null,
      boundaryFollowersRegex: null
    }, options), [new _tokenize2.default()]);
  }
}

exports.default = WordsToSentenceAnnotator;