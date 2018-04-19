'use strict';

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('ParserAnnotator', () => {
    beforeEach(() => {
      annotator = new _parse2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'parse']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({});
    });
  });
});