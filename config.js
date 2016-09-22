module.exports = {
    customDesign: {
        version: 23,
        views: {
            lib: {
                getReference: './getReference.js',
                getToc: './getToc.js',
                ocl: './openchemlib-core.js'
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
                    var getReference = require('views/lib/getReference').getReference;
                    var getToc = require('views/lib/getToc').getToc;
                    var reference = getReference(doc);
                    var toc = getToc(doc);
                    toc.reference = reference;
                    emitWithOwner(reference, toc);
                },
                withOwner: true
            },
            substructureSearch: {
                map: function(doc) {
                    if (doc.$kind === 'sample' && doc.$content.general && doc.$content.general.molfile) {
                        var OCL = require('views/lib/ocl');
                        var getReference = require('views/lib/getReference').getReference;
                        try {
                            var mol = OCL.Molecule.fromMolfile(doc.$content.general.molfile);
                            if (mol.getAllAtoms()===0) return;
                            var result = {
                                reference: getReference(doc)
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
                designDoc: 'sss'
            }
        }
    }
};
