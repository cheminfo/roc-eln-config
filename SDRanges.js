module.exports = {
    toIndex: function(ranges, options) {
        options = options || {};
        var index = [];

        if(options.joinCouplings) {
            ranges.forEach(function(range) {
                range.signal.forEach(function(signal) {
                    signal.multiplicity = joinCoupling(signal, options.tolerance);
                });
            });
        }

        for(var i=0; i<ranges.length; i++) {
            var range = ranges[i];
            if (Array.isArray(range.signal) && range.signal.length > 0) {
                let l = range.signal.length;
                var delta = new Array(l);
                for (let i = 0; i < l; i++) {
                    delta[i] = range.signal[i].delta;
                }
                index.push({
                    multiplicity: (l > 1) ? 'm' : (range.signal[0].multiplicity ||
                    utils.joinCoupling(range.signal[0], options.tolerance)),
                    delta: arithmeticMean(delta) || (range.to + range.from) * 0.5,
                    integral: range.integral
                });
            } else {
                index.push({
                    delta: (range.to + range.from) * 0.5,
                    multiplicity: 'm'
                });
            }
        }
    }
};

function joinCoupling(signal, tolerance) {
    if(tolerance === undefined) tolerance = 0.05;
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
                let jTemp = {
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
        let jTemp = {
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
}

function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};
