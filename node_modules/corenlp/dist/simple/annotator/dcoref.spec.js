'use strict';

var _dcoref = require('./dcoref');

var _dcoref2 = _interopRequireDefault(_dcoref);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('DeterministicCorefAnnotator', () => {
    beforeEach(() => {
      annotator = new _dcoref2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'pos', 'lemma', 'ner', 'parse', 'dcoref']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({});
    });
  });
});