'use strict';

var _connectorCli = require('./connector-cli');

var _connectorCli2 = _interopRequireDefault(_connectorCli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('ConnectorCli', () => {
  let connector;

  describe('constructor', () => {
    it('should have a constructor method', () => {
      expect(_connectorCli2.default).to.have.property('constructor').that.is.a('function');
    });

    it('should initialize the instance properly (default)', () => {
      connector = new _connectorCli2.default();
      expect(connector).to.have.property('_classPath').that.equals('corenlp/stanford-corenlp-full-2017-06-09/*');
      expect(connector).to.have.property('_mainClass').that.equals('edu.stanford.nlp.pipeline.StanfordCoreNLP');
      expect(connector).to.have.property('_props').that.equals('StanfordCoreNLP-spanish.properties');
    });

    it('should initialize the instance properly (custom dsn)', () => {
      connector = new _connectorCli2.default({ classPath: 'x', mainClass: 'y', props: 'z' });
      expect(connector).to.have.property('_classPath').that.equals('x');
      expect(connector).to.have.property('_mainClass').that.equals('y');
      expect(connector).to.have.property('_props').that.equals('z');
    });
  });

  describe('get', () => {
    beforeEach(() => {
      connector = new _connectorCli2.default();
      sinon.stub(connector, '_tmpFile').returns(Promise.resolve({ path: 'tmp-file-stub' }));
      sinon.stub(connector, '_exec').returns(Promise.resolve({ stdout: 'writing to ijk.json', stderr: '' }));
      sinon.stub(connector, '_loadJSONFile').returns(Promise.resolve('exec-json-stub'));
    });

    context('standard annotation pipeline', () => {
      it('should prepare the request propery', _asyncToGenerator(function* () {
        yield connector.get({
          annotators: ['a', 'b', 'c'],
          text: 'xyz'
          // TODO
          // options: { optionA: 1, optionB: 2 },
          // language: 'LanguageStub',
        });
        expect(connector._tmpFile).to.be.have.been.calledWith('xyz');
        expect(connector._exec).to.be.have.been.calledWith('java -cp \'corenlp/stanford-corenlp-full-2017-06-09/*\' edu.stanford.nlp.pipeline.StanfordCoreNLP -props StanfordCoreNLP-spanish.properties -annotators a,b,c -outputFormat json -file tmp-file-stub');
      }));
    });
  });
});