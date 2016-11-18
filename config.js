module.exports = {
    customDesign: {
        version: 35,
        views: {
            lib: {
                getReference: './getReference.js',
                getToc: './getToc.js',
                ocl: './openchemlib-core.js'
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
                }
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
                    if(doc.$type === 'sample') {
                        emit(doc._id, null);
                    }
                }
            },
            sampleId: {
                map: function (doc) {
                    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
                    emit(doc.$id[0]);
                },
                reduce: function (keys, values, rereduce) {
                    var regexp = /^([A-Za-z]+)-(\d+)(-.)?$/;

                    function s(k, obj) {
                        var m = regexp.exec(k);
                        if (m && m[1] && m[2]) {
                            if (!obj[m[1]]) obj[m[1]] = m[2];
                            else {
                                if (obj[m[1]] < m[2]) {
                                    obj[m[1]] = m[2];
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
                        emit(history[history.length - 1].location);
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
            stockToc: {
                map: function (doc) {
                    if (doc.$kind === 'sample' && doc.$content.general && doc.$content.general) {
                        var OCL = require('views/lib/ocl');
                        var getReference = require('views/lib/getReference').getReference;
                        try {
                            var mol = OCL.Molecule.fromMolfile(doc.$content.general.molfile);
                            var result = {
                                reference: getReference(doc)
                            };
                            result.idcode = mol.getIDCodeAndCoordinates();
                            var mf = mol.getMolecularFormula();
                            result.mf = mf.formula;
                            result.mw = mf.relativeWeight;
                            result.index = mol.getIndex();
                            if (doc.$content.identifier && doc.$content.identifier.cas && doc.$content.identifier.cas.length) {
                                var cas = doc.$content.identifier.cas;
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
                            result.name = doc.$content.general.name || [];
                            if (doc.$content.stock && doc.$content.stock.history && doc.$content.stock.history.length) {
                                var history = doc.$content.stock.history;
                                var last = history[history.length - 1];
                                result.last = {
                                    loc: last.location,
                                    date: last.date,
                                    status: last.status
                                };
                            }
                            emitWithOwner(null, result);
                        } catch (e) {
                        }
                    }
                },
                withOwner: true,
                designDoc: 'stockSSS'
            }
        }
    }
};
