'use strict';

var _regexner = require('./regexner');

var _regexner2 = _interopRequireDefault(_regexner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotator', () => {
  let annotator;

  describe('RegexNERAnnotator', () => {
    beforeEach(() => {
      annotator = new _regexner2.default();
    });

    it('should have a proper pipeline', () => {
      expect(annotator.pipeline()).to.deep.equal(['tokenize', 'ssplit', 'regexner']);
    });

    it('should have the proper default options', () => {
      expect(annotator.options()).to.deep.equal({
        validpospattern: '(([ner:PERSON]*) /es/ /una/ /buena/ /persona/)',
        verbose: true
      });
    });
  });
});