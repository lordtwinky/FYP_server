'use strict';

var _properties = require('./properties');

var _properties2 = _interopRequireDefault(_properties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('Properties', () => {
  let props;

  describe('constructor', () => {
    it('should have a constructor method', () => {
      expect(_properties2.default).to.have.property('constructor').that.is.a('function');
    });
  });

  describe('getProperty / setProperty / constructor / getProperties', () => {
    beforeEach(() => {
      props = new _properties2.default({ test: 123, bar: 'foo' });
    });

    it('should allow to get prperties', _asyncToGenerator(function* () {
      expect(props.getProperty('test')).to.equal(123);
    }));

    it('should allow to get a non-defined property', _asyncToGenerator(function* () {
      expect(props.getProperty('test.und')).to.be.undefined;
    }));

    it('should allow to get a non-defined property with a default value', _asyncToGenerator(function* () {
      expect(props.getProperty('test.und.arr', [])).to.deep.equals([]);
    }));

    it('should allow to set prperties', _asyncToGenerator(function* () {
      expect(props.getProperty('test')).to.equal(123);
      expect(props.setProperty('test', 321));
      expect(props.getProperty('test')).to.equal(321);
    }));

    it('should allow to get all prperties', _asyncToGenerator(function* () {
      expect(props.getProperties()).to.deep.equal({
        test: 123,
        bar: 'foo'
      });
    }));
  });

  describe('toJSON', () => {
    beforeEach(() => {
      props = new _properties2.default({ test: 123, bar: 'foo' });
    });

    it('should allow to get all prperties', _asyncToGenerator(function* () {
      expect(props.toJSON()).to.deep.equal({
        test: 123,
        bar: 'foo'
      });
    }));
  });

  describe('toPropertiessFileContent', () => {
    beforeEach(() => {
      props = new _properties2.default({ test: 123, bar: 'foo' });
    });

    it('should allow to get all prperties', _asyncToGenerator(function* () {
      expect(props.toPropertiessFileContent()).to.deep.equal('test = 123\nbar = foo');
    }));
  });
});