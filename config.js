module.exports = {
    customDesign: {
        version: 20,
        views: {
            lib: {
                ocl: '/usr/local/rest-on-couch/eln/openchemlib-core.js'
            },
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
                    var general = content.general || {};
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

                    var oclid = '';
                    if (doc.$content.general && doc.$content.general.molfile) {
                        var OCL = require('views/lib/ocl');
                        try {
                            oclid = OCL.Molecule.fromMolfile(doc.$content.general.molfile).getIDCode();
                        } catch (e) {}
                    }

                    emitWithOwner(doc.$id, {
                        reference: doc.$id.join(" "),
                        mf: general.mf,
                        mw: general.mw,
                        hasNmr: nmr && nmr.length,
                        hasIR: ir && ir.length,
                        hasMass: mass && mass.length,
                        has1d: has1d,
                        has2d: has2d,
                        nb1d: nb1d,
                        nb2d: nb2d,
                        oclid: oclid,
                        modificationDate: doc.$modificationDate
                    });
                },
                withOwner: true
            },
            substructureSearch: {
                map: function(doc) {
                    if (doc.$kind === 'sample' && doc.$content.general && doc.$content.general.molfile) {
                        var OCL = require('views/lib/ocl');
                        try {
                            var mol = OCL.Molecule.fromMolfile(doc.$content.general.molfile);
                            var result = {
                                reference: doc.$id.join(' ')
                            };
                            result.idcode = mol.getIDCodeAndCoordinates();
                            var mf = mol.getMolecularFormula();
                            result.mf = mf.formula;
                            result.em = mf.absoluteWeight;
                            result.mw = mf.relativeWeight;
                            result.index = mol.getIndex();
                            var prop = mol.getProperties();
                            result.properties = {
                                acc: prop.acceptorCount,
                                don: prop.donorCount,
                                logp: prop.logP,
                                logs: prop.logS,
                                psa: prop.polarSurfaceArea,
                                rot: prop.rotatableBondCount,
                                ste: prop.stereoCenterCount
                            };
                            emitWithOwner(null, result);
                        } catch (e) {}
                    }
                },
                withOwner: true,
                // designDoc: 'sss'
            }
        }
    }
};
