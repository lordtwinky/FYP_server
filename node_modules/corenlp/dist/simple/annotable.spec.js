'use strict';

var _annotable = require('./annotable');

var _annotable2 = _interopRequireDefault(_annotable);

var _annotator = require('./annotator');

var _annotator2 = _interopRequireDefault(_annotator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Annotable', () => {
  let annotable;
  let annotatorMock1;
  let annotatorMock2;

  beforeEach(() => {
    annotable = new _annotable2.default('el pájaro veloz');
    annotable.fromJSON = sinon.stub();
    annotatorMock1 = new _annotator2.default();
    Object.assign(annotatorMock1, {
      toString: sinon.stub().returns('ANNOTATOR_MOCK'),
      pipeline: sinon.stub().returns([]),
      pipelineOptions: sinon.stub().returns({}),
      dependencies: sinon.stub().returns([])
    });

    annotatorMock2 = new _annotator2.default();
    Object.assign(annotatorMock2, {
      toString: sinon.stub().returns('ANNOTATOR_MOCK_2'),
      pipeline: sinon.stub(),
      pipelineOptions: sinon.stub(),
      dependencies: sinon.stub()
    });
  });

  describe('addAnnotator / hasAnnotator', () => {
    it('should add an annotator and reflect the change when asked', () => {
      expect(annotable.hasAnnotator(annotatorMock1)).to.be.false;
      expect(annotable.addAnnotator(annotatorMock1));
      expect(annotable.hasAnnotator(annotatorMock1)).to.be.true;
    });
  });

  describe('addAnnotators / hasAnyAnnotator', () => {
    it('should add multiple annotators and reflect the change when asked', () => {
      expect(annotable.hasAnyAnnotator([annotatorMock1])).to.be.false;
      expect(annotable.hasAnyAnnotator([annotatorMock2])).to.be.false;
      expect(annotable.addAnnotators([annotatorMock1, annotatorMock2]));
      expect(annotable.hasAnyAnnotator([annotatorMock1])).to.be.true;
      expect(annotable.hasAnyAnnotator([annotatorMock2])).to.be.true;
    });
  });

  describe('addAnnotators / hasAnyAnnotator / removeAnnotator', () => {
    it('should add multiple annotators and reflect the change when asked', () => {
      expect(annotable.hasAnyAnnotator([annotatorMock1])).to.be.false;
      expect(annotable.hasAnyAnnotator([annotatorMock2])).to.be.false;
      expect(annotable.addAnnotators([annotatorMock1, annotatorMock2]));
      expect(annotable.hasAnyAnnotator([annotatorMock1])).to.be.true;
      expect(annotable.hasAnyAnnotator([annotatorMock2])).to.be.true;
      annotable.removeAnnotator(annotatorMock1);
      expect(annotable.hasAnyAnnotator([annotatorMock1])).to.be.false;
      expect(annotable.hasAnyAnnotator([annotatorMock2])).to.be.true;
      expect(annotable.hasAnyAnnotator([annotatorMock1, annotatorMock2])).to.be.true;
      expect(annotable.hasAnnotator(annotatorMock1)).to.be.false;
    });
  });

  describe('setLanguageISO / getLanguageISO', () => {
    it('should default to undefined', () => {
      expect(annotable.getLanguageISO()).to.be.undefined;
    });

    it('should receive and return wthe language as indicated', () => {
      expect(annotable.getLanguageISO()).to.be.undefined;
      annotable.setLanguageISO('es');
      expect(annotable.getLanguageISO('es')).to.equal('es');
      annotable.setLanguageISO('en');
      expect(annotable.getLanguageISO('en')).to.equal('en');
    });
  });
});