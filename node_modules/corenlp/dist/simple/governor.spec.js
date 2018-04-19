'use strict';

var _governor = require('./governor');

var _governor2 = _interopRequireDefault(_governor);

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Governor', () => {
  let governor;

  beforeEach(() => {
    governor = new _governor2.default('det', new _token2.default('él'), new _token2.default('pájaro'));
  });

  context('CoreNLP.Governor interface', () => {
    it('should follow the CoreNLP.Governor contract', () => {
      // no contract
    });

    describe('constructor', () => {
      it('should receive a text', () => {
        expect(governor.toString()).to.equals('det');
      });
    });
  });

  context('Other methods', () => {
    describe('toString', () => {
      it('should return the given text', () => {
        expect(governor.toString()).to.equals('det');
      });
    });

    describe('governor / governorGloss', () => {
      it('should return the governor token that was initialized with', () => {
        expect(governor.governor()).to.be.instanceof(_token2.default);
        expect(governor.governor().toString()).to.equals('pájaro');
      });

      it('should return the governorGloss token that was initialized with', () => {
        expect(governor.governorGloss()).to.be.a('string');
        expect(governor.governorGloss()).to.equals('pájaro');
      });
    });

    describe('dependent / dependentGloss', () => {
      it('should return the dependent token that was initialized with', () => {
        expect(governor.dependent()).to.be.instanceof(_token2.default);
        expect(governor.dependent().toString()).to.equals('él');
      });

      it('should return the dependentGloss token that was initialized with', () => {
        expect(governor.dependentGloss()).to.be.a('string');
        expect(governor.dependentGloss()).to.equals('él');
      });
    });

    describe.skip('dep', () => {
      it('should...', () => {});
    });
  });
});