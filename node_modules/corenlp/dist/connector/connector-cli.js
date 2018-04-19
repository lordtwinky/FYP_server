'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _childProcessPromise = require('child-process-promise');

var _tmpFile = require('tmp-file');

var _tmpFile2 = _interopRequireDefault(_tmpFile);

var _loadJsonFile = require('load-json-file');

var _loadJsonFile2 = _interopRequireDefault(_loadJsonFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = {
  classPath: 'corenlp/stanford-corenlp-full-2017-06-09/*',
  mainClass: 'edu.stanford.nlp.pipeline.StanfordCoreNLP',
  props: 'StanfordCoreNLP-spanish.properties'
};

/**
 * @class
 * @classdesc Class representing a Connector CLI (command line interface client)
 */
class ConnectorCli {
  /**
   * Create a ConnectorCli
   * @param {Object} config
   * @param {string} config.classPath - The path to the Jar files to be included
   * @param {string} config.mainClass - The name of the Java class that represents the main program
   * @param {string} config.props The - path to the properties file (for example, language specific)
   */
  constructor({
    classPath = config.classPath,
    mainClass = config.mainClass,
    props = config.props
  } = {}) {
    this._classPath = classPath;
    this._mainClass = mainClass;
    this._props = props;
    this._tmpFile = _tmpFile2.default;
    this._exec = _childProcessPromise.exec;
    this._loadJSONFile = _loadJsonFile2.default;
  }

  /**
   * @returns {Promise<Object>}
   */
  get({
    annotators,
    text
    // TODO options,
    // TODO language
  }) {
    const params = ['-cp', `'${this._classPath}'`, `${this._mainClass}`, '-props', `${this._props}`, '-annotators', `${annotators.join()}`, '-outputFormat', 'json'];

    return this._tmpFile(text).then(file => this._exec(`java ${params.concat([`-file ${file.path}`]).join(' ')}`).then(result => {
      const stdout = result.stdout || result.stderr;
      const outfile = stdout.match(/writing to (.*\.json)/)[1];
      return this._loadJSONFile(outfile);
    }));
  }
}

exports.default = ConnectorCli;