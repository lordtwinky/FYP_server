'use strict';

var http = require('https');
var path = require('path');
var fs = require('fs');

function saveData(data) {
	var reg = /<li class="interlanguage-link interwiki-([^"]+)">\s*<a href="\/\/[^.]+.wikipedia.org\/wiki\/([^"]+)"/gi;
	var result;
	var names = {
		en: 'Category:Disambiguation_pages'
	};
	var names2 = {
		en: 'Category:Disambiguation_pages'
	};
	var lang, name;
	while ((result = reg.exec(data)) !== null) {
		lang = result[1];
		name = result[2];
		name = decodeURIComponent(name);
		// name = jsesc(name);
		names[lang] = name;
		if (lang.length === 2) {
			names2[lang] = name;
		}
	}

	var file = path.join(__dirname, '../data', 'disambiguation-categories.json');
	fs.writeFileSync(file, JSON.stringify(names, null, 2) + '\n');

	file = path.join(__dirname, '../data', 'disambiguation-categories2.json');
	fs.writeFileSync(file, JSON.stringify(names2, null, 2) + '\n');
}

function start() {
	var req = http.request({
		host: 'en.wikipedia.org',
		port: 443,
		path: '/wiki/Category:Disambiguation_pages'
	}, function(res) {
		res.setEncoding('utf8');
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			saveData(data);
		});
	});

	req.on('error', function(error) {
		console.error(error);
	});

	req.end();
}

start();
