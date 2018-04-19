'use strict';

var _depparse = require('./depparse');

var _depparse2 = _interopRequireDefault(_depparse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('DependencyParseAnnotator', () => {
    beforeEach(() => {
      annotator = new _depparse2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'pos', 'depparse']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({});
    });
  });
});