'use strict';

var _coref = require('./coref');

var _coref2 = _interopRequireDefault(_coref);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('CorefAnnotator', () => {
    beforeEach(() => {
      annotator = new _coref2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'coref']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({});
    });
  });
});