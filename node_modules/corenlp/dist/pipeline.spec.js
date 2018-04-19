'use strict';

var _pipeline = require('./pipeline');

var _pipeline2 = _interopRequireDefault(_pipeline);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _connectorServer = require('./connector/connector-server');

var _connectorServer2 = _interopRequireDefault(_connectorServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('Pipeline', () => {
  let pipeline;

  describe('constructor', () => {
    it('should have a constructor method', () => {
      expect(_pipeline2.default).to.have.property('constructor').that.is.a('function');
    });

    it('should initialize the instance properly', () => {
      expect(new _pipeline2.default(1, 2, 3)).to.have.property('_properties').that.equals(1);
      expect(new _pipeline2.default(1, 2, 3)).to.have.property('_language').that.equals(2);
      expect(new _pipeline2.default(1, 2, 3)).to.have.property('_connector').that.equals(3);
      expect(new _pipeline2.default(1)).to.have.property('_language').that.equals('Unspecified');
      expect(new _pipeline2.default(1)).to.have.property('_connector').to.be.instanceOf(_connectorServer2.default);
    });
  });

  describe('getService', () => {
    beforeEach(() => {
      pipeline = new _pipeline2.default(1);
    });

    it('should allow to get the service associated', _asyncToGenerator(function* () {
      expect(pipeline.getService()).to.be.instanceOf(_service2.default);
    }));
  });
});