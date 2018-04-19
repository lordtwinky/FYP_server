'use strict';

var _corefChain = require('./coref-chain');

var _corefChain2 = _interopRequireDefault(_corefChain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('CorefChain', () => {
  let chain;

  beforeEach(() => {
    chain = new _corefChain2.default();
  });

  context('CorefChain interface', () => {
    it('should follow the CorefChain contract', () => {
      expect(chain).to.have.property('mentions').that.is.a('function');
      expect(chain).to.have.property('mention').that.is.a('function');
      expect(chain).to.have.property('representative').that.is.a('function');
      expect(chain).to.have.property('nonRepresentatives').that.is.a('function');
      expect(chain).to.have.property('document').that.is.a('function');
      expect(chain).to.have.property('fromDocument').that.is.a('function');
      expect(chain).to.have.property('fromJSON').that.is.a('function');
    });

    describe.skip('constructor', () => {});
  });
});