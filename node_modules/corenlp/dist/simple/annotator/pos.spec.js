'use strict';

var _pos = require('./pos');

var _pos2 = _interopRequireDefault(_pos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('POSTaggerAnnotator', () => {
    beforeEach(() => {
      annotator = new _pos2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'pos']);
    });
  });
});