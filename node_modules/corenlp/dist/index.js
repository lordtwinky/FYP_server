'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorServer = exports.ConnectorCli = exports.Service = exports.Pipeline = exports.Properties = undefined;

var _document = require('./simple/document');

var _document2 = _interopRequireDefault(_document);

var _sentence = require('./simple/sentence');

var _sentence2 = _interopRequireDefault(_sentence);

var _token = require('./simple/token');

var _token2 = _interopRequireDefault(_token);

var _expression = require('./simple/expression');

var _expression2 = _interopRequireDefault(_expression);

var _annotable = require('./simple/annotable');

var _annotable2 = _interopRequireDefault(_annotable);

var _annotator = require('./simple/annotator');

var _annotator2 = _interopRequireDefault(_annotator);

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

var _tree = require('./util/tree');

var _tree2 = _interopRequireDefault(_tree);

var _properties = require('./properties');

var _properties2 = _interopRequireDefault(_properties);

var _pipeline = require('./pipeline');

var _pipeline2 = _interopRequireDefault(_pipeline);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _connectorCli = require('./connector/connector-cli');

var _connectorCli2 = _interopRequireDefault(_connectorCli);

var _connectorServer = require('./connector/connector-server');

var _connectorServer2 = _interopRequireDefault(_connectorServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Properties = exports.Properties = _properties2.default;
const Pipeline = exports.Pipeline = _pipeline2.default;
const Service = exports.Service = _service2.default;
const ConnectorCli = exports.ConnectorCli = _connectorCli2.default;
const ConnectorServer = exports.ConnectorServer = _connectorServer2.default;

/**
 * CoreNLP NodeJS Interface
 * @namespace CoreNLP
 */
exports.default = {
  /**
   * @namespace CoreNLP/simple
   * @description NodeJS API that emulates {@link https://stanfordnlp.github.io/CoreNLP/simple.html}
   */
  simple: {
    Annotable: _annotable2.default,
    Annotator: _annotator2.default,
    Document: _document2.default,
    Sentence: _sentence2.default,
    Token: _token2.default,
    Expression: _expression2.default,
    /**
     * @namespace CoreNLP/simple/annotator
     * @description Predefined annotators {@link https://stanfordnlp.github.io/CoreNLP/annotators.html}
     */
    annotator: {
      TokenizerAnnotator: _tokenize2.default,
      WordsToSentenceAnnotator: _ssplit2.default,
      POSTaggerAnnotator: _pos2.default,
      MorphaAnnotator: _lemma2.default,
      NERClassifierCombiner: _ner2.default,
      ParserAnnotator: _parse2.default,
      DependencyParseAnnotator: _depparse2.default,
      RelationExtractorAnnotator: _relation2.default,
      RegexNERAnnotator: _regexner2.default,
      CorefAnnotator: _coref2.default
    }
  },
  /**
   * @namespace CoreNLP/util
   * @description Utilities
   */
  util: {
    Tree: _tree2.default
  }
};