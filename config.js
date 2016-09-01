module.exports = {
    customDesign: {
        version: 10,
        views: {
            analysisBySampleId: {
                map: function(doc) {
                    if(doc.$type !== 'entry') return;
                    if(doc.$kind !== 'analysis') return;
                    if(Array.isArray(doc.$content.samples)) {
                        for(var i=0; i<doc.$content.samples.length; i++) {
                            emit(doc.$content.samples[i]);
                        }
                    }
                }
            },
            sample_toc: {
                map: function (doc) {
                    if (doc.$kind !== 'sample') return;
                    var content = doc.$content;
                    var nmr = content.spectra.nmr;
                    var ir = content.spectra.ir;
                    var mass = content.spectra.mass;
                    var nb1d = 0, nb2d = 0;

                    if(nmr) {
                        var has1d = nmr.some(function(nmr) { return nmr.dimension === 1 });
                        var has2d = nmr.some(function(nmr) { return nmr.dimension === 2 });
                        for(var i=0; i<nmr.length; i++) {
                            if(nmr[i].dimension === 1) nb1d++;
                            else if(nmr[i].dimension === 2) nb2d++;
                        }
                    }

                    emitWithOwner(doc.$id, {
                        reference: doc.$id.join(" "),
                        description: content.general.description,
                        mf: content.general.mf,
                        mw: content.general.mw,
                        hasNmr: nmr && nmr.length,
                        hasIR: ir && ir.length,
                        hasMass: mass && mass.length,
                        has1d: has1d,
                        has2d: has2d,
                        nb1d: nb1d,
                        nb2d: nb2d,
                        molfile: content.general.molfile,
                        id: doc._id
                    });
                },
                withOwner: true
            }  
        }
    }
};
