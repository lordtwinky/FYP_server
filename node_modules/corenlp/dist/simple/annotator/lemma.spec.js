'use strict';

var _lemma = require('./lemma');

var _lemma2 = _interopRequireDefault(_lemma);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('MorphaAnnotator', () => {
    beforeEach(() => {
      annotator = new _lemma2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'pos', 'lemma']);
    });
  });
});