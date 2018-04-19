'use strict';

var _relation = require('./relation');

var _relation2 = _interopRequireDefault(_relation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('RelationExtractorAnnotator', () => {
    beforeEach(() => {
      annotator = new _relation2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'pos', 'lemma', 'ner', 'depparse', 'relation']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({});
    });
  });
});