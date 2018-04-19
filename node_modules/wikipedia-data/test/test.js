'use strict';

var assert = require('assert');
var info = require('../index');

describe('all data', function() {
	it('should return disambiguation-names', function() {
		var data = info.getDisambiguationNames();
		assert.ok(data);
		for (var lang in data) {
			if (lang === 'vo') {
				assert.equal('Telplänov', data[lang]);
			}
		}
	});

	it('should return disambiguation-names2', function() {
		var data = info.getDisambiguationNames2();
		assert.ok(data);
		for (var lang in data) {
			if (lang === 'vo') {
				assert.equal('Telplänov', data[lang]);
			}
		}
	});

	it('should return disambiguation-categories', function() {
		var data = info.getDisambiguationCategories();
		assert.ok(data);
		for (var lang in data) {
			if (lang === 'vo') {
				assert.equal('Klad:Telplänovapads', data[lang]);
			}
		}
	});

	it('should return disambiguation-categories2', function() {
		var data = info.getDisambiguationCategories2();
		assert.ok(data);
		for (var lang in data) {
			if (lang === 'vo') {
				assert.equal('Klad:Telplänovapads', data[lang]);
			}
		}
	});
});
