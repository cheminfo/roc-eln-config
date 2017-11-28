module.exports = {
    defaultEntry: function () {
        return {
            spectra: {
                nmr: [],
                ir: [],
                raman: [],
                mass: [],
                gc: [],
                lc: []
            }
        };
    },
    customDesign: {
        views: {
            lib: {
                getReference: ['./getReference.js', 'customApp', 'sss', 'stockSSS', 'reactionSSS'],
                getToc: ['./getToc.js', 'customApp'],
                nmr: ['./nmr.js', 'nmr'],
                ocl: ['./openchemlib-core.js', 'customApp', 'sss', 'stockSSS', 'nmr', 'reactionSSS'],
                md5: ['./md5.js', 'dna'],
                rxnParse: ['./rxn-parser.js', 'reactionSSS']
            },
            analysisBySampleId: {
                map: function (doc) {
                    if (doc.$type !== 'entry') return;
                    if (doc.$kind !== 'analysis') return;
                    if (Array.isArray(doc.$content.samples)) {
                        for (var i = 0; i < doc.$content.samples.length; i++) {
                            emit(doc.$content.samples[i]);
                        }
                    }
                },
                designDoc: 'analysis'
            },
            analysisBySampleAndId: {
                map: function (doc) {
                    if (doc.$kind !== 'analysis') return;
                    if (doc.$type !== 'entry') return;
                    var len = doc.$id.length - 1;
                    emitWithOwner([doc.$id[0], doc.$id[len]]);
                },
                withOwner: true,
                designDoc: 'analysis'
            },
            entryByIdWithOwner: {
                map: function (doc) {
                    if (doc.$type !== 'entry') return;
                    emitWithOwner(doc.$id, null);
                },
                withOwner: true
            },
            sampleById: {
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
                    emitWithOwner(doc.$id, null);
                },
                withOwner: true
            },
            sample_toc: {
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
                    var getReference = require('views/lib/getReference').getReference;
                    var getToc = require('views/lib/getToc').getToc;
                    var reference = getReference(doc);
                    var toc = getToc(doc);
                    toc.reference = reference;
                    emitWithOwner(reference, toc);
                },
                withOwner: true
            },
            sampleByUuid: {
                map: function (doc) {
                    if (doc.$type === 'entry' && doc.$kind === 'sample') {
                        emitWithOwner(doc._id, null);
                    }
                },
                withOwner: true
            },
            sampleId: {
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
                    emit(doc.$id[0]);
                },
                reduce: function (keys, values, rereduce) {
                    var regexp = /^([A-Za-z]+)-(\d+)/;

                    function s(k, obj) {
                        var m = regexp.exec(k);
                        if (m && m[1] && m[2]) {
                            var count = +m[2];
                            if (!obj[m[1]]) obj[m[1]] = count;
                            else {
                                if (obj[m[1]] < count) {
                                    obj[m[1]] = count;
                                }
                            }
                        }
                    }

                    var obj = {};
                    if (!rereduce) {
                        for (var i = 0; i < keys.length; i++) {
                            s(keys[i][0], obj);
                        }
                    } else {
                        for (i = 0; i < values.length; i++) {
                            for (var key in values[i]) {
                                s(key + '-' + values[i][key], obj);
                            }
                        }
                    }
                    return obj;
                }
            },
            substructureSearch: {
                map: function (doc) {
                    if (doc.$kind === 'sample' && doc.$content.general && doc.$content.general.molfile) {
                        var idStart = doc.$id;
                        if (idStart && idStart.length && typeof idStart === 'object') {
                            idStart = idStart[0];
                        }
                        var idReg = /^(.*)-/;
                        var m = idReg.exec(idStart);
                        if (m && m[1]) {
                            idStart = m[1];
                        } else {
                            idStart = null;
                        }

                        var OCL = require('views/lib/ocl');
                        var getReference = require('views/lib/getReference').getReference;
                        try {
                            var mol = OCL.Molecule.fromMolfile(doc.$content.general.molfile);
                            if (mol.getAllAtoms() === 0) return;
                            var result = {
                                reference: getReference(doc)
                            };
                            result.idcode = mol.getIDCodeAndCoordinates();
                            var mf = mol.getMolecularFormula();
                            result.mf = mf.formula;
                            result.em = mf.absoluteWeight;
                            result.mw = mf.relativeWeight;
                            result.index = mol.getIndex();
                            var prop = new OCL.MoleculeProperties(mol);
                            result.properties = {
                                acc: prop.acceptorCount,
                                don: prop.donorCount,
                                logp: prop.logP,
                                logs: prop.logS,
                                psa: prop.polarSurfaceArea,
                                rot: prop.rotatableBondCount,
                                ste: prop.stereoCenterCount
                            };
                            emitWithOwner(idStart, result);
                        } catch (e) {
                        }
                    }
                },
                withOwner: true,
                designDoc: 'sss'
            },
            stockSupplier: {
                map: function (doc) {
                    if (doc.$kind !== 'sample') return;
                    if (!doc.$content.stock) return;
                    emit(doc.$content.stock.supplier)
                },
                reduce: function (keys, values, rereduce) {
                    function countKeys(keys, values, rereduce) {
                        var val = {};
                        if (rereduce) {
                            for (var i = 0; i < values.length; i++) {
                                for (var key in values[i]) {
                                    if (!val[key]) {
                                        val[key] = values[i][key];
                                    } else {
                                        val[key] += values[i][key];
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i][0];
                                if (!val[key]) {
                                    val[key] = 1;
                                } else {
                                    val[key]++;
                                }
                            }
                        }
                        return val;
                    }

                    return countKeys(keys, values, rereduce);
                },
                designDoc: 'stock'
            },
            stockLoc: {
                map: function (doc) {
                    if (doc.$kind !== 'sample') return;
                    if (!doc.$content.stock) return;
                    var history = doc.$content.stock.history;
                    if (history && history.length) {
                        emit(history[0].location);
                    }
                },
                reduce: function (keys, values, rereduce) {
                    function countKeys(keys, values, rereduce) {
                        var val = {};
                        if (rereduce) {
                            for (var i = 0; i < values.length; i++) {
                                for (var key in values[i]) {
                                    if (!val[key]) {
                                        val[key] = values[i][key];
                                    } else {
                                        val[key] += values[i][key];
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i][0];
                                if (!val[key]) {
                                    val[key] = 1;
                                } else {
                                    val[key]++;
                                }
                            }
                        }
                        return val;
                    }

                    return countKeys(keys, values, rereduce);
                },
                designDoc: 'stock'
            },

            reactionToc: {
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'reaction') return;
                    var toSend = {
                        reference: doc.$id,
                        reagents: doc.$content.reagents.map(function (r) {
                            return {
                                iupac: r.iupac,
                                rn: r.rn
                            };
                        }),
                        date: doc.$content.date,
                        creationDate: doc.$creationDate,
                        modificationDate: doc.$modificationDate,
                        title: doc.$content.title,
                        rxn: doc.$content.reactionRXN
                    };
                    emitWithOwner(doc.$id, toSend);
                },
                withOwner: true,
                designDoc: 'reaction'
            },
            stockToc: {
                map: function test(doc) {
                    if (doc.$kind === 'sample' && doc.$content.general && doc.$content.stock) {
                        var general = doc.$content.general;
                        var stock = doc.$content.stock;
                        var identifier = doc.$content.identifier;
                        var idStart = doc.$id;
                        if (idStart && idStart.length && typeof idStart === 'object') {
                            idStart = idStart[0];
                        }
                        var idReg = /^(.*)-/;
                        var m = idReg.exec(idStart);
                        if (m && m[1]) {
                            idStart = m[1];
                        } else {
                            idStart = null;
                        }

                        var getReference = require('views/lib/getReference').getReference;

                        var result = {
                            reference: getReference(doc),
                            idcode: general.ocl && general.ocl.value,
                            index: general.ocl && general.ocl.index,
                            mf: general.mf,
                            mw: general.mw
                        };
                        if (identifier && identifier.cas && identifier.cas.length) {
                            var cas = identifier.cas;
                            var c;
                            for (var i = 0; i < cas.length; i++) {
                                if (cas[i].preferred) {
                                    c = cas[i];
                                    break;
                                }
                            }
                            if (!c) c = cas[0];
                            result.cas = c.value;
                        }
                        result.name = general.name || [];
                        if (stock && stock.history && stock.history.length) {
                            var history = doc.$content.stock.history;
                            var last = history[0];
                            result.last = {
                                loc: last.location,
                                date: last.date,
                                status: last.status
                            };
                        }
                        emitWithOwner(idStart, result);
                    }
                },
                withOwner: true,
                designDoc: 'stockSSS'
            },
            analysisRequestByUuid: {
                map: function (doc) {
                    if (doc.$kind !== 'analysisRequest') return;
                    emit([doc.$owners[0], doc.$content.productUuid]);
                },
                designDoc: 'analysisRequest'
            },
            dnaWarnings: {
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
                    if (!doc.$content.biology || !doc.$content.biology.dna) return;
                    var dna = doc.$content.biology.dna;
                    var toEmit = [];
                    for (var i = 0; i < dna.length; i++) {
                        for (var j = 0; j < dna[i].seq.length; j++) {
                            var seq = dna[i].seq[j];
                            for (var k = 0; k < seq.messages.length; k++) {
                                emit(dna[i].reference, seq.messages[k]);
                            }
                        }
                    }

                    if (toEmit.length) {
                        emit(null, toEmit);
                    }
                },
                designDoc: 'dna',
                withOwner: true
            },

            dnaMd5: {
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
                    if (!doc.$content.biology || !doc.$content.biology.dna) return;
                    var md5 = require('views/lib/md5');
                    var dna = doc.$content.biology.dna;
                    var toEmit = [];
                    // iterate over each reference - usually 1 file <--> 1 reference
                    for (var i = 0; i < dna.length; i++) {
                        toEmit.push({
                            ref: dna[i].reference,
                            seq: []
                        });
                        // Iterate over the sequences the genbank file contains - usually just 1
                        for (var j = 0; j < dna[i].seq.length; j++) {

                            var seq = dna[i].seq[j].parsedSequence;
                            toEmit[i].seq.push({
                                size: seq.size,
                                name: seq.name,
                                md5: md5.md5(seq.sequence),
                                features: []
                            });
                            // Iterate over the features a genbank file contains
                            for (var k = 0; k < seq.features.length; k++) {
                                toEmit[i].seq[j].features.push({
                                    name: seq.features[k].name,
                                    md5: md5.md5(seq.sequence.slice(seq.features[k].start, seq.features[k].end + 1))
                                });
                            }
                        }
                    }
                    if (toEmit.length) {
                        emitWithOwner(null, toEmit);
                    }
                },
                designDoc: 'dna',
                withOwner: true
            },

            dnaFeatures: {
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
                    if (!doc.$content.biology || !doc.$content.biology.dna) return;
                    var md5 = require('views/lib/md5');
                    var dna = doc.$content.biology.dna;
                    var toEmit = [];
                    // iterate over each reference - usually 1 file <--> 1 reference
                    for (var i = 0; i < dna.length; i++) {
                        toEmit.push({
                            ref: dna[i].reference,
                            features: []
                        });
                        // Iterate over the sequences the genbank file contains - usually just 1
                        for (var j = 0; j < dna[i].seq.length; j++) {
                            var seq = dna[i].seq[j].parsedSequence;
                            // Iterate over the features a genbank file contains
                            for (var k = 0; k < seq.features.length; k++) {
                                var sequence = seq.sequence.slice(seq.features[k].start, seq.features[k].end + 1);
                                toEmit[i].features.push({
                                    name: seq.features[k].name,
                                    md5: md5.md5(sequence),
                                    seq: sequence
                                });
                            }
                        }
                    }
                    if (toEmit.length) {
                        emitWithOwner(null, toEmit);
                    }
                },
                designDoc: 'dna',
                withOwner: true
            },

            dnaSequences: {
                // Same as dnaSeqAndFeatures but without the features, only
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
                    if (!doc.$content.biology || !doc.$content.biology.dna) return;
                    var md5 = require('views/lib/md5');
                    var dna = doc.$content.biology.dna;
                    var toEmit = [];
                    // iterate over each reference - usually 1 file <--> 1 reference
                    for (var i = 0; i < dna.length; i++) {
                        toEmit.push({
                            ref: dna[i].reference,
                            seq: []
                        });
                        // Iterate over the sequences the genbank file contains - usually just 1
                        for (var j = 0; j < dna[i].seq.length; j++) {

                            var seq = dna[i].seq[j].parsedSequence;
                            toEmit[i].seq.push({
                                size: seq.size,
                                name: seq.name,
                                md5: md5.md5(seq.sequence),
                                seq: seq.sequence
                            });
                        }
                    }
                    if (toEmit.length) {
                        emitWithOwner(null, toEmit);
                    }
                },
                designDoc: 'dna',
                withOwner: true
            },

            nmrIndex: {
                map: function(doc) {
                    var nmr = require('views/lib/nmr');
                    var nmrIndexes = nmr.getIndexes(doc);
                    if(nmrIndexes) {
                        for(var i=0; i<nmrIndexes.length; i++) {
                            emitWithOwner(null, nmrIndexes[i])
                        }
                    }
                },
                designDoc: 'nmr',
                withOwner: true
            }
        }
    }
};
