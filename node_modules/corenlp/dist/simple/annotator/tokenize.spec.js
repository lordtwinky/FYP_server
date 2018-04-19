'use strict';

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('TokenizerAnnotator', () => {
    beforeEach(() => {
      annotator = new _tokenize2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({
        language: 'Unspecified',
        // class: null,
        whitespace: false,
        keepeol: false,
        // options: null,
        verbose: false
      });
    });
  });
});