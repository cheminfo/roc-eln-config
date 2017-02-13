'use strict';

function parseXY (text, options) {
    var options = options || {};
    var lines = text.split(/[\r\n]+/);

    var maxY = Number.MIN_VALUE;

    var counter=0;
    var xxyy= (options.arrayType==='xxyy') ? true : false;
    if (xxyy) {
        var result = [
            new Array(lines.length),
            new Array(lines.length)
        ];
    } else {
        var result = new Array(lines.length);
    }


    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        // we will consider only lines that contains only numbers
        if (line.match(/[0-9]+/) && line.match(/^[0-9eE,;\. \t-]+$/)) {
            var fields = line.split(/[,; \t]+/);
            if (fields && fields.length == 2) {
                var x = parseFloat(fields[0]);
                var y = parseFloat(fields[1]);
                if (y > maxY) maxY = y;
                if (xxyy) {
                    result[0][counter]=x;
                    result[1][counter++]=y;
                } else {
                    result[counter++]=[x, y];
                }
            }
        }
    }

    if (xxyy) {
        result[0].length=counter;
        result[1].length=counter;
    } else {
        result.length=counter;
    }

    if (options.normalize) {
        if (xxyy) {
            for (var i = 0; i < counter; i++) {
                result[1][i] /= maxY;
            }
        } else {
            for (var i = 0; i < counter; i++) {
                result[i][1] /= maxY;
            }
        }

    }

    return result;
};


parseXY.parse = parseXY; // keep compatibility
module.exports = parseXY; // direct export