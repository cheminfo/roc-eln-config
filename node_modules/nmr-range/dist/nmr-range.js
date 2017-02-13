(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nmrRange"] = factory();
	else
		root["nmrRange"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * This library formats a set of nmr1D signals to the ACS format.
	 * Created by acastillo on 3/11/15. p
	 */
	var old = __webpack_require__(1);

	var acsString="";
	var parenthesis="";
	var spectro="";
	var rangeForMultiplet=false;

	module.exports = __webpack_require__(2);

	module.exports.update = function(ranges){
	    for (var i=0; i<ranges.length; i++){
	        var range = ranges[i];
	        for (var j=0; j<range.signal.length; j++){
	            var signal = range.signal[j];
	            if (signal.j && ! signal.multiplicity) {
	                signal.multiplicity = "";
	                for (var k=0; k<signal.j.length;k++){
	                    signal.multiplicity+=signal.j[k].multiplicity;
	                }
	            }
	        }
	    }

	    return ranges;
	}

	module.exports.updateIntegrals = function(signals, options) {
	    var  factor = options.factor || 1 ;
	    var i;
	    if(options.sum) {
	        var nH = options.sum || 1;
	        var sumObserved=0;
	        for(i = 0; i < signals.length; i++) {
	            sumObserved += Math.round(signals[i].integral);
	        }
	        factor = nH/sumObserved;
	    }
	    for(i = 0; i < signals.length; i++) {
	        signals[i].integral *= factor;
	    }

	    return signals;
	}

	module.exports.nmrJ = function(Js, options){
	    var Jstring = "";
	    var opt = Object.assign({},{separator:", ", nbDecimal:2}, options);
	    var j;
	    for(var i=0;i<Js.length;i++){
	        j = Js[i];
	        if (j.length>11) j+=opt.separator;
	        Jstring+=j.multiplicity+" "+j.coupling.toFixed(opt.nbDecimal);
	    }
	    return Jstring;
	}
	/**
	 * This function converts an array of peaks [{x, y, width}] in a vector equally x,y vector
	 * TODO This function is very general and should be placed somewhere else
	 * @param peaks
	 * @param opt
	 * @returns {{x: Array, y: Array}}
	 */
	module.exports.peak2Vector=function(peaks, opt){
	    var options = opt||{};
	    var from = options.from;
	    var to = options.to;
	    var nbPoints = options.nbPoints||16*1024;
	    var fnName = options.fnName||"gaussian";
	    var nWidth = options.nWidth || 4;

	    if(!from){
	        from = Number.MAX_VALUE;
	        for(var i=0;i<peaks.length;i++){
	            if(peaks[i].x-peaks[i].width*nWidth<from){
	                from = peaks[i].x-peaks[i].width*nWidth;
	            }
	        }
	    }

	    if(!to){
	        to = Number.MIN_VALUE;
	        for(var i=0;i<peaks.length;i++){
	            if(peaks[i].x+peaks[i].width*nWidth>to){
	                to = peaks[i].x+peaks[i].width*nWidth;
	            }
	        }
	    }


	    var x = new Array(nbPoints);
	    var y = new Array(nbPoints);
	    var dx = (to-from)/(nbPoints-1);
	    for(var i=0;i<nbPoints;i++){
	        x[i] = from+i*dx;
	        y[i] = 0;
	    }

	    var intensity = "intensity";
	    if(peaks[0].y){
	        intensity="y";
	    }

	    for(var i=0;i<peaks.length;i++){
	        var peak = peaks[i];
	        if(peak.x>from && peak.x<to){
	            var index = Math.round((peak.x-from)/dx);
	            var w = Math.round(peak.width*nWidth/dx);
	            if(fnName=="gaussian"){
	                for(var j=index-w;j<index+w;j++){
	                    if(j>=0&&j<nbPoints){
	                        y[j]+=peak[intensity]*Math.exp(-0.5*Math.pow((peak.x-x[j])/(peak.width/2),2));
	                    }
	                }
	            }else{
	                var factor = peak[intensity]*Math.pow(peak.width,2)/4;
	                for(var j=index-w;j<index+w;j++){
	                    if(j>=0&&j<nbPoints){
	                        y[j]+=factor/(Math.pow(peak.x-x[j],2)+Math.pow(peak.width/2,2));

	                    }
	                }
	            }

	        }
	    }

	    return {x:x,y:y};
	}

	module.exports.range2Vector=function(ranges, opt){
	    return module.exports.peak2Vector(module.exports.range2Peaks(ranges), opt);
	}

	module.exports.range2Peaks = function(ranges){
	    var peaks = [];
	    for(var i=0;i<ranges.length;i++){
	        var range = ranges[i];
	        for(var j=0;j<range.signal.length;j++){
	            peaks=peaks.concat(range.signal[j].peak);
	        }
	    }
	    return peaks;
	}

	module.exports.toACS = function(spectrumIn, options){

	    var spectrum = JSON.parse(JSON.stringify(spectrumIn));

	    if(spectrum[0].delta1){//Old signals format
	        return old.toACS(spectrum, options);
	    }

	    spectrum = module.exports.update(spectrum);

	    acsString="";
	    parenthesis="";
	    spectro="";
	    var solvent = null;
	    if(options&&options.solvent)
	        solvent = options.solvent;
	    if(options&&options.rangeForMultiplet!=undefined)
	        rangeForMultiplet = options.rangeForMultiplet;

	    if(options&&options.ascending){
	        spectrum.sort(function(a,b){
	            return b.from- a.from
	        });
	    }
	    else{
	        spectrum.sort(function(a,b){
	            return a.from- b.from
	        });
	    }

	    spectrum.type="NMR SPEC";
	    if (options&&options.nucleus=="1H") {
	        formatAcs_default(spectrum, false, 2, 1, solvent, options);
	    }
	    if (options&&options.nucleus=="13C") {
	        formatAcs_default(spectrum, false, 1, 0, solvent,options);
	    }

	    if (acsString.length>0) acsString+=".";

	    return acsString;
	}

	module.exports.toNMRSignal = function(acsString){
	    //TODO Create the function that reconstructs the signals from the ACS string
	    return null;
	}

	/*function formatAcs_default_IR(spectra, ascending, decimalValue, smw) {
	 appendSeparator();
	 appendSpectroInformation(spectra);
	 if (spectra["peakLabels"]) {
	 var numberPeakLabels=spectra["peakLabels"].length;
	 var minIntensity= 9999999;
	 var maxIntensity=-9999999;
	 for (var i=0; i<numberPeakLabels; i++) {
	 if (spectra["peakLabels"][i].intensity<minIntensity) minIntensity=spectra["peakLabels"][i].intensity;
	 if (spectra["peakLabels"][i].intensity>maxIntensity) maxIntensity=spectra["peakLabels"][i].intensity;
	 }
	 for (var i=0; i<numberPeakLabels; i++) {
	 if (ascending) {
	 var peakLabel=spectra["peakLabels"][i];
	 } else {
	 var peakLabel=spectra["peakLabels"][numberPeakLabels-i-1];
	 }
	 if (peakLabel) {
	 appendSeparator();
	 appendValue(peakLabel,decimalValue);
	 if (smw) { // we need to add small / medium / strong
	 if (peakLabel.intensity<((maxIntensity-minIntensity)/3+minIntensity)) acsString+=" (s)";
	 else if (peakLabel.intensity>(maxIntensity-(maxIntensity-minIntensity)/3)) acsString+=" (w)";
	 else acsString+=" (m)";
	 }
	 }
	 }
	 }
	 }*/

	function formatAcs_default(spectra, ascending, decimalValue, decimalJ, solvent, options) {
	    appendSeparator();
	    appendSpectroInformation(spectra, solvent, options);
	    var numberSmartPeakLabels=spectra.length;
	    for (var i=0; i<numberSmartPeakLabels; i++) {
	        if (ascending) {
	            var signal=spectra[i];
	        } else {
	            var signal=spectra[numberSmartPeakLabels-i-1];
	        }
	        if (signal) {
	            appendSeparator();
	            appendDelta(signal,decimalValue);
	            appendParenthesis(signal,decimalJ);
	        }
	    }
	}

	function appendSpectroInformation(spectrum, solvent, options) {
	    if (spectrum.type=="NMR SPEC") {
	        if (options.nucleus) {
	            acsString+=formatNucleus(options.nucleus);
	        }
	        acsString+=" NMR";
	        if ((solvent) || (options.observe)) {
	            acsString+=" (";
	            if (options.observe) {
	                acsString+=(options.observe*1).toFixed(0)+" MHz";
	                if (solvent) acsString+=", ";
	            }
	            if (solvent) {
	                acsString+=formatMF(solvent);
	            }
	            acsString+=")";
	        }
	        acsString+=" δ ";
	    } else if (spectrum.type=="IR") {
	        acsString+=" IR ";
	    } else if (spectrum.type=="MASS") {
	        acsString+=" MASS ";
	    }
	}

	function appendDelta(line, nbDecimal) {
	    var startX = 0,stopX=0,delta1=0, asymmetric;
	    if(line.from){
	        if((typeof line.from)=="string"){
	            startX=parseFloat(line.from);
	        }
	        else
	            startX=line.from;
	    }
	    if(line.to){
	        if((typeof line.to)=="string"){
	            stopX=parseFloat(line.to);
	        }
	        else
	            stopX=line.to;
	    }
	    if(line.signal[0].delta){
	        if((typeof line.signal[0].delta)=="string"){
	            delta1=parseFloat(line.signal[0].delta);
	        }
	        else
	            delta1=line.signal[0].delta;
	    }
	    else{
	        asymmetric = true;
	    }
	    //console.log("Range2: "+rangeForMultiplet+" "+line.multiplicity);
	    if (asymmetric===true||(line.signal[0].multiplicity=="m"&&rangeForMultiplet===true)) {//Is it massive??
	        if (line.from&&line.to) {
	            if (startX<stopX) {
	                acsString+=startX.toFixed(nbDecimal)+"-"+stopX.toFixed(nbDecimal);
	            } else {
	                acsString+=stopX.toFixed(nbDecimal)+"-"+startX.toFixed(nbDecimal);
	            }
	        } else {
	            if(line.signal[0].delta)
	                acsString+="?";
	        }
	    }
	    else{
	        if(line.signal[0].delta)
	            acsString+=delta1.toFixed(nbDecimal);
	        else{
	            if(line.from&&line.to){
	                acsString+=((startX+stopX)/2).toFixed(nbDecimal);
	            }
	        }
	    }
	}

	function appendValue(line, nbDecimal) {
	    if (line.xPosition) {
	        acsString+=line.xPosition.toFixed(nbDecimal);
	    }
	}

	function appendParenthesis(line, nbDecimal) {
	    //console.log("appendParenthesis1");
	    // need to add assignment - coupling - integration
	    parenthesis="";
	    appendMultiplicity(line);
	    appendIntegration(line);
	    appendCoupling(line,nbDecimal);
	    appendAssignment(line);


	    if (parenthesis.length>0) {
	        acsString+=" ("+parenthesis+")";
	    }
	    //console.log("appendParenthesis2");
	}

	function appendIntegration(line) {
	    if (line.pubIntegration) {
	        appendParenthesisSeparator();
	        parenthesis+=line.pubIntegration;
	    } else if (line.integral) {
	        appendParenthesisSeparator();
	        parenthesis+=line.integral.toFixed(0)+" H";
	    }
	}

	function appendAssignment(line) {
	    if (line.signal[0].pubAssignment) {
	        appendParenthesisSeparator();
	        parenthesis+=formatAssignment(line.signal[0].pubAssignment);
	    }
	    else{
	        if (line.signal[0].assignment) {
	            appendParenthesisSeparator();
	            parenthesis+=formatAssignment(line.signal[0].assignment);
	        }
	    }
	}

	function appendMultiplicity(line) {
	    if (line.signal[0].pubMultiplicity) {
	        appendParenthesisSeparator();
	        parenthesis+=line.pubMultiplicity;
	    } else if (line.signal[0].multiplicity) {
	        appendParenthesisSeparator();
	        parenthesis+=line.signal[0].multiplicity;
	    }
	}

	function appendCoupling(line, nbDecimal) {
	    if ("sm".indexOf(line.signal[0].multiplicity) < 0
	            && line.signal[0].j && line.signal[0].j.length > 0) {
	        var Js = line.signal[0].j;
	        var j="<i>J</i> = ";
	        for (var i=0; i<Js.length; i++) {
	            var coupling=Js[i].coupling || 0;
	            if (j.length>11) j+=", ";
	            j+=coupling.toFixed(nbDecimal);
	        }
	        appendParenthesisSeparator();
	        parenthesis+=j+" Hz";
	    }
	}

	function formatAssignment(assignment) {
	    assignment=assignment.replace(/([0-9])/g,"<sub>$1</sub>");
	    assignment=assignment.replace(/\"([^\"]*)\"/g,"<i>$1</i>");
	    return assignment;
	}

	function formatMF(mf) {
	    mf=mf.replace(/([0-9])/g,"<sub>$1</sub>");
	    return mf;
	}

	function formatNucleus(nucleus) {
	    nucleus=nucleus.replace(/([0-9])/g,"<sup>$1</sup>");
	    return nucleus;
	}

	function appendSeparator() {
	    if ((acsString.length>0) && (! acsString.match(/ $/))) {
	        acsString+=", ";
	    }
	}

	function appendParenthesisSeparator() {
	    if ((parenthesis.length>0) && (! parenthesis.match(", $"))) parenthesis+=", ";
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * This library formats a set of nmr1D signals to the ACS format.
	 * Created by acastillo on 3/11/15. p
	 */

	var acsString="";
	var parenthesis="";
	var spectro="";
	var rangeForMultiplet=false;

	module.exports.toACS = function(spectrum, options){
	    acsString="";
	    parenthesis="";
	    spectro="";
	    var solvent = null;
	    if(options&&options.solvent)
	        solvent = options.solvent;
	    if(options&&options.rangeForMultiplet!=undefined)
	        rangeForMultiplet = options.rangeForMultiplet;

	    if(options&&options.ascending){
	        spectrum.sort(function(a,b){
	            return b.delta1- a.delta1
	        });
	    }
	    else{
	        spectrum.sort(function(a,b){
	            return a.delta1- b.delta1
	        });
	    }

	    //console.log("Range1: "+options.rangeForMultiplet);

	    spectrum.type="NMR SPEC";
	    if (spectrum[0]["nucleus"]=="1H") {
	        formatAcs_default(spectrum, false, 2, 1, solvent);
	    } else if (spectrum[0]["nucleus"]=="13C") {
	        formatAcs_default(spectrum, false, 1, 0, solvent);
	    }

	    if (acsString.length>0) acsString+=".";

	    return acsString;
	}

	function formatAcs_default(spectra, ascending, decimalValue, decimalJ, solvent) {
	    appendSeparator();
	    appendSpectroInformation(spectra, solvent);
	    var numberSmartPeakLabels=spectra.length;
	    for (var i=0; i<numberSmartPeakLabels; i++) {
	        if (ascending) {
	            var signal=spectra[i];
	        } else {
	            var signal=spectra[numberSmartPeakLabels-i-1];
	        }
	        if (signal) {
	            appendSeparator();
	            appendDelta(signal,decimalValue);
	            appendParenthesis(signal,decimalJ);
	        }
	    }
	}

	function appendSpectroInformation(spectrum, solvent) {
	    if (spectrum.type=="NMR SPEC") {
	        if (spectrum[0].nucleus) {
	            acsString+=formatNucleus(spectrum[0].nucleus);
	        }
	        acsString+=" NMR";
	        if ((solvent) || (spectrum[0].observe)) {
	            acsString+=" (";
	            if (spectrum[0].observe) {
	                acsString+=(spectrum[0].observe*1).toFixed(0)+" MHz";
	                if (solvent) acsString+=", ";
	            }
	            if (solvent) {
	                acsString+=formatMF(solvent);
	            }
	            acsString+=")";
	        }
	        acsString+=" δ ";
	    } else if (spectrum.type=="IR") {
	        acsString+=" IR ";
	    } else if (spectrum.type=="MASS") {
	        acsString+=" MASS ";
	    }
	}

	function appendDelta(line, nbDecimal) {
	    //console.log(line);
	    var startX = 0,stopX=0,delta1=0;
	    if(line.integralData.from) {
	        if ((typeof line.integralData.from) == "string") {
	            startX = parseFloat(line.integralData.from);
	        }
	        else
	            startX = line.integralData.from;
	    }
	    if(line.integralData.to){
	        if((typeof line.integralData.to)=="string"){
	            stopX=parseFloat(line.integralData.to);
	        }
	        else
	            stopX=line.integralData.to;
	    }
	    if(line.delta1){
	        if((typeof line.delta1)=="string"){
	            delta1=parseFloat(line.delta1);
	        }
	        else
	            delta1=line.delta1;

	    }
	    if (line.asymmetric===true||(line.multiplicity=="m"&&rangeForMultiplet===true)) {//Is it massive??
	        if (line.integralData.from&&line.integralData.to) {
	            if (startX<stopX) {
	                acsString+=startX.toFixed(nbDecimal)+"-"+stopX.toFixed(nbDecimal);
	            } else {
	                acsString+=stopX.toFixed(nbDecimal)+"-"+sttotoFixed(nbDecimal);
	            }
	        } else {
	            if(line.delta1)
	                acsString+=delta1.toFixed(nbDecimal);
	        }
	    }
	    else{
	        if(line.delta1)
	            acsString+=delta1.toFixed(nbDecimal);
	        else{
	            if(line.integralData.from&&line.integralData.to){
	                acsString+=((startX+stopX)/2).toFixed(nbDecimal);
	            }
	        }
	    }
	}

	function appendValue(line, nbDecimal) {
	    if (line.xPosition) {
	        acsString+=line.xPosition.toFixed(nbDecimal);
	    }
	}

	function appendParenthesis(line, nbDecimal) {
	    // need to add assignment - coupling - integration
	    parenthesis="";
	    appendMultiplicity(line);
	    appendIntegration(line);
	    appendCoupling(line,nbDecimal);
	    appendAssignment(line);


	    if (parenthesis.length>0) {
	        acsString+=" ("+parenthesis+")";
	    }
	}

	function appendIntegration(line) {
	    if (line.pubIntegration) {
	        appendParenthesisSeparator();
	        parenthesis+=line.pubIntegration;
	    } else if (line.integralData) {
	        appendParenthesisSeparator();
	        parenthesis+=line.integralData.value.toFixed(0)+" H";
	    }
	}

	function appendAssignment(line) {
	    if (line.pubAssignment) {
	        appendParenthesisSeparator();
	        parenthesis+=formatAssignment(line.pubAssignment);
	    }
	    else{
	        if (line.assignment) {
	            appendParenthesisSeparator();
	            parenthesis+=formatAssignment(line.assignment);
	        }
	    }
	}

	function appendMultiplicity(line) {
	    if (line.pubMultiplicity) {
	        appendParenthesisSeparator();
	        parenthesis+=line.pubMultiplicity;
	    } else if (line.multiplicity) {
	        appendParenthesisSeparator();
	        parenthesis+=line.multiplicity;
	    }
	}

	function appendCoupling(line, nbDecimal) {
	    if (line.nmrJs) {
	        var j="<i>J</i> = ";
	        for (var i=0; i<line.nmrJs.length; i++) {
	            var coupling=line.nmrJs[i].coupling;
	            if (j.length>11) j+=", ";
	            j+=coupling.toFixed(nbDecimal);
	        }
	        appendParenthesisSeparator();
	        parenthesis+=j+" Hz";
	    }

	}

	function formatAssignment(assignment) {
	    assignment=assignment.replace(/([0-9])/g,"<sub>$1</sub>");
	    assignment=assignment.replace(/\"([^\"]*)\"/g,"<i>$1</i>");
	    return assignment;
	}

	function formatMF(mf) {
	    mf=mf.replace(/([0-9])/g,"<sub>$1</sub>");
	    return mf;
	}

	function formatNucleus(nucleus) {
	    nucleus=nucleus.replace(/([0-9])/g,"<sup>$1</sup>");
	    return nucleus;
	}

	function appendSeparator() {
	    if ((acsString.length>0) && (! acsString.match(/ $/))) {
	        acsString+=", ";
	    }
	}

	function appendParenthesisSeparator() {
	    if ((parenthesis.length>0) && (! parenthesis.match(", $"))) parenthesis+=", ";
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by acastillo on 8/17/16.
	 */
	'use strict';

	//lineWidth in Hz frequency in MHz
	const defaultOptions = {lineWidth:1, frequency: 400};

	module.exports.prediction2Ranges = function(predictions, opt){
	    const options = Object.assign({}, defaultOptions, opt);
	    //1. Collapse all the equivalent predictions
	    const nPredictions = predictions.length;
	    const ids = new Array(nPredictions);
	    var i, j, diaIDs, prediction, width, center, jc;
	    for(i = 0 ; i < nPredictions; i++) {
	        if(!ids[predictions[i].diaIDs[0]]) {
	            ids[predictions[i].diaIDs[0]] = [i]
	        }
	        else{
	            ids[predictions[i].diaIDs[0]].push(i);
	        }
	    }
	    const idsKeys = Object.keys(ids);
	    const result = new Array(idsKeys.length);

	    for(i = 0; i < idsKeys.length; i++) {
	        diaIDs = ids[idsKeys[i]];
	        prediction = predictions[diaIDs[0]];
	        width = 0;
	        jc = prediction.j;
	        if(jc){
	            for(j = 0; j < jc.length; j++) {
	                width+=jc[j].coupling;
	            }
	        }

	        width+= 2*options.lineWidth;//Add 2 times the spectral lineWidth

	        width/=options.frequency;

	        result[i] = {from: prediction.delta-width,
	                    to:prediction.delta+width,
	                    integral:1,
	                    signal:[ predictions[diaIDs[0]] ]};
	        for(j = 1; j < diaIDs.length; j++) {
	            result[i].signal.push(predictions[diaIDs[j]]);
	            result[i].integral++;
	        }
	    }
	    //2. Merge the overlaping ranges
	    for(i  =  0; i < result.length; i++) {
	        result[i]._highlight = result[i].signal[0].diaIDs;
	        center = (result[i].from + result[i].to)/2;
	        width = Math.abs(result[i].from - result[i].to);
	        for(j  = result.length - 1; j > i; j--) {
	            //Does it overlap?
	            if(Math.abs(center - (result[j].from + result[j].to)/2)
	                <= Math.abs(width + Math.abs(result[j].from - result[j].to))/2){
	                result[i].from = Math.min(result[i].from, result[j].from);
	                result[i].to = Math.max(result[i].to, result[j].to);
	                result[i].integral = result[i].integral + result[j].integral;
	                result[i]._highlight.push(result[j].signal[0].diaIDs[0]);
	                result.splice(j,1);
	                j = result.length - 1;
	                center = (result[i].from + result[i].to)/2;
	                width = Math.abs(result[i].from - result[i].to);
	            }
	        }
	    }

	    return result;
	}

/***/ }
/******/ ])
});
;