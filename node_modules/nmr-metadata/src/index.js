'use strict';

const jcampconverter = require('jcampconverter');
const SD = require('spectra-data');

const getSpectrumType = require('./getSpectrumType');

/**
 * Object containing parsed metadata
 * @name NMRMetadata
 * @typedef {object} NMRMetadata
 * @property {number} dimension
 * @property {number[]} nucleus
 * @property {string} title
 * @property {string} solvent
 * @property {string} pulse
 * @property {string} experiment
 * @property {number} temperature - Temperature in Kelvin
 * @property {number} frequency
 * @property {string} date - Date in ISO string format
 * @property {object} ranges
 */

const defaultOptions = {
    computeRanges: false
};

const rangesOptions = {
    nH: 100,
    realTop: false,
    thresholdFactor: 0.85,
    clean: true,
    compile: true,
    format: 'new',
    integralFn: 1,
    optimize: true
};

/**
 * Returns a metadata object from JCAMP
 * @param {string} jcampData
 * @param {object} [options]
 * @param {boolean} [options.computeRanges=false]
 * @param {number} [options.nH=100] - number of hydrogens to take into account for ranges computation
 * @return {NMRMetadata} metadata
 */
exports.parseJcamp = function (jcampData, options) {
    options = Object.assign({}, defaultOptions, options);
    options.ranges = Object.assign({}, rangesOptions, options.ranges);

    const jcampString = jcampData.toString();
    const jcamp = jcampconverter.convert(jcampString, {
        keepRecordsRegExp: /.*/,
        withoutXY: true
    });

    const metadata = {
        dimension: jcamp.twoD ? 2 : 1,
        nucleus: [],
        isFid: false,
        isFt: false
    };

    const info = jcamp.info;
    maybeAdd(metadata, 'title', info['TITLE']);
    maybeAdd(metadata, 'solvent', info['.SOLVENTNAME']);
    maybeAdd(metadata, 'pulse', info['.PULSESEQUENCE'] || info['.PULPROG'] || info['$PULPROG']);
    maybeAdd(metadata, 'experiment', getSpectrumType(metadata.pulse));
    maybeAdd(metadata, 'temperature', parseFloat(info['$TE'] || info['.TE']));
    maybeAdd(metadata, 'frequency', parseFloat(info['.OBSERVEFREQUENCY']));
    maybeAdd(metadata, 'type', info['DATATYPE']);

    if(metadata.type){
        if(metadata.type.toUpperCase().indexOf('FID') >= 0)
            metadata.isFid = true;
        else if(metadata.type.toUpperCase().indexOf('SPECTRUM') >= 0 ){
            metadata.isFt = true;
        }
    }

    if (metadata.dimension === 1) {
        const nucleus = info['.OBSERVENUCLEUS'];
        if (nucleus) {
            metadata.nucleus = [nucleus.replace(/[^A-Za-z0-9]/g,'')];
        }
    } else {
        const nucleus = info['.NUCLEUS'];
        if (nucleus) {
            metadata.nucleus = nucleus.split(',').map(nuc => nuc.trim());
        }
    }
    if (metadata.nucleus.length === 0) {
        metadata.nucleus = exports.getNucleusFrom2DExperiment(metadata.experiment);
    }

    if (info['$DATE']) {
        metadata.date = (new Date(info['$DATE'] * 1000)).toISOString();
    }

    if (options.computeRanges && metadata.isFt && metadata.dimension === 1 && metadata.nucleus[0] === '1H') {
        const spectrum = SD.NMR.fromJcamp(jcampString);
        const ranges = spectrum.nmrPeakDetection(options.ranges);
        ranges.forEach(function (range) {
            delete range._highlight;
            delete range.signalID;
            range.signal.forEach(function (signal) {
                delete signal.peak;
            });
        });
        metadata.range = ranges;
    }

    return metadata;
};

/**
 * Returns a list of nuclei based on an experiment string
 * @param {string} experiment
 * @return {string[]}
 */
exports.getNucleusFrom2DExperiment = function (experiment) {
    if (typeof experiment !== 'string') {
        return [];
    }
    experiment = experiment.toLowerCase();
    if (experiment.includes('jres')) {
        return ['1H'];
    }
    if (experiment.includes('hmbc') || experiment.includes('hsqc')) {
        return ['1H', '13C'];
    }
    return ['1H', '1H'];
};

exports.getSpectrumType = getSpectrumType;

function maybeAdd(obj, name, value) {
    if (value) {
        obj[name] = value;
    }
}
