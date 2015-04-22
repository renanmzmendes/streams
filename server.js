var express = require('express');
var app = express();
var busboy = require('connect-busboy');
var csv = require('csv-streamify');

app.use(express.static('public'));

app.post('/upload', busboy(), function (req, res, next) {
	var uploadCallback = function (err, doc) {
		if (err) {
			res.status(500).send('Error processing file');
		} else {
			console.log(doc);
			res.send(doc);
		}
	};

	var parser = csv({ objectMode: true, columns: true }, uploadCallback);

	if (req.busboy) {
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      file.pipe(parser);
    });
	} else {
		res.status(500).send('Busboy not present');
	}

	req.pipe(req.busboy);
});

app.listen(3000);

module.exports = app;