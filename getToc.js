
exports.getToc = function(doc) {
    var content = doc.$content;
    var general = content.general || {};
    var spectra = content.spectra || {};
    var nmr = spectra.nmr;
    var ir = spectra.ir;
    var mass = spectra.mass;
    var nb1d = 0, nb2d = 0, nb1h = 0, nb13c = 0;
    if(nmr) {
        var has1d = nmr.some(function(nmr) { return nmr.dimension === 1 });
        var has2d = nmr.some(function(nmr) { return nmr.dimension === 2 });
        for(var i=0; i<nmr.length; i++) {
            for(var i=0; i<nmr.length; i++) {
                if (nmr[i].dimension === 1) {
                    nb1d++;
                    if (Array.isArray(nmr[i].nucleus) && typeof nmr[i].nucleus[0] === 'string') {
                        if (nmr[i].nucleus[0].toLowerCase() === '1h') {
                            nb1h++;
                        } else if (nmr[i].nucleus[0].toLowerCase() === '13c') {
                            nb13c++;
                        }
                    }
                } else if (nmr[i].dimension === 2) nb2d++;
            }
        }
    }

    return {
        mf: general.mf,
        mw: general.mw,
        // We don't need the index
        ocl: general.ocl && {
            value: general.ocl.value,
            coordinates: general.ocl.coordinates
        },
        keyword: general.keyword,        
        hasNmr: nmr && nmr.length,
        hasIR: ir && ir.length,
        hasMass: mass && mass.length,
        has1d: has1d,
        has2d: has2d,
        nb1d: nb1d,
        nb2d: nb2d,
        nb1h: nb1h,
        nb13c: nb13c,
        modificationDate: doc.$modificationDate
    };
};

