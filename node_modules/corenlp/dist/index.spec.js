'use strict';

var _ = require('.');

var _2 = _interopRequireDefault(_);

var _document = require('./simple/document');

var _document2 = _interopRequireDefault(_document);

var _sentence = require('./simple/sentence');

var _sentence2 = _interopRequireDefault(_sentence);

var _token = require('./simple/token');

var _token2 = _interopRequireDefault(_token);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('CoreNLP Library entry point', () => {
  describe('CoreNLP', () => {
    describe('constructor', () => {
      it('should have a constructor method', _asyncToGenerator(function* () {
        expect(_2.default).to.have.property('constructor').that.is.a('function');
      }));
    });

    describe('connector', () => {
      it('should have ConnectorServer', _asyncToGenerator(function* () {
        expect(_.ConnectorServer).to.be.a('function');
      }));

      it('should have ConnectorCli', _asyncToGenerator(function* () {
        expect(_.ConnectorCli).to.be.a('function');
      }));
    });

    describe('simple', () => {
      it('should have Annotable', _asyncToGenerator(function* () {
        expect(_2.default.simple).to.have.property('Annotable').that.equals(_annotable2.default);
      }));

      it('should have Annotator', _asyncToGenerator(function* () {
        expect(_2.default.simple).to.have.property('Annotator').that.equals(_annotator2.default);
      }));

      it('should have Document', _asyncToGenerator(function* () {
        expect(_2.default.simple).to.have.property('Document').that.equals(_document2.default);
      }));

      it('should have Sentence', _asyncToGenerator(function* () {
        expect(_2.default.simple).to.have.property('Sentence').that.equals(_sentence2.default);
      }));

      it('should have Token', _asyncToGenerator(function* () {
        expect(_2.default.simple).to.have.property('Token').that.equals(_token2.default);
      }));

      describe('annotator', () => {
        it('should have annotators', _asyncToGenerator(function* () {
          expect(_2.default.simple).to.have.property('annotator').that.deep.equals({
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
          });
        }));
      });
    });

    describe('util', () => {
      it('should have Tree', _asyncToGenerator(function* () {
        expect(_2.default.util).to.have.property('Tree').that.equals(_tree2.default);
      }));
    });

    describe('Integration Test', () => {
      context('Using ConnectorServer', _asyncToGenerator(function* () {
        it('should allow to initialize a pipeline and run annotations', _asyncToGenerator(function* () {
          const connector = new _.ConnectorServer({ dsn: 'http://localhost:9000' });
          sinon.stub(connector, 'get').returns(Promise.resolve({
            sentences: [{
              tokens: [{
                word: 'Hello',
                pos: 'UH',
                ner: 'O'
              }, {
                word: 'world',
                pos: 'NN',
                ner: 'O'
              }]
            }]
          }));
          const props = new _.Properties({
            annotators: 'tokenize,ssplit'
          });
          const pipeline = new _.Pipeline(props, 'English', connector);
          const sent = new _2.default.simple.Sentence('Hello world');
          yield pipeline.annotate(sent);
          expect(sent.word(0)).to.equal('Hello');
          expect(sent.word(1)).to.equal('world');
          expect(sent.token(0).pos()).to.equal('UH');
          expect(sent.token(1).pos()).to.equal('NN');
          expect(sent.token(0).ner()).to.equal('O');
          expect(sent.token(1).ner()).to.equal('O');
        }));
      }));

      context('Using ConnectorCli', _asyncToGenerator(function* () {
        it('should allow to initialize a pipeline and run annotations', _asyncToGenerator(function* () {
          const connector = new _.ConnectorCli({
            classPath: 'corenlp/stanford-corenlp-full-2017-06-09/*',
            mainClass: 'edu.stanford.nlp.pipeline.StanfordCoreNLP',
            props: 'StanfordCoreNLP-spanish.properties'
          });
          sinon.stub(connector, 'get').returns(Promise.resolve({
            sentences: [{
              tokens: [{
                word: 'Hello',
                pos: 'UH',
                ner: 'O'
              }, {
                word: 'world',
                pos: 'NN',
                ner: 'O'
              }]
            }]
          }));
          const props = new _.Properties({
            annotators: 'tokenize,ssplit'
          });
          const pipeline = new _.Pipeline(props, 'English', connector);
          const sent = new _2.default.simple.Sentence('Hello world');
          yield pipeline.annotate(sent);
          expect(sent.word(0)).to.equal('Hello');
          expect(sent.word(1)).to.equal('world');
          expect(sent.token(0).pos()).to.equal('UH');
          expect(sent.token(1).pos()).to.equal('NN');
          expect(sent.token(0).ner()).to.equal('O');
          expect(sent.token(1).ner()).to.equal('O');
        }));
      }));
    });
  });
});