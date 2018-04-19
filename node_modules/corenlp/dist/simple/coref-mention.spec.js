'use strict';

var _corefMention = require('./coref-mention');

var _corefMention2 = _interopRequireDefault(_corefMention);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('CorefMention', () => {
  let mention;

  beforeEach(() => {
    mention = new _corefMention2.default();
  });

  context('CorefMention interface', () => {
    it('should follow the CorefMention contract', () => {
      expect(mention).to.have.property('id').that.is.a('function');
      expect(mention).to.have.property('text').that.is.a('function');
      expect(mention).to.have.property('sentNum').that.is.a('function');
      expect(mention).to.have.property('headIndex').that.is.a('function');
      expect(mention).to.have.property('startIndex').that.is.a('function');
      expect(mention).to.have.property('endIndex').that.is.a('function');
      expect(mention).to.have.property('isRepresentativeMention').that.is.a('function');
      expect(mention).to.have.property('animacy').that.is.a('function');
      expect(mention).to.have.property('gender').that.is.a('function');
      expect(mention).to.have.property('number').that.is.a('function');
      expect(mention).to.have.property('type').that.is.a('function');
      expect(mention).to.have.property('sentence').that.is.a('function');
      expect(mention).to.have.property('token').that.is.a('function');
    });

    describe.skip('constructor', () => {});
  });
});