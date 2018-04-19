'use strict';

var _ssplit = require('./ssplit');

var _ssplit2 = _interopRequireDefault(_ssplit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('WordsToSentenceAnnotator', () => {
    beforeEach(() => {
      annotator = new _ssplit2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({
        eolonly: false,
        isOneSentence: false,
        newlineIsSentenceBreak: 'never',
        boundaryMultiTokenRegex: null,
        boundaryTokenRegex: '\\.|[!?]+',
        boundariesToDiscard: null,
        htmlBoundariesToDiscard: null,
        tokenPatternsToDiscard: null,
        boundaryFollowersRegex: null
      });
    });
  });
});