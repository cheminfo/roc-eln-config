'use strict';


var xyDataSplitRegExp = /[,\t \+-]*(?=[^\d,\t \.])|[ \t]+(?=[\d+\.-])/;
var removeCommentRegExp = /\$\$.*/;
var DEBUG=false;

module.exports=function(spectrum, value, result) {
    // we check if deltaX is defined otherwise we calculate it
    if (!spectrum.deltaX) {
        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
    }

    spectrum.isXYdata=true;

    var currentData = [];
    var currentPosition=0;
    spectrum.data = [currentData];

    var currentX = spectrum.firstX;
    var currentY = spectrum.firstY;
    var lines = value.split(/[\r\n]+/);
    var lastDif, values, ascii, expectedY;
    values = [];
    for (var i = 1, ii = lines.length; i < ii; i++) {
        //var previousValues=JSON.parse(JSON.stringify(values));
        values = lines[i].trim().replace(removeCommentRegExp, '').split(xyDataSplitRegExp);
        if (values.length > 0) {
            if (DEBUG) {
                if (!spectrum.firstPoint) {
                    spectrum.firstPoint = +values[0];
                }
                var expectedCurrentX = (values[0] - spectrum.firstPoint) * spectrum.xFactor + spectrum.firstX;
                if ((lastDif || lastDif === 0)) {
                    expectedCurrentX += spectrum.deltaX;
                }
                result.logs.push('Checking X value: currentX: ' + currentX + ' - expectedCurrentX: ' + expectedCurrentX);
            }
            for (var j = 1, jj = values.length; j < jj; j++) {
                if (j === 1 && (lastDif || lastDif === 0)) {
                    lastDif = null; // at the beginning of each line there should be the full value X / Y so the diff is always undefined
                    // we could check if we have the expected Y value
                    ascii = values[j].charCodeAt(0);

                    if (false) { // this code is just to check the jcamp DIFDUP and the next line repeat of Y value
                        // + - . 0 1 2 3 4 5 6 7 8 9
                        if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
                            expectedY = +values[j];
                        } else
                        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                        if ((ascii > 63) && (ascii < 74)) {
                            expectedY = +(String.fromCharCode(ascii - 16) + values[j].substring(1));
                        } else
                        // negative SQZ digits a b c d e f g h i (ascii 97-105)
                        if ((ascii > 96) && (ascii < 106)) {
                            expectedY = -(String.fromCharCode(ascii - 48) + values[j].substring(1));
                        }
                        if (expectedY !== currentY) {
                            result.logs.push('Y value check error: Found: ' + expectedY + ' - Current: ' + currentY);
                            result.logs.push('Previous values: ' + previousValues.length);
                            result.logs.push(previousValues);
                        }
                    }
                } else {
                    if (values[j].length > 0) {
                        ascii = values[j].charCodeAt(0);
                        // + - . 0 1 2 3 4 5 6 7 8 9
                        if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
                            lastDif = null;
                            currentY = +values[j];
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else
                        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                        if ((ascii > 63) && (ascii < 74)) {
                            lastDif = null;
                            currentY = +(String.fromCharCode(ascii - 16) + values[j].substring(1));
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++] = currentX;
                            currentData[currentPosition++] = currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else
                        // negative SQZ digits a b c d e f g h i (ascii 97-105)
                        if ((ascii > 96) && (ascii < 106)) {
                            lastDif = null;
                            // we can multiply the string by 1 because if may not contain decimal (is this correct ????)
                            currentY = -(String.fromCharCode(ascii - 48) + values[j].substring(1))*1;
                            //currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else



                        // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
                        if (((ascii > 82) && (ascii < 91)) || (ascii === 115)) {
                            var dup = (String.fromCharCode(ascii - 34) + values[j].substring(1)) - 1;
                            if (ascii === 115) {
                                dup = ('9' + values[j].substring(1)) - 1;
                            }
                            for (var l = 0; l < dup; l++) {
                                if (lastDif) {
                                    currentY = currentY + lastDif;
                                }
                                // currentData.push(currentX, currentY * spectrum.yFactor);
                                currentData[currentPosition++]=currentX;
                                currentData[currentPosition++]=currentY * spectrum.yFactor;
                                currentX += spectrum.deltaX;
                            }
                        } else
                        // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
                        if (ascii === 37) {
                            lastDif = +('0' + values[j].substring(1));
                            currentY += lastDif;
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else if ((ascii > 73) && (ascii < 83)) {
                            lastDif = (String.fromCharCode(ascii - 25) + values[j].substring(1))*1;
                            currentY += lastDif;
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        } else
                        // negative DIF digits j k l m n o p q r (ascii 106-114)
                        if ((ascii > 105) && (ascii < 115)) {
                            lastDif = -(String.fromCharCode(ascii - 57) + values[j].substring(1))*1;
                            currentY += lastDif;
                            // currentData.push(currentX, currentY * spectrum.yFactor);
                            currentData[currentPosition++]=currentX;
                            currentData[currentPosition++]=currentY * spectrum.yFactor;
                            currentX += spectrum.deltaX;
                        }
                    }
                }
            }
        }
    }
}
