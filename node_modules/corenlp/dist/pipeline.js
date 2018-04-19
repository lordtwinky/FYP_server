'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.difference');

var _lodash2 = _interopRequireDefault(_lodash);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _connectorServer = require('./connector/connector-server');

var _connectorServer2 = _interopRequireDefault(_connectorServer);

var _tokenize = require('./simple/annotator/tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

var _ssplit = require('./simple/annotator/ssplit');

var _ssplit2 = _interopRequireDefault(_ssplit);

var _pos = require('./simple/annotator/pos');

var _pos2 = _interopRequireDefault(_pos);

var _lemma = require('./simple/annotator/lemma');

var _lemma2 = _interopRequireDefault(_lemma);

var _ner = require('./simple/annotator/ner');

var _ner2 = _interopRequireDefault(_ner);

var _parse = require('./simple/annotator/parse');

var _parse2 = _interopRequireDefault(_parse);

var _depparse = require('./simple/annotator/depparse');

var _depparse2 = _interopRequireDefault(_depparse);

var _relation = require('./simple/annotator/relation');

var _relation2 = _interopRequireDefault(_relation);

var _regexner = require('./simple/annotator/regexner');

var _regexner2 = _interopRequireDefault(_regexner);

var _coref = require('./simple/annotator/coref');

var _coref2 = _interopRequireDefault(_coref);

var _document = require('./simple/document');

var _document2 = _interopRequireDefault(_document);

var _expression = require('./simple/expression');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ANNOTATORS_BY_KEY = {
  tokenize: _tokenize2.default,
  ssplit: _ssplit2.default,
  pos: _pos2.default,
  lemma: _lemma2.default,
  ner: _ner2.default,
  parse: _parse2.default,
  depparse: _depparse2.default,
  relation: _relation2.default,
  regexner: _regexner2.default,
  coref: _coref2.default
};

const LANGUAGE_TO_ISO2 = {
  English: 'en',
  French: 'fr',
  German: 'de',
  Spanish: 'es',
  Chinese: 'zh',
  Arabic: 'ar'
};

/**
 * @class
 * @classdesc Class representing a Pipeline.
 */
class Pipeline {
  /**
   * Create a Pipeline
   * @param {Properties} properties
   * @param {string} [language] - in CamelCase (i.e. English, Spanish)
   * @param {ConnectorServer|ConnectorCli} [connector]
   */
  constructor(properties, language = 'Unspecified', connector = null) {
    this._properties = properties;
    this._language = language;
    this._connector = connector || new _connectorServer2.default({});
    this._service = new _service2.default(this._connector, this._language);
  }

  /**
   * Retrieves the current Service used by the pipeline
   * @param {Service} service
   */
  getService() {
    return this._service;
  }

  /**
   * Execute the pipeline against the annotable object, adding annotations to it.
   * Calls the service and loads the associated response metadata into the Annotable model
   * @async
   * @param {Annotable} annotable - the document or sentence to be annotated
   * @returns {Promise<Annotable>} annotated document / sentence
   */
  annotate(annotable) {
    var _this = this;

    return _asyncToGenerator(function* () {
      annotable.fromJSON((yield _this._service.getAnnotationData(annotable.text(), _this._getAnnotatorsKeys(), _this._getAnnotatrosOptions())));

      annotable.setLanguageISO(LANGUAGE_TO_ISO2[_this._language]);
      annotable.addAnnotators(_this._getAnnotators());

      return annotable;
    })();
  }

  /**
   * @param {Array.<Annotator>} requiredAnnotators
   */
  assert(methodName = '', requiredAnnotators = []) {
    if ((0, _lodash2.default)(requiredAnnotators.map(Annotator => new Annotator().toString()), this._getAnnotatorsKeys()).length > 0) {
      throw new Error(`Assert: ${methodName} requires ${requiredAnnotators.join()} within the annotators list.`);
    }
  }

  /**
   * Annotates the given Expression instance with matching groups and/or Tokens
   * @param {Expression} expression - An annotable expression containing a TokensRegex pattern
   * @param {boolean} [annotateExpression] - Whether to hydrate the annotations with tokens or not.
   * IMPORTANT: The optional parameter `annotateExpression` if true, will run the CoreNLP pipeline
   *            twice.  First for the TokensRegex annotation, and one more for the standard pipeline
   *            Token annotations (pos, ner, lemma, etc).
   * @returns {Expression} expression - The current expression instance
   */
  annotateTokensRegex(annotable, annotateExpression = false) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.assert('TokensRegex', [_tokenize2.default, _ssplit2.default]);
      annotable.fromJSON((yield _this2._service.getTokensRegexData(annotable.text(), annotable.pattern(), _this2._getAnnotatorsKeys(), _this2._getAnnotatrosOptions())));

      annotable.setLanguageISO(LANGUAGE_TO_ISO2[_this2._language]);
      annotable.addAnnotator(_expression.TokensRegexAnnotator);

      if (annotateExpression) {
        return _this2._annotateExpression(annotable);
      }
      return annotable;
    })();
  }

  /**
   * Annotates the given Expression instance with matching groups and/or Tokens
   * @param {Expression} expression - An annotable expression containing a Semgrex pattern
   * @param {boolean} [annotateExpression] - Whether to hydrate the annotations with tokens or not.
   * IMPORTANT: The optional parameter `annotateExpression` if true, will run the CoreNLP pipeline
   *            twice.  First for the Semgrex annotation, and one more for the standard pipeline
   *            Token annotations (pos, ner, lemma, etc).
   * @returns {Expression} expression - The current expression instance
   */
  annotateSemgrex(annotable, annotateExpression = false) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      _this3.assert('Semgrex', [_tokenize2.default, _ssplit2.default, _depparse2.default]);
      annotable.fromJSON((yield _this3._service.getSemgrexData(annotable.text(), annotable.pattern(), _this3._getAnnotatorsKeys(), _this3._getAnnotatrosOptions())));

      annotable.setLanguageISO(LANGUAGE_TO_ISO2[_this3._language]);
      annotable.addAnnotator(_expression.SemgrexAnnotator);

      if (annotateExpression) {
        return _this3._annotateExpression(annotable);
      }
      return annotable;
    })();
  }

  /**
   * Annotates the given Expression instance with matching groups and/or Tokens
   * @param {Expression} expression - An annotable expression containing a Tregex pattern
   * @param {boolean} [annotateExpression] - Whether to hydrate the annotations with tokens or not.
   * IMPORTANT: The optional parameter `annotateExpression` if true, will run the CoreNLP pipeline
   *            twice.  First for the Tregex annotation, and one more for the standard pipeline
   *            Token annotations (pos, ner, lemma, etc).
   * @returns {Expression} expression - The current expression instance
   */
  annotateTregex(annotable, annotateExpression = false) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      _this4.assert('Tregex', [_tokenize2.default, _ssplit2.default, _parse2.default]);
      annotable.fromJSON((yield _this4._service.getTregexData(annotable.text(), annotable.pattern(), _this4._getAnnotatorsKeys(), _this4._getAnnotatrosOptions())));

      annotable.setLanguageISO(LANGUAGE_TO_ISO2[_this4._language]);
      annotable.addAnnotator(_expression.TregexAnnotator);

      if (annotateExpression) {
        return _this4._annotateExpression(annotable);
      }
      return annotable;
    })();
  }

  /**
   * @private
   * @description
   * Runs the default pipeline over the same text of the expression, and merges the results
   */
  _annotateExpression(annotableExpression) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const doc = yield _this5.annotate(new _document2.default(annotableExpression.text()));
      doc.setLanguageISO(LANGUAGE_TO_ISO2[_this5._language]);
      annotableExpression.mergeTokensFromDocument(doc);
      return annotableExpression;
    })();
  }

  /**
   * @private
   */
  _semgrex(text, pattern) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const data = yield _this6._service.getSemgrexData(text, pattern, _this6._getAnnotatorsKeys(), _this6._getAnnotatrosOptions());

      return data;
    })();
  }

  /**
   * @private
   * @returns {Aray.<string>} annotators - those set for this pipeline
   */
  _getAnnotatorsKeys() {
    return this._properties.getProperty('annotators', '').split(',').map(annotatorKey => annotatorKey.trim());
  }

  /**
   * @private
   * @returns {Aray.<Annotator>} annotators - those set for this pipeline
   */
  _getAnnotators() {
    return this._getAnnotatorsKeys().map(annotatorKey => ANNOTATORS_BY_KEY[annotatorKey]);
  }

  /**
   * Only given options are those related to the annotators in the pipeline
   * @private
   * @returns {Aray.<Annotator>} annotators - those set for this pipeline
   */
  _getAnnotatrosOptions() {
    const pipelineProps = this._properties.getProperties();
    const validPrfixes = Object.keys(ANNOTATORS_BY_KEY);
    return Object.keys(pipelineProps).filter(propName => validPrfixes.indexOf(propName) === 0).reduce((acc, val, key) => _extends({}, acc, { [key]: val }), {});
  }
}

exports.default = Pipeline;