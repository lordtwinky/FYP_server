'use strict';

var _ner = require('./ner');

var _ner2 = _interopRequireDefault(_ner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('NERClassifierCombiner', () => {
    beforeEach(() => {
      annotator = new _ner2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'ner']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({
        useSUTime: true,
        // model: null,
        applyNumericClassifiers: true
      });
    });
  });
});