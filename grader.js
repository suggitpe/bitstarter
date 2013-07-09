#!/usr/bin/env node

/*
 Automatically grade files for the presence of specified HTML tags/attributes.
 Uses commander.js and cheerio. Teaches command line application development
 and basic DOM parsing.

 References:

 + cheerio
 - https://github.com/MatthewMueller/cheerio
 - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
 - http://maxogden.com/scraping-with-node.html

 + commander.js
 - https://github.com/visionmedia/commander.js
 - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
 - http://en.wikipedia.org/wiki/JSON
 - https://developer.mozilla.org/en-US/docs/JSON
 - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
 */

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require("restler")

var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function (infile) {
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function (url) {
    var urlAsString = url.toString();
    if (rest.head(urlAsString).length === 0) {
        console.log("Could not find url [" + urlAsString + "]")
        process.exit(1)
    }
    return urlAsString;
};

var loadChecks = function (checksfile) {
    return JSON.parse(fs.readFileSync(checksfile)).sort();
};

function checkHtmlAndDisplayResults(data, checks) {
    var foo = cheerio.load(data)
    var out = {};
    for (var ii in checks) {
        var present = foo(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);
};

var checkHtmlFile = function (htmlfile, checks) {
    fs.readFile(htmlfile, 'utf-8', function (err, data) {
        if (err) throw err;
        checkHtmlAndDisplayResults(data, checks);
    });
};

var checkHtmlUrl = function (htmlurl, checks) {
    rest.get(htmlurl).once('complete', function (result, response) {
        checkHtmlAndDisplayResults(result, checks);
    });
};

var clone = function (fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

function gradeHtml(checks) {
    if (program.file) {
        checkHtmlFile(program.file, checks);
    }
    else {
        checkHtmlUrl(program.url, checks);
    }
}

if (require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
        .option('-u, --url <html_url>', 'URL to index.html', clone(assertUrlExists))
        .parse(process.argv);
    gradeHtml(loadChecks(program.checks));
} else {
    exports.checkHtmlFile = checkHtmlFile;
}