var inky = require('inky').Inky;
var cheerio = require('cheerio');
var juice = require('juice');

module.inkify = function (callback, type, options, data) {

    var input = data;
    var inkyOptions = {};
    var i = new inky(inkyOptions);

    var html = cheerio.load(input);

    var convertedHtml = i.releaseTheKraken(html);

    convertedHtml = juice(convertedHtml, {
        applyAttributesTableElements: false
    });

    callback(null, convertedHtml);
};