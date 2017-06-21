(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else if(typeof exports === 'object')
        exports["spectraDataRanges"] = factory();
    else
        root["spectraDataRanges"] = factory();
})(this, function() {
    return /******/ (function(modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/ 	var installedModules = {};
        /******/
        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {
            /******/
            /******/ 		// Check if module is in cache
            /******/ 		if(installedModules[moduleId]) {
                /******/ 			return installedModules[moduleId].exports;
                /******/ 		}
            /******/ 		// Create a new module (and put it into the cache)
            /******/ 		var module = installedModules[moduleId] = {
                /******/ 			i: moduleId,
                /******/ 			l: false,
                /******/ 			exports: {}
                /******/ 		};
            /******/
            /******/ 		// Execute the module function
            /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ 		// Flag the module as loaded
            /******/ 		module.l = true;
            /******/
            /******/ 		// Return the exports of the module
            /******/ 		return module.exports;
            /******/ 	}
        /******/
        /******/
        /******/ 	// expose the modules object (__webpack_modules__)
        /******/ 	__webpack_require__.m = modules;
        /******/
        /******/ 	// expose the module cache
        /******/ 	__webpack_require__.c = installedModules;
        /******/
        /******/ 	// identity function for calling harmony imports with the correct context
        /******/ 	__webpack_require__.i = function(value) { return value; };
        /******/
        /******/ 	// define getter function for harmony exports
        /******/ 	__webpack_require__.d = function(exports, name, getter) {
            /******/ 		if(!__webpack_require__.o(exports, name)) {
                /******/ 			Object.defineProperty(exports, name, {
                    /******/ 				configurable: false,
                    /******/ 				enumerable: true,
                    /******/ 				get: getter
                    /******/ 			});
                /******/ 		}
            /******/ 	};
        /******/
        /******/ 	// getDefaultExport function for compatibility with non-harmony modules
        /******/ 	__webpack_require__.n = function(module) {
            /******/ 		var getter = module && module.__esModule ?
                /******/ 			function getDefault() { return module['default']; } :
                /******/ 			function getModuleExports() { return module; };
            /******/ 		__webpack_require__.d(getter, 'a', getter);
            /******/ 		return getter;
            /******/ 	};
        /******/
        /******/ 	// Object.prototype.hasOwnProperty.call
        /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
        /******/
        /******/ 	// __webpack_public_path__
        /******/ 	__webpack_require__.p = "";
        /******/
        /******/ 	// Load entry module and return exports
        /******/ 	return __webpack_require__(__webpack_require__.s = 7);
        /******/ })
    /************************************************************************/
    /******/ ([
        /* 0 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            var options1D = { type: 'rect', line: 0, lineLabel: 1, labelColor: 'red', strokeColor: 'red', strokeWidth: '1px', fillColor: 'green', width: 0.05, height: 10, toFixed: 1, maxLines: Number.MAX_VALUE, selectable: true, fromToc: false };
            var options2D = { type: 'rect', labelColor: 'red', strokeColor: 'red', strokeWidth: '1px', fillColor: 'green', width: '6px', height: '6px' };

            function annotations1D(ranges, optionsG) {
                var options = Object.assign({}, options1D, optionsG);
                var height = options.height;
                var annotations = [];

                for (var i = 0; i < ranges.length; i++) {
                    var index = ranges[i];
                    var annotation = {};

                    annotations.push(annotation);
                    annotation.line = options.line;
                    annotation._highlight = index._highlight;

                    if (options.fromToc) {
                        var line = options.line < options.maxLines ? options.line : options.maxLines - 1;
                        annotation._highlight = [options.line];
                        annotation.position = [{ x: index.delta - options.width, y: line * height + 'px' }, { x: index.delta + options.width, y: line * height + 3 + 'px' }];
                    } else {
                        if (!annotation._highlight || annotation._highlight.length === 0) {
                            annotation._highlight = [index.signalID];
                            index.signal.forEach(function (signal) {
                                for (var j = 0; j < signal.diaID.length; j++) {
                                    annotation._highlight.push(signal.diaID[j]);
                                }
                            });
                        }
                        if (!index.to || !index.from || index.to === index.from) {
                            annotation.position = [{ x: index.signal[0].delta - options.width, y: options.line * height + 'px' }, { x: index.signal[0].delta + options.width, y: options.line * height + 3 + 'px' }];
                        } else {
                            annotation.position = [{ x: index.to, y: options.line * height + 'px' }, { x: index.from, y: options.line * height + 3 + 'px' }];
                        }
                    }

                    index._highlight = annotation._highlight;

                    annotation.type = options.type;

                    if (!options.noLabel && index.integral) {
                        annotation.label = {
                            text: index.integral.toFixed(options.toFixed),
                            size: '11px',
                            anchor: 'middle',
                            color: options.labelColor,
                            position: { x: (annotation.position[0].x + annotation.position[1].x) / 2,
                                y: (options.line + options.lineLabel) * height + 'px', dy: '5px' }
                        };
                    }

                    annotation.selectable = options.selectable;
                    annotation.strokeColor = options.strokeColor;
                    annotation.strokeWidth = options.strokeWidth;
                    annotation.fillColor = options.fillColor;
                    annotation.info = index;
                }
                return annotations;
            }

            function annotations2D(zones, optionsG) {
                var options = Object.assign({}, options2D, optionsG);
                var annotations = [];
                for (var k = zones.length - 1; k >= 0; k--) {
                    var signal = zones[k];
                    var annotation = {};
                    annotation.type = options.type;
                    annotation._highlight = signal._highlight; //["cosy"+k];
                    if (!annotation._highlight || annotation._highlight.length === 0) {
                        annotation._highlight = [signal.signalID];
                    }
                    signal._highlight = annotation._highlight;

                    annotation.position = [{ x: signal.fromTo[0].from - 0.01, y: signal.fromTo[1].from - 0.01, dx: options.width, dy: options.height }, { x: signal.fromTo[0].to + 0.01, y: signal.fromTo[1].to + 0.01 }];
                    annotation.fillColor = options.fillColor;
                    annotation.label = { text: signal.remark,
                        position: {
                            x: signal.signal[0].delta[0],
                            y: signal.signal[0].delta[1] - 0.025 }
                    };
                    if (signal.integral === 1) {
                        annotation.strokeColor = options.strokeColor;
                    } else {
                        annotation.strokeColor = 'rgb(0,128,0)';
                    }

                    annotation.strokeWidth = options.strokeWidth;
                    annotation.width = options.width;
                    annotation.height = options.height;
                    annotation.info = signal;
                    annotations.push(annotation);
                }
                return annotations;
            }

            module.exports = { annotations2D: annotations2D, annotations1D: annotations1D };

            /***/ }),
        /* 1 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            function compareNumbers(a, b) {
                return a - b;
            }

            /**
             * Computes the sum of the given values
             * @param {Array} values
             * @returns {number}
             */
            exports.sum = function sum(values) {
                var sum = 0;
                for (var i = 0; i < values.length; i++) {
                    sum += values[i];
                }
                return sum;
            };

            /**
             * Computes the maximum of the given values
             * @param {Array} values
             * @returns {number}
             */
            exports.max = function max(values) {
                var max = values[0];
                var l = values.length;
                for (var i = 1; i < l; i++) {
                    if (values[i] > max) max = values[i];
                }
                return max;
            };

            /**
             * Computes the minimum of the given values
             * @param {Array} values
             * @returns {number}
             */
            exports.min = function min(values) {
                var min = values[0];
                var l = values.length;
                for (var i = 1; i < l; i++) {
                    if (values[i] < min) min = values[i];
                }
                return min;
            };

            /**
             * Computes the min and max of the given values
             * @param {Array} values
             * @returns {{min: number, max: number}}
             */
            exports.minMax = function minMax(values) {
                var min = values[0];
                var max = values[0];
                var l = values.length;
                for (var i = 1; i < l; i++) {
                    if (values[i] < min) min = values[i];
                    if (values[i] > max) max = values[i];
                }
                return {
                    min: min,
                    max: max
                };
            };

            /**
             * Computes the arithmetic mean of the given values
             * @param {Array} values
             * @returns {number}
             */
            exports.arithmeticMean = function arithmeticMean(values) {
                var sum = 0;
                var l = values.length;
                for (var i = 0; i < l; i++) {
                    sum += values[i];
                }
                return sum / l;
            };

            /**
             * {@link arithmeticMean}
             */
            exports.mean = exports.arithmeticMean;

            /**
             * Computes the geometric mean of the given values
             * @param {Array} values
             * @returns {number}
             */
            exports.geometricMean = function geometricMean(values) {
                var mul = 1;
                var l = values.length;
                for (var i = 0; i < l; i++) {
                    mul *= values[i];
                }
                return Math.pow(mul, 1 / l);
            };

            /**
             * Computes the mean of the log of the given values
             * If the return value is exponentiated, it gives the same result as the
             * geometric mean.
             * @param {Array} values
             * @returns {number}
             */
            exports.logMean = function logMean(values) {
                var lnsum = 0;
                var l = values.length;
                for (var i = 0; i < l; i++) {
                    lnsum += Math.log(values[i]);
                }
                return lnsum / l;
            };

            /**
             * Computes the weighted grand mean for a list of means and sample sizes
             * @param {Array} means - Mean values for each set of samples
             * @param {Array} samples - Number of original values for each set of samples
             * @returns {number}
             */
            exports.grandMean = function grandMean(means, samples) {
                var sum = 0;
                var n = 0;
                var l = means.length;
                for (var i = 0; i < l; i++) {
                    sum += samples[i] * means[i];
                    n += samples[i];
                }
                return sum / n;
            };

            /**
             * Computes the truncated mean of the given values using a given percentage
             * @param {Array} values
             * @param {number} percent - The percentage of values to keep (range: [0,1])
             * @param {boolean} [alreadySorted=false]
             * @returns {number}
             */
            exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
                if (alreadySorted === undefined) alreadySorted = false;
                if (!alreadySorted) {
                    values = [].concat(values).sort(compareNumbers);
                }
                var l = values.length;
                var k = Math.floor(l * percent);
                var sum = 0;
                for (var i = k; i < l - k; i++) {
                    sum += values[i];
                }
                return sum / (l - 2 * k);
            };

            /**
             * Computes the harmonic mean of the given values
             * @param {Array} values
             * @returns {number}
             */
            exports.harmonicMean = function harmonicMean(values) {
                var sum = 0;
                var l = values.length;
                for (var i = 0; i < l; i++) {
                    if (values[i] === 0) {
                        throw new RangeError('value at index ' + i + 'is zero');
                    }
                    sum += 1 / values[i];
                }
                return l / sum;
            };

            /**
             * Computes the contraharmonic mean of the given values
             * @param {Array} values
             * @returns {number}
             */
            exports.contraHarmonicMean = function contraHarmonicMean(values) {
                var r1 = 0;
                var r2 = 0;
                var l = values.length;
                for (var i = 0; i < l; i++) {
                    r1 += values[i] * values[i];
                    r2 += values[i];
                }
                if (r2 < 0) {
                    throw new RangeError('sum of values is negative');
                }
                return r1 / r2;
            };

            /**
             * Computes the median of the given values
             * @param {Array} values
             * @param {boolean} [alreadySorted=false]
             * @returns {number}
             */
            exports.median = function median(values, alreadySorted) {
                if (alreadySorted === undefined) alreadySorted = false;
                if (!alreadySorted) {
                    values = [].concat(values).sort(compareNumbers);
                }
                var l = values.length;
                var half = Math.floor(l / 2);
                if (l % 2 === 0) {
                    return (values[half - 1] + values[half]) * 0.5;
                } else {
                    return values[half];
                }
            };

            /**
             * Computes the variance of the given values
             * @param {Array} values
             * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
             * @returns {number}
             */
            exports.variance = function variance(values, unbiased) {
                if (unbiased === undefined) unbiased = true;
                var theMean = exports.mean(values);
                var theVariance = 0;
                var l = values.length;

                for (var i = 0; i < l; i++) {
                    var x = values[i] - theMean;
                    theVariance += x * x;
                }

                if (unbiased) {
                    return theVariance / (l - 1);
                } else {
                    return theVariance / l;
                }
            };

            /**
             * Computes the standard deviation of the given values
             * @param {Array} values
             * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
             * @returns {number}
             */
            exports.standardDeviation = function standardDeviation(values, unbiased) {
                return Math.sqrt(exports.variance(values, unbiased));
            };

            exports.standardError = function standardError(values) {
                return exports.standardDeviation(values) / Math.sqrt(values.length);
            };

            /**
             * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
             * Calculate the standard deviation via the Median of the absolute deviation
             *  The formula for the standard deviation only holds for Gaussian random variables.
             * @returns {{mean: number, stdev: number}}
             */
            exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
                var mean = 0,
                    stdev = 0;
                var length = y.length,
                    i = 0;
                for (i = 0; i < length; i++) {
                    mean += y[i];
                }
                mean /= length;
                var averageDeviations = new Array(length);
                for (i = 0; i < length; i++) {
                    averageDeviations[i] = Math.abs(y[i] - mean);
                }averageDeviations.sort(compareNumbers);
                if (length % 2 === 1) {
                    stdev = averageDeviations[(length - 1) / 2] / 0.6745;
                } else {
                    stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
                }

                return {
                    mean: mean,
                    stdev: stdev
                };
            };

            exports.quartiles = function quartiles(values, alreadySorted) {
                if (typeof alreadySorted === 'undefined') alreadySorted = false;
                if (!alreadySorted) {
                    values = [].concat(values).sort(compareNumbers);
                }

                var quart = values.length / 4;
                var q1 = values[Math.ceil(quart) - 1];
                var q2 = exports.median(values, true);
                var q3 = values[Math.ceil(quart * 3) - 1];

                return { q1: q1, q2: q2, q3: q3 };
            };

            exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
                return Math.sqrt(exports.pooledVariance(samples, unbiased));
            };

            exports.pooledVariance = function pooledVariance(samples, unbiased) {
                if (typeof unbiased === 'undefined') unbiased = true;
                var sum = 0;
                var length = 0,
                    l = samples.length;
                for (var i = 0; i < l; i++) {
                    var values = samples[i];
                    var vari = exports.variance(values);

                    sum += (values.length - 1) * vari;

                    if (unbiased) length += values.length - 1;else length += values.length;
                }
                return sum / length;
            };

            exports.mode = function mode(values) {
                var l = values.length,
                    itemCount = new Array(l),
                    i;
                for (i = 0; i < l; i++) {
                    itemCount[i] = 0;
                }
                var itemArray = new Array(l);
                var count = 0;

                for (i = 0; i < l; i++) {
                    var index = itemArray.indexOf(values[i]);
                    if (index >= 0) itemCount[index]++;else {
                        itemArray[count] = values[i];
                        itemCount[count] = 1;
                        count++;
                    }
                }

                var maxValue = 0,
                    maxIndex = 0;
                for (i = 0; i < count; i++) {
                    if (itemCount[i] > maxValue) {
                        maxValue = itemCount[i];
                        maxIndex = i;
                    }
                }

                return itemArray[maxIndex];
            };

            exports.covariance = function covariance(vector1, vector2, unbiased) {
                if (typeof unbiased === 'undefined') unbiased = true;
                var mean1 = exports.mean(vector1);
                var mean2 = exports.mean(vector2);

                if (vector1.length !== vector2.length) throw 'Vectors do not have the same dimensions';

                var cov = 0,
                    l = vector1.length;
                for (var i = 0; i < l; i++) {
                    var x = vector1[i] - mean1;
                    var y = vector2[i] - mean2;
                    cov += x * y;
                }

                if (unbiased) return cov / (l - 1);else return cov / l;
            };

            exports.skewness = function skewness(values, unbiased) {
                if (typeof unbiased === 'undefined') unbiased = true;
                var theMean = exports.mean(values);

                var s2 = 0,
                    s3 = 0,
                    l = values.length;
                for (var i = 0; i < l; i++) {
                    var dev = values[i] - theMean;
                    s2 += dev * dev;
                    s3 += dev * dev * dev;
                }
                var m2 = s2 / l;
                var m3 = s3 / l;

                var g = m3 / Math.pow(m2, 3 / 2.0);
                if (unbiased) {
                    var a = Math.sqrt(l * (l - 1));
                    var b = l - 2;
                    return a / b * g;
                } else {
                    return g;
                }
            };

            exports.kurtosis = function kurtosis(values, unbiased) {
                if (typeof unbiased === 'undefined') unbiased = true;
                var theMean = exports.mean(values);
                var n = values.length,
                    s2 = 0,
                    s4 = 0;

                for (var i = 0; i < n; i++) {
                    var dev = values[i] - theMean;
                    s2 += dev * dev;
                    s4 += dev * dev * dev * dev;
                }
                var m2 = s2 / n;
                var m4 = s4 / n;

                if (unbiased) {
                    var v = s2 / (n - 1);
                    var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
                    var b = s4 / (v * v);
                    var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));

                    return a * b - 3 * c;
                } else {
                    return m4 / (m2 * m2) - 3;
                }
            };

            exports.entropy = function entropy(values, eps) {
                if (typeof eps === 'undefined') eps = 0;
                var sum = 0,
                    l = values.length;
                for (var i = 0; i < l; i++) {
                    sum += values[i] * Math.log(values[i] + eps);
                }return -sum;
            };

            exports.weightedMean = function weightedMean(values, weights) {
                var sum = 0,
                    l = values.length;
                for (var i = 0; i < l; i++) {
                    sum += values[i] * weights[i];
                }return sum;
            };

            exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
                return Math.sqrt(exports.weightedVariance(values, weights));
            };

            exports.weightedVariance = function weightedVariance(values, weights) {
                var theMean = exports.weightedMean(values, weights);
                var vari = 0,
                    l = values.length;
                var a = 0,
                    b = 0;

                for (var i = 0; i < l; i++) {
                    var z = values[i] - theMean;
                    var w = weights[i];

                    vari += w * (z * z);
                    b += w;
                    a += w * w;
                }

                return vari * (b / (b * b - a));
            };

            exports.center = function center(values, inPlace) {
                if (typeof inPlace === 'undefined') inPlace = false;

                var result = values;
                if (!inPlace) result = [].concat(values);

                var theMean = exports.mean(result),
                    l = result.length;
                for (var i = 0; i < l; i++) {
                    result[i] -= theMean;
                }
            };

            exports.standardize = function standardize(values, standardDev, inPlace) {
                if (typeof standardDev === 'undefined') standardDev = exports.standardDeviation(values);
                if (typeof inPlace === 'undefined') inPlace = false;
                var l = values.length;
                var result = inPlace ? values : new Array(l);
                for (var i = 0; i < l; i++) {
                    result[i] = values[i] / standardDev;
                }return result;
            };

            exports.cumulativeSum = function cumulativeSum(array) {
                var l = array.length;
                var result = new Array(l);
                result[0] = array[0];
                for (var i = 1; i < l; i++) {
                    result[i] = result[i - 1] + array[i];
                }return result;
            };

            /***/ }),
        /* 2 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            var patterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];

            module.exports.nmrJ = function nmrJ(Js) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var jString = '';
                options = Object.assign({}, { separator: ', ', nbDecimal: 2 }, options);
                var j = void 0,
                    i = void 0;
                for (i = 0; i < Js.length; i++) {
                    j = Js[i];
                    if (j.length > 11) {
                        j += options.separator;
                    }
                    jString += j.multiplicity + ' ' + j.coupling.toFixed(options.nbDecimal);
                }
                return jString;
            };

            module.exports.joinCoupling = function joinCoupling(signal) {
                var tolerance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.05;

                var jc = signal.j;
                if (jc && jc.length > 0) {
                    var cont = jc[0].assignment ? jc[0].assignment.length : 1;
                    var pattern = '';
                    var newNmrJs = [];
                    var diaIDs = [];
                    var atoms = [];
                    jc.sort(function (a, b) {
                        return b.coupling - a.coupling;
                    });
                    if (jc[0].diaID) {
                        diaIDs = [jc[0].diaID];
                    }
                    if (jc[0].assignment) {
                        atoms = jc[0].assignment;
                    }
                    for (var i = 0; i < jc.length - 1; i++) {
                        if (Math.abs(jc[i].coupling - jc[i + 1].coupling) < tolerance) {
                            cont += jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
                            diaIDs.push(jc[i].diaID);
                            atoms = atoms.concat(jc[i + 1].assignment);
                        } else {
                            var _jTemp = {
                                coupling: Math.abs(jc[i].coupling),
                                multiplicity: patterns[cont]
                            };
                            if (diaIDs.length > 0) {
                                _jTemp.diaID = diaIDs;
                            }
                            if (atoms.length > 0) {
                                _jTemp.assignment = atoms;
                            }
                            newNmrJs.push(_jTemp);
                            if (jc[0].diaID) {
                                diaIDs = [jc[i].diaID];
                            }
                            if (jc[0].assignment) {
                                atoms = jc[i].assignment;
                            }
                            pattern += patterns[cont];
                            cont = jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
                        }
                    }
                    var jTemp = {
                        coupling: Math.abs(jc[i].coupling),
                        multiplicity: patterns[cont]
                    };
                    if (diaIDs.length > 0) {
                        jTemp.diaID = diaIDs;
                    }
                    if (atoms.length > 0) {
                        jTemp.assignment = atoms;
                    }
                    newNmrJs.push(jTemp);

                    pattern += patterns[cont];
                    signal.j = newNmrJs;
                } else if (signal.delta) {
                    pattern = 's';
                } else {
                    pattern = 'm';
                }
                return pattern;
            };

            module.exports.group = function group(signals) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var i, k;
                for (i = 0; i < signals.length; i++) {
                    var j = signals[i].j;
                    if (j && j.length > 0) {
                        for (k = j.length - 2; k >= 0; k--) {
                            for (var m = j.length - 1; m > k; m--) {
                                if (j[k].diaID === j[m].diaID && j[k].coupling === j[m].coupling && j[k].distance === j[m].distance) {
                                    j[k].assignment = j[k].assignment.concat(j[m].assignment);
                                    j.splice(m, 1);
                                }
                            }
                        }
                    }
                }
                signals.sort(function (a, b) {
                    if (a.diaIDs[0] < b.diaIDs[0]) return -1;
                    if (a.diaIDs[0] > b.diaIDs[0]) return 1;
                    return 0;
                });

                for (i = signals.length - 2; i >= 0; i--) {
                    if (signals[i].diaIDs[0] === signals[i + 1].diaIDs[0]) {
                        signals[i].nbAtoms += signals[i + 1].nbAtoms;
                        signals[i].atomIDs = signals[i].atomIDs.concat(signals[i + 1].atomIDs);
                        signals.splice(i + 1, 1);
                    }
                }
                for (i = 0; i < signals.length; i++) {
                    j = signals[i].j;
                    for (k = 0; k < j.length; k++) {
                        j[k].multiplicity = patterns[j[k].assignment.length];
                    }
                    signals[i].multiplicity = module.exports.compilePattern(signals[i], options.tolerance);
                }
                return signals;
            };

            module.exports.compilePattern = function compilePattern(signal) {
                var tolerance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.05;

                var jc = signal.j;
                var pattern = '';
                if (jc && jc.length > 0) {
                    var cont = jc[0].assignment ? jc[0].assignment.length : 0;
                    jc.sort(function (a, b) {
                        return b.coupling - a.coupling;
                    });
                    for (var i = 0; i < jc.length - 1; i++) {
                        if (Math.abs(jc[i].coupling - jc[i + 1].coupling) < tolerance) {
                            cont += jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
                        } else {
                            pattern += patterns[cont];
                            cont = jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
                        }
                    }
                    pattern += patterns[cont];
                } else if (signal.delta) {
                    pattern = 's';
                } else {
                    pattern = 'm';
                }
                return pattern;
            };

            /***/ }),
        /* 3 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

            function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

            function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

            function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

            function _extendableBuiltin(cls) {
                function ExtendableBuiltin() {
                    var instance = Reflect.construct(cls, Array.from(arguments));
                    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
                    return instance;
                }

                ExtendableBuiltin.prototype = Object.create(cls.prototype, {
                    constructor: {
                        value: cls,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });

                if (Object.setPrototypeOf) {
                    Object.setPrototypeOf(ExtendableBuiltin, cls);
                } else {
                    ExtendableBuiltin.__proto__ = cls;
                }

                return ExtendableBuiltin;
            }

            var acs = __webpack_require__(6);
            var peak2Vector = __webpack_require__(8);
            var GUI = __webpack_require__(0);
            var utils = __webpack_require__(2);
            var arrayUtils = __webpack_require__(4).array;

            var Ranges = function (_extendableBuiltin2) {
                _inherits(Ranges, _extendableBuiltin2);

                function Ranges(ranges) {
                    _classCallCheck(this, Ranges);

                    if (Array.isArray(ranges)) {
                        var _this = _possibleConstructorReturn(this, (Ranges.__proto__ || Object.getPrototypeOf(Ranges)).call(this, ranges.length));

                        for (var i = 0; i < ranges.length; i++) {
                            _this[i] = ranges[i];
                        }
                    } else if (typeof ranges === 'number') {
                        var _this = _possibleConstructorReturn(this, (Ranges.__proto__ || Object.getPrototypeOf(Ranges)).call(this, ranges));
                    } else {
                        var _this = _possibleConstructorReturn(this, (Ranges.__proto__ || Object.getPrototypeOf(Ranges)).call(this));
                    }
                    return _possibleConstructorReturn(_this);
                }

                /**
                 * This function return a Range instance from predictions
                 * @param {object} signals - predictions of a spin system
                 * @param {object} options - options object
                 * @param {number} [options.lineWidth] - spectral line width
                 * @param {number} [options.frequency] - frequency to determine the [from, to] of a range
                 * @return {Ranges}
                 */


                _createClass(Ranges, [{
                    key: 'updateIntegrals',


                    /**
                     * TODO it is the same code that updateIntegrals in Range class
                     * This function normalize or scale the integral data
                     * @param {object} options - object with the options
                     * @param {boolean} [options.sum] - anything factor to normalize the integrals, Similar to the number of proton in the molecule for a nmr spectrum
                     * @param {number} [options.factor] - Factor that multiply the intensities, if [options.sum] is defined it is override
                     * @return {Ranges}
                     */
                    value: function updateIntegrals() {
                        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        var factor = options.factor || 1;
                        var i;
                        if (options.sum) {
                            var nH = options.sum || 1;
                            var sumObserved = 0;
                            for (i = 0; i < this.length; i++) {
                                sumObserved += this[i].integral;
                            }
                            factor = nH / sumObserved;
                        }
                        for (i = 0; i < this.length; i++) {
                            this[i].integral *= factor;
                        }
                        return this;
                    }

                    /**
                     * This function return the peak list as a object with x and y arrays
                     * @param {bject} options - See the options parameter in {@link #peak2vector} function documentation
                     * @return {object} - {x: Array, y: Array}
                     */

                }, {
                    key: 'getVector',
                    value: function getVector(options) {
                        if (this[0].signal[0].peak) {
                            return peak2Vector(this.getPeakList(), options);
                        } else {
                            throw Error('This method is only for signals with peaks');
                        }
                    }

                    /**
                     * This function return the peaks of a Ranges instance into an array
                     * @return {Array}
                     */

                }, {
                    key: 'getPeakList',
                    value: function getPeakList() {
                        if (this[0].signal[0].peak) {
                            var peaks = [];
                            for (var i = 0; i < this.length; i++) {
                                var range = this[i];
                                for (var j = 0; j < range.signal.length; j++) {
                                    peaks = peaks.concat(range.signal[j].peak);
                                }
                            }
                            return peaks;
                        } else {
                            throw Error('This method is only for signals with peaks');
                        }
                    }

                    /**
                     * This function return format for each range
                     * @param {object} options - options object for toAcs function
                     * @return {*}
                     */

                }, {
                    key: 'getACS',
                    value: function getACS(options) {
                        return acs(this, options);
                    }
                }, {
                    key: 'getAnnotations',
                    value: function getAnnotations(options) {
                        return GUI.annotations1D(this, options);
                    }
                }, {
                    key: 'toIndex',
                    value: function toIndex() {
                        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        var index = [];
                        if (options.joinCouplings) {
                            this.joinCouplings(options);
                        }
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var range = _step.value;

                                if (Array.isArray(range.signal) && range.signal.length > 0) {
                                    var l = range.signal.length;
                                    var delta = new Array(l);
                                    for (var i = 0; i < l; i++) {
                                        delta[i] = range.signal[i].delta;
                                    }
                                    index.push({
                                        multiplicity: l > 1 ? 'm' : range.signal[0].multiplicity || utils.joinCoupling(range.signal[0], options.tolerance),
                                        delta: arrayUtils.arithmeticMean(delta) || (range.to + range.from) * 0.5,
                                        integral: range.integral
                                    });
                                } else {
                                    index.push({
                                        delta: (range.to + range.from) * 0.5,
                                        multiplicity: 'm'
                                    });
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        return index;
                    }

                    /**
                     * Joins coupling constants
                     * @param {object} [options]
                     * @param {number} [options.tolerance=0.05]
                     */

                }, {
                    key: 'joinCouplings',
                    value: function joinCouplings() {
                        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        this.forEach(function (range) {
                            range.signal.forEach(function (signal) {
                                signal.multiplicity = utils.joinCoupling(signal, options.tolerance);
                            });
                        });
                    }
                }, {
                    key: 'clone',
                    value: function clone() {
                        var newRanges = JSON.parse(JSON.stringify(this));
                        return new Ranges(newRanges);
                    }
                }], [{
                    key: 'fromSignals',
                    value: function fromSignals(signals, options) {
                        options = Object.assign({}, { lineWidth: 1, frequency: 400, nucleus: '1H' }, options);
                        //1. Collapse all the equivalent predictions

                        signals = utils.group(signals, options);
                        var nSignals = signals.length;
                        var i, j, signal, width, center, jc;

                        var result = new Array(nSignals);

                        for (i = 0; i < nSignals; i++) {
                            signal = signals[i];
                            width = 0;
                            jc = signal.j;
                            if (jc) {
                                for (j = 0; j < jc.length; j++) {
                                    width += jc[j].coupling;
                                }
                            }

                            width += 2 * options.lineWidth;

                            width /= options.frequency;

                            result[i] = {
                                from: signal.delta - width,
                                to: signal.delta + width,
                                integral: signal.nbAtoms,
                                signal: [signal]
                            };
                        }

                        //2. Merge the overlaping ranges
                        for (i = 0; i < result.length; i++) {
                            result[i]._highlight = result[i].signal[0].diaIDs;
                            center = (result[i].from + result[i].to) / 2;
                            width = Math.abs(result[i].from - result[i].to);
                            for (j = result.length - 1; j > i; j--) {
                                //Does it overlap?
                                if (Math.abs(center - (result[j].from + result[j].to) / 2) <= Math.abs(width + Math.abs(result[j].from - result[j].to)) / 2) {
                                    result[i].from = Math.min(result[i].from, result[j].from);
                                    result[i].to = Math.max(result[i].to, result[j].to);
                                    result[i].integral += result[j].integral;
                                    result[i]._highlight.push(result[j].signal[0].diaIDs[0]);
                                    result[j].signal.forEach(function (a) {
                                        result[i].signal.push(a);
                                    });
                                    result.splice(j, 1);
                                    j = result.length - 1;
                                    center = (result[i].from + result[i].to) / 2;
                                    width = Math.abs(result[i].from - result[i].to);
                                }
                            }
                        }
                        result.sort(function (a, b) {
                            return a.from - b.from;
                        });
                        return new Ranges(result);
                    }

                    /**
                     * This function return Ranges instance from a SD instance
                     * @param {SD} spectrum - SD instance
                     * @param {object} options - options object to extractPeaks function
                     * @return {Ranges}
                     */

                }, {
                    key: 'fromSpectrum',
                    value: function fromSpectrum(spectrum) {
                        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                        return spectrum.getRanges(options);
                    }
                }]);

                return Ranges;
            }(_extendableBuiltin(Array));

            module.exports = Ranges;

            /***/ }),
        /* 4 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            exports.array = __webpack_require__(1);
            exports.matrix = __webpack_require__(5);

            /***/ }),
        /* 5 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            var arrayStat = __webpack_require__(1);

            function compareNumbers(a, b) {
                return a - b;
            }

            exports.max = function max(matrix) {
                var max = -Infinity;
                for (var i = 0; i < matrix.length; i++) {
                    for (var j = 0; j < matrix[i].length; j++) {
                        if (matrix[i][j] > max) max = matrix[i][j];
                    }
                }
                return max;
            };

            exports.min = function min(matrix) {
                var min = Infinity;
                for (var i = 0; i < matrix.length; i++) {
                    for (var j = 0; j < matrix[i].length; j++) {
                        if (matrix[i][j] < min) min = matrix[i][j];
                    }
                }
                return min;
            };

            exports.minMax = function minMax(matrix) {
                var min = Infinity;
                var max = -Infinity;
                for (var i = 0; i < matrix.length; i++) {
                    for (var j = 0; j < matrix[i].length; j++) {
                        if (matrix[i][j] < min) min = matrix[i][j];
                        if (matrix[i][j] > max) max = matrix[i][j];
                    }
                }
                return {
                    min: min,
                    max: max
                };
            };

            exports.entropy = function entropy(matrix, eps) {
                if (typeof eps === 'undefined') {
                    eps = 0;
                }
                var sum = 0,
                    l1 = matrix.length,
                    l2 = matrix[0].length;
                for (var i = 0; i < l1; i++) {
                    for (var j = 0; j < l2; j++) {
                        sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
                    }
                }
                return -sum;
            };

            exports.mean = function mean(matrix, dimension) {
                if (typeof dimension === 'undefined') {
                    dimension = 0;
                }
                var rows = matrix.length,
                    cols = matrix[0].length,
                    theMean,
                    N,
                    i,
                    j;

                if (dimension === -1) {
                    theMean = [0];
                    N = rows * cols;
                    for (i = 0; i < rows; i++) {
                        for (j = 0; j < cols; j++) {
                            theMean[0] += matrix[i][j];
                        }
                    }
                    theMean[0] /= N;
                } else if (dimension === 0) {
                    theMean = new Array(cols);
                    N = rows;
                    for (j = 0; j < cols; j++) {
                        theMean[j] = 0;
                        for (i = 0; i < rows; i++) {
                            theMean[j] += matrix[i][j];
                        }
                        theMean[j] /= N;
                    }
                } else if (dimension === 1) {
                    theMean = new Array(rows);
                    N = cols;
                    for (j = 0; j < rows; j++) {
                        theMean[j] = 0;
                        for (i = 0; i < cols; i++) {
                            theMean[j] += matrix[j][i];
                        }
                        theMean[j] /= N;
                    }
                } else {
                    throw new Error('Invalid dimension');
                }
                return theMean;
            };

            exports.sum = function sum(matrix, dimension) {
                if (typeof dimension === 'undefined') {
                    dimension = 0;
                }
                var rows = matrix.length,
                    cols = matrix[0].length,
                    theSum,
                    i,
                    j;

                if (dimension === -1) {
                    theSum = [0];
                    for (i = 0; i < rows; i++) {
                        for (j = 0; j < cols; j++) {
                            theSum[0] += matrix[i][j];
                        }
                    }
                } else if (dimension === 0) {
                    theSum = new Array(cols);
                    for (j = 0; j < cols; j++) {
                        theSum[j] = 0;
                        for (i = 0; i < rows; i++) {
                            theSum[j] += matrix[i][j];
                        }
                    }
                } else if (dimension === 1) {
                    theSum = new Array(rows);
                    for (j = 0; j < rows; j++) {
                        theSum[j] = 0;
                        for (i = 0; i < cols; i++) {
                            theSum[j] += matrix[j][i];
                        }
                    }
                } else {
                    throw new Error('Invalid dimension');
                }
                return theSum;
            };

            exports.product = function product(matrix, dimension) {
                if (typeof dimension === 'undefined') {
                    dimension = 0;
                }
                var rows = matrix.length,
                    cols = matrix[0].length,
                    theProduct,
                    i,
                    j;

                if (dimension === -1) {
                    theProduct = [1];
                    for (i = 0; i < rows; i++) {
                        for (j = 0; j < cols; j++) {
                            theProduct[0] *= matrix[i][j];
                        }
                    }
                } else if (dimension === 0) {
                    theProduct = new Array(cols);
                    for (j = 0; j < cols; j++) {
                        theProduct[j] = 1;
                        for (i = 0; i < rows; i++) {
                            theProduct[j] *= matrix[i][j];
                        }
                    }
                } else if (dimension === 1) {
                    theProduct = new Array(rows);
                    for (j = 0; j < rows; j++) {
                        theProduct[j] = 1;
                        for (i = 0; i < cols; i++) {
                            theProduct[j] *= matrix[j][i];
                        }
                    }
                } else {
                    throw new Error('Invalid dimension');
                }
                return theProduct;
            };

            exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
                var vari = exports.variance(matrix, means, unbiased),
                    l = vari.length;
                for (var i = 0; i < l; i++) {
                    vari[i] = Math.sqrt(vari[i]);
                }
                return vari;
            };

            exports.variance = function variance(matrix, means, unbiased) {
                if (typeof unbiased === 'undefined') {
                    unbiased = true;
                }
                means = means || exports.mean(matrix);
                var rows = matrix.length;
                if (rows === 0) return [];
                var cols = matrix[0].length;
                var vari = new Array(cols);

                for (var j = 0; j < cols; j++) {
                    var sum1 = 0,
                        sum2 = 0,
                        x = 0;
                    for (var i = 0; i < rows; i++) {
                        x = matrix[i][j] - means[j];
                        sum1 += x;
                        sum2 += x * x;
                    }
                    if (unbiased) {
                        vari[j] = (sum2 - sum1 * sum1 / rows) / (rows - 1);
                    } else {
                        vari[j] = (sum2 - sum1 * sum1 / rows) / rows;
                    }
                }
                return vari;
            };

            exports.median = function median(matrix) {
                var rows = matrix.length,
                    cols = matrix[0].length;
                var medians = new Array(cols);

                for (var i = 0; i < cols; i++) {
                    var data = new Array(rows);
                    for (var j = 0; j < rows; j++) {
                        data[j] = matrix[j][i];
                    }
                    data.sort(compareNumbers);
                    var N = data.length;
                    if (N % 2 === 0) {
                        medians[i] = (data[N / 2] + data[N / 2 - 1]) * 0.5;
                    } else {
                        medians[i] = data[Math.floor(N / 2)];
                    }
                }
                return medians;
            };

            exports.mode = function mode(matrix) {
                var rows = matrix.length,
                    cols = matrix[0].length,
                    modes = new Array(cols),
                    i,
                    j;
                for (i = 0; i < cols; i++) {
                    var itemCount = new Array(rows);
                    for (var k = 0; k < rows; k++) {
                        itemCount[k] = 0;
                    }
                    var itemArray = new Array(rows);
                    var count = 0;

                    for (j = 0; j < rows; j++) {
                        var index = itemArray.indexOf(matrix[j][i]);
                        if (index >= 0) {
                            itemCount[index]++;
                        } else {
                            itemArray[count] = matrix[j][i];
                            itemCount[count] = 1;
                            count++;
                        }
                    }

                    var maxValue = 0,
                        maxIndex = 0;
                    for (j = 0; j < count; j++) {
                        if (itemCount[j] > maxValue) {
                            maxValue = itemCount[j];
                            maxIndex = j;
                        }
                    }

                    modes[i] = itemArray[maxIndex];
                }
                return modes;
            };

            exports.skewness = function skewness(matrix, unbiased) {
                if (typeof unbiased === 'undefined') unbiased = true;
                var means = exports.mean(matrix);
                var n = matrix.length,
                    l = means.length;
                var skew = new Array(l);

                for (var j = 0; j < l; j++) {
                    var s2 = 0,
                        s3 = 0;
                    for (var i = 0; i < n; i++) {
                        var dev = matrix[i][j] - means[j];
                        s2 += dev * dev;
                        s3 += dev * dev * dev;
                    }

                    var m2 = s2 / n;
                    var m3 = s3 / n;
                    var g = m3 / Math.pow(m2, 3 / 2);

                    if (unbiased) {
                        var a = Math.sqrt(n * (n - 1));
                        var b = n - 2;
                        skew[j] = a / b * g;
                    } else {
                        skew[j] = g;
                    }
                }
                return skew;
            };

            exports.kurtosis = function kurtosis(matrix, unbiased) {
                if (typeof unbiased === 'undefined') unbiased = true;
                var means = exports.mean(matrix);
                var n = matrix.length,
                    m = matrix[0].length;
                var kurt = new Array(m);

                for (var j = 0; j < m; j++) {
                    var s2 = 0,
                        s4 = 0;
                    for (var i = 0; i < n; i++) {
                        var dev = matrix[i][j] - means[j];
                        s2 += dev * dev;
                        s4 += dev * dev * dev * dev;
                    }
                    var m2 = s2 / n;
                    var m4 = s4 / n;

                    if (unbiased) {
                        var v = s2 / (n - 1);
                        var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
                        var b = s4 / (v * v);
                        var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));
                        kurt[j] = a * b - 3 * c;
                    } else {
                        kurt[j] = m4 / (m2 * m2) - 3;
                    }
                }
                return kurt;
            };

            exports.standardError = function standardError(matrix) {
                var samples = matrix.length;
                var standardDeviations = exports.standardDeviation(matrix);
                var l = standardDeviations.length;
                var standardErrors = new Array(l);
                var sqrtN = Math.sqrt(samples);

                for (var i = 0; i < l; i++) {
                    standardErrors[i] = standardDeviations[i] / sqrtN;
                }
                return standardErrors;
            };

            exports.covariance = function covariance(matrix, dimension) {
                return exports.scatter(matrix, undefined, dimension);
            };

            exports.scatter = function scatter(matrix, divisor, dimension) {
                if (typeof dimension === 'undefined') {
                    dimension = 0;
                }
                if (typeof divisor === 'undefined') {
                    if (dimension === 0) {
                        divisor = matrix.length - 1;
                    } else if (dimension === 1) {
                        divisor = matrix[0].length - 1;
                    }
                }
                var means = exports.mean(matrix, dimension);
                var rows = matrix.length;
                if (rows === 0) {
                    return [[]];
                }
                var cols = matrix[0].length,
                    cov,
                    i,
                    j,
                    s,
                    k;

                if (dimension === 0) {
                    cov = new Array(cols);
                    for (i = 0; i < cols; i++) {
                        cov[i] = new Array(cols);
                    }
                    for (i = 0; i < cols; i++) {
                        for (j = i; j < cols; j++) {
                            s = 0;
                            for (k = 0; k < rows; k++) {
                                s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                            }
                            s /= divisor;
                            cov[i][j] = s;
                            cov[j][i] = s;
                        }
                    }
                } else if (dimension === 1) {
                    cov = new Array(rows);
                    for (i = 0; i < rows; i++) {
                        cov[i] = new Array(rows);
                    }
                    for (i = 0; i < rows; i++) {
                        for (j = i; j < rows; j++) {
                            s = 0;
                            for (k = 0; k < cols; k++) {
                                s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                            }
                            s /= divisor;
                            cov[i][j] = s;
                            cov[j][i] = s;
                        }
                    }
                } else {
                    throw new Error('Invalid dimension');
                }

                return cov;
            };

            exports.correlation = function correlation(matrix) {
                var means = exports.mean(matrix),
                    standardDeviations = exports.standardDeviation(matrix, true, means),
                    scores = exports.zScores(matrix, means, standardDeviations),
                    rows = matrix.length,
                    cols = matrix[0].length,
                    i,
                    j;

                var cor = new Array(cols);
                for (i = 0; i < cols; i++) {
                    cor[i] = new Array(cols);
                }
                for (i = 0; i < cols; i++) {
                    for (j = i; j < cols; j++) {
                        var c = 0;
                        for (var k = 0, l = scores.length; k < l; k++) {
                            c += scores[k][j] * scores[k][i];
                        }
                        c /= rows - 1;
                        cor[i][j] = c;
                        cor[j][i] = c;
                    }
                }
                return cor;
            };

            exports.zScores = function zScores(matrix, means, standardDeviations) {
                means = means || exports.mean(matrix);
                if (typeof standardDeviations === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
                return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
            };

            exports.center = function center(matrix, means, inPlace) {
                means = means || exports.mean(matrix);
                var result = matrix,
                    l = matrix.length,
                    i,
                    j,
                    jj;

                if (!inPlace) {
                    result = new Array(l);
                    for (i = 0; i < l; i++) {
                        result[i] = new Array(matrix[i].length);
                    }
                }

                for (i = 0; i < l; i++) {
                    var row = result[i];
                    for (j = 0, jj = row.length; j < jj; j++) {
                        row[j] = matrix[i][j] - means[j];
                    }
                }
                return result;
            };

            exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
                if (typeof standardDeviations === 'undefined') standardDeviations = exports.standardDeviation(matrix);
                var result = matrix,
                    l = matrix.length,
                    i,
                    j,
                    jj;

                if (!inPlace) {
                    result = new Array(l);
                    for (i = 0; i < l; i++) {
                        result[i] = new Array(matrix[i].length);
                    }
                }

                for (i = 0; i < l; i++) {
                    var resultRow = result[i];
                    var sourceRow = matrix[i];
                    for (j = 0, jj = resultRow.length; j < jj; j++) {
                        if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
                            resultRow[j] = sourceRow[j] / standardDeviations[j];
                        }
                    }
                }
                return result;
            };

            exports.weightedVariance = function weightedVariance(matrix, weights) {
                var means = exports.mean(matrix);
                var rows = matrix.length;
                if (rows === 0) return [];
                var cols = matrix[0].length;
                var vari = new Array(cols);

                for (var j = 0; j < cols; j++) {
                    var sum = 0;
                    var a = 0,
                        b = 0;

                    for (var i = 0; i < rows; i++) {
                        var z = matrix[i][j] - means[j];
                        var w = weights[i];

                        sum += w * (z * z);
                        b += w;
                        a += w * w;
                    }

                    vari[j] = sum * (b / (b * b - a));
                }

                return vari;
            };

            exports.weightedMean = function weightedMean(matrix, weights, dimension) {
                if (typeof dimension === 'undefined') {
                    dimension = 0;
                }
                var rows = matrix.length;
                if (rows === 0) return [];
                var cols = matrix[0].length,
                    means,
                    i,
                    ii,
                    j,
                    w,
                    row;

                if (dimension === 0) {
                    means = new Array(cols);
                    for (i = 0; i < cols; i++) {
                        means[i] = 0;
                    }
                    for (i = 0; i < rows; i++) {
                        row = matrix[i];
                        w = weights[i];
                        for (j = 0; j < cols; j++) {
                            means[j] += row[j] * w;
                        }
                    }
                } else if (dimension === 1) {
                    means = new Array(rows);
                    for (i = 0; i < rows; i++) {
                        means[i] = 0;
                    }
                    for (j = 0; j < rows; j++) {
                        row = matrix[j];
                        w = weights[j];
                        for (i = 0; i < cols; i++) {
                            means[j] += row[i] * w;
                        }
                    }
                } else {
                    throw new Error('Invalid dimension');
                }

                var weightSum = arrayStat.sum(weights);
                if (weightSum !== 0) {
                    for (i = 0, ii = means.length; i < ii; i++) {
                        means[i] /= weightSum;
                    }
                }
                return means;
            };

            exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
                dimension = dimension || 0;
                means = means || exports.weightedMean(matrix, weights, dimension);
                var s1 = 0,
                    s2 = 0;
                for (var i = 0, ii = weights.length; i < ii; i++) {
                    s1 += weights[i];
                    s2 += weights[i] * weights[i];
                }
                var factor = s1 / (s1 * s1 - s2);
                return exports.weightedScatter(matrix, weights, means, factor, dimension);
            };

            exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
                dimension = dimension || 0;
                means = means || exports.weightedMean(matrix, weights, dimension);
                if (typeof factor === 'undefined') {
                    factor = 1;
                }
                var rows = matrix.length;
                if (rows === 0) {
                    return [[]];
                }
                var cols = matrix[0].length,
                    cov,
                    i,
                    j,
                    k,
                    s;

                if (dimension === 0) {
                    cov = new Array(cols);
                    for (i = 0; i < cols; i++) {
                        cov[i] = new Array(cols);
                    }
                    for (i = 0; i < cols; i++) {
                        for (j = i; j < cols; j++) {
                            s = 0;
                            for (k = 0; k < rows; k++) {
                                s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                            }
                            cov[i][j] = s * factor;
                            cov[j][i] = s * factor;
                        }
                    }
                } else if (dimension === 1) {
                    cov = new Array(rows);
                    for (i = 0; i < rows; i++) {
                        cov[i] = new Array(rows);
                    }
                    for (i = 0; i < rows; i++) {
                        for (j = i; j < rows; j++) {
                            s = 0;
                            for (k = 0; k < cols; k++) {
                                s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                            }
                            cov[i][j] = s * factor;
                            cov[j][i] = s * factor;
                        }
                    }
                } else {
                    throw new Error('Invalid dimension');
                }

                return cov;
            };

            /***/ }),
        /* 6 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            /**
             * nbDecimalsDelta : default depends nucleus H, F: 2 otherwise 1
             * nbDecimalsJ : default depends nucleus H, F: 1, otherwise 0
             * ascending : true / false
             * format : default "AIMJ" or when 2D data is collected the default format may be "IMJA"
             * deltaSeparator : ', '
             * detailSeparator : ', '
             */

            var joinCoupling = __webpack_require__(2).joinCoupling;
            var globalOptions = {
                h: {
                    nucleus: '1H',
                    nbDecimalDelta: 2,
                    nbDecimalJ: 1,
                    observedFrequency: 400
                },
                c: {
                    nucleus: '13C',
                    nbDecimalDelta: 1,
                    nbDecimalJ: 1,
                    observedFrequency: 100
                },
                f: {
                    nucleus: '19F',
                    nbDecimalDelta: 2,
                    nbDecimalJ: 1,
                    observedFrequency: 400
                }
            };

            function toAcs(ranges) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var nucleus = (options.nucleus || '1H').toLowerCase().replace(/[0-9]/g, '');
                var defaultOptions = globalOptions[nucleus];
                options = Object.assign({}, defaultOptions, { ascending: false, format: 'IMJA' }, options);

                ranges = ranges.clone();
                if (options.ascending === true) {
                    ranges.sort(function (a, b) {
                        var fromA = Math.min(a.from, a.to);
                        var fromB = Math.min(b.from, b.to);
                        return fromA - fromB;
                    });
                }
                var acsString = formatAcs(ranges, options);

                if (acsString.length > 0) acsString += '.';

                return acsString;
            }

            function formatAcs(ranges, options) {
                var acs = spectroInformation(options);
                if (acs.length === 0) acs = 'δ ';
                var acsRanges = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = ranges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var range = _step.value;

                        pushDelta(range, acsRanges, options);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (acsRanges.length > 0) {
                    return acs + acsRanges.join(', ');
                } else {
                    return '';
                }
            }

            function spectroInformation(options) {
                var parenthesis = [];
                var strings = formatNucleus(options.nucleus) + ' NMR';
                if (options.solvent) {
                    parenthesis.push(formatMF(options.solvent));
                }
                if (options.frequencyObserved) {
                    parenthesis.push((options.frequencyObserved * 1).toFixed(0) + ' MHz');
                }
                if (parenthesis.length > 0) {
                    strings += ' (' + parenthesis.join(', ') + '): δ ';
                } else {
                    strings += ': δ ';
                }
                return strings;
            }

            function pushDelta(range, acsRanges, options) {
                var strings = '';
                var parenthesis = [];
                var fromTo = [range.from, range.to];
                if (Array.isArray(range.signal) && range.signal.length > 0) {
                    var signals = range.signal;
                    if (signals.length > 1) {
                        if (options.ascending === true) {
                            signals.sort(function (a, b) {
                                return a.delta - b.delta;
                            });
                        }
                        strings += Math.min.apply(Math, fromTo).toFixed(options.nbDecimalDelta) + '-' + Math.max.apply(Math, fromTo).toFixed(options.nbDecimalDelta);
                        strings += ' (' + getIntegral(range, options);
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = signals[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var signal = _step2.value;

                                parenthesis = [];
                                if (signal.delta !== undefined) {
                                    strings = appendSeparator(strings);
                                    strings += signal.delta.toFixed(options.nbDecimalDelta);
                                }
                                switchFormat({}, signal, parenthesis, options);
                                if (parenthesis.length > 0) strings += ' (' + parenthesis.join(', ') + ')';
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        strings += ')';
                    } else {
                        parenthesis = [];
                        if (signals[0].delta !== undefined) {
                            strings += signals[0].delta.toFixed(options.nbDecimalDelta);
                            switchFormat(range, signals[0], parenthesis, options);
                            if (parenthesis.length > 0) strings += ' (' + parenthesis.join(', ') + ')';
                        } else {
                            strings += Math.min.apply(Math, fromTo).toFixed(options.nbDecimalDelta) + '-' + Math.max.apply(Math, fromTo).toFixed(options.nbDecimalDelta);
                            switchFormat(range, signals[0], parenthesis, options);
                            if (parenthesis.length > 0) strings += ' (' + parenthesis + ')';
                        }
                    }
                } else {
                    strings += Math.min.apply(Math, fromTo).toFixed(options.nbDecimalDelta) + '-' + Math.max.apply(Math, fromTo).toFixed(options.nbDecimalDelta);
                    switchFormat(range, [], parenthesis, options);
                    if (parenthesis.length > 0) strings += ' (' + parenthesis.join(', ') + ')';
                }
                acsRanges.push(strings);
            }

            function getIntegral(range, options) {
                var integral = '';
                if (range.pubIntegral) {
                    integral = range.pubIntegral;
                } else if (range.integral) {
                    integral = range.integral.toFixed(0) + options.nucleus[options.nucleus.length - 1];
                }
                return integral;
            }

            function pushIntegral(range, parenthesis, options) {
                var integral = getIntegral(range, options);
                if (integral.length > 0) parenthesis.push(integral);
            }

            function pushMultiplicityFromSignal(signal, parenthesis) {
                var multiplicity = signal.multiplicity || joinCoupling(signal, 0.05);
                if (multiplicity.length > 0) parenthesis.push(multiplicity);
            }

            function switchFormat(range, signal, parenthesis, options) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = options.format[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var char = _step3.value;

                        switch (char.toUpperCase()) {
                            case 'I':
                                pushIntegral(range, parenthesis, options);
                                break;
                            case 'M':
                                pushMultiplicityFromSignal(signal, parenthesis);
                                break;
                            case 'A':
                                pushAssignment(signal, parenthesis);
                                break;
                            case 'J':
                                pushCoupling(signal, parenthesis, options);
                                break;
                            default:
                                throw new Error('Unknow format letter: ' + char);
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }

            function formatMF(mf) {
                return mf.replace(/([0-9]+)/g, '<sub>$1</sub>');
            }

            function formatNucleus(nucleus) {
                return nucleus.replace(/([0-9]+)/g, '<sup>$1</sup>');
            }

            function appendSeparator(strings) {
                if (strings.length > 0 && !strings.match(/ $/) && !strings.match(/\($/)) {
                    strings += ', ';
                }
                return strings;
            }

            function formatAssignment(assignment) {
                assignment = assignment.replace(/([0-9]+)/g, '<sub>$1</sub>');
                assignment = assignment.replace(/"([^"]*)"/g, '<i>$1</i>');
                return assignment;
            }

            function pushCoupling(signal, parenthesis, options) {
                if (Array.isArray(signal.j) && signal.j.length > 0) {
                    signal.j.sort(function (a, b) {
                        return b.coupling - a.coupling;
                    });

                    var values = [];
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = signal.j[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var j = _step4.value;

                            if (j.coupling !== undefined) {
                                values.push(j.coupling.toFixed(options.nbDecimalJ));
                            }
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    if (values.length > 0) parenthesis.push('<i>J</i> = ' + values.join(', ') + ' Hz');
                }
            }

            function pushAssignment(signal, parenthesis) {
                if (signal.pubAssignment) {
                    parenthesis.push(formatAssignment(signal.pubAssignment));
                } else if (signal.assignment) {
                    parenthesis.push(formatAssignment(signal.assignment));
                }
            }
            module.exports = toAcs;

            /***/ }),
        /* 7 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            module.exports.GUI = __webpack_require__(0);
            module.exports.Ranges = __webpack_require__(3);

            /***/ }),
        /* 8 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            /**
             * This function converts an array of peaks [{x, y, width}] in a vector equally x,y vector from a given window
             * TODO: This function is very general and should be placed somewhere else
             * @param {Array} peaks - List of the peaks
             * @param {object} options - it has some options to
             * @param {number} [options.from] - one limit of given window
             * @param {number} [options.to] - one limit of given window
             * @param {string} [options.fnName] - function name to generate the signals form
             * @param {number} [options.nWidth] - width factor of signal form
             * @param {number} [options.nbPoints] - number of points that the vector will have
             * @return {{x: Array, y: Array}}
             */

            function peak2Vector(peaks) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var _options$from = options.from,
                    from = _options$from === undefined ? null : _options$from,
                    _options$to = options.to,
                    to = _options$to === undefined ? null : _options$to,
                    _options$nbPoints = options.nbPoints,
                    nbPoints = _options$nbPoints === undefined ? 1024 : _options$nbPoints,
                    _options$functionName = options.functionName,
                    functionName = _options$functionName === undefined ? '' : _options$functionName,
                    _options$nWidth = options.nWidth,
                    nWidth = _options$nWidth === undefined ? 4 : _options$nWidth;


                var factor;
                if (from === null) {
                    from = Number.MAX_VALUE;
                    for (var i = 0; i < peaks.length; i++) {
                        factor = peaks[i].x - peaks[i].width * nWidth;
                        if (factor < from) {
                            from = factor;
                        }
                    }
                }
                if (to === null) {
                    to = Number.MIN_VALUE;
                    for (var _i = 0; _i < peaks.length; _i++) {
                        factor = peaks[_i].x + peaks[_i].width * nWidth;
                        if (factor > to) {
                            to = factor;
                        }
                    }
                }

                var x = new Array(nbPoints);
                var y = new Array(nbPoints);
                var dx = (to - from) / (nbPoints - 1);
                for (var _i2 = 0; _i2 < nbPoints; _i2++) {
                    x[_i2] = from + _i2 * dx;
                    y[_i2] = 0;
                }

                var intensity = peaks[0].y ? 'y' : 'intensity';

                var functionToUse;
                switch (functionName.toLowerCase()) {
                    case 'lorentzian':
                        functionToUse = lorentzian;
                        break;
                    default:
                        functionToUse = gaussian;
                }

                for (var _i3 = 0; _i3 < peaks.length; _i3++) {
                    var peak = peaks[_i3];
                    if (peak.x > from && peak.x < to) {
                        var index = Math.round((peak.x - from) / dx);
                        var w = Math.round(peak.width * nWidth / dx);
                        for (var j = index - w; j < index + w; j++) {
                            if (j >= 0 && j < nbPoints) {
                                y[j] += functionToUse(peak[intensity], x[j], peak.width, peak.x);
                            }
                        }
                    }
                }

                function lorentzian(intensity, x, width, mean) {
                    var factor = intensity * Math.pow(width, 2) / 4;
                    return factor / (Math.pow(mean - x, 2) + Math.pow(width / 2, 2));
                }

                function gaussian(intensity, x, width, mean) {
                    return intensity * Math.exp(-0.5 * Math.pow((mean - x) / (width / 2), 2));
                }

                return { x: x, y: y };
            }

            module.exports = peak2Vector;

            /***/ })
        /******/ ]);
});