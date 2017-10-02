'use strict';

const config = require('./configBase');

const customViews = config.customDesign.views;

// add custom views here
customViews.entryByOwnersAndKind = {
    map: function(doc) {
        if (doc.$type === 'entry') {
            emitWithOwner(doc.$kind);
        }
    },
    reduce: '_count',
    withOwner: true
};

customViews.reagentSSS = {
    map: function(doc) {
        if(doc.$type !== 'entry' || doc.$kind !== 'reaction') {
            return;
        }

        function substructureSearch(molfile) {
            var OCL = require('views/lib/ocl');
            var getReference = require('views/lib/getReference').getReference;

            var mol = OCL.Molecule.fromMolfile(molfile);
            if (mol.getAllAtoms() === 0) return;
            var result = {
                reference: getReference(doc)
            };
            result.ocl = mol.getIDCodeAndCoordinates();
            var mf = mol.getMolecularFormula();
            result.mf = mf.formula;
            result.em = mf.absoluteWeight;
            result.mw = mf.relativeWeight;
            result.index = mol.getIndex();
            return result;
        }

        var parseRXN = require('views/lib/rxnParse');
        var rxn = doc.$content.reactionRXN;
        var result = parseRXN(rxn);
        var reagents = result.reagents;
        for (var i = 0; i < reagents.length; ++i) {
            emitWithOwner(doc._id, substructureSearch(reagents[i]));
        }
    },
    reduce: '_count',
    designDoc: 'reactionSSS',
    withOwner: true
};

customViews.productSSS = {
    map: function(doc) {
        if(doc.$type !== 'entry' || doc.$kind !== 'reaction') {
            return;
        }

        function substructureSearch(molfile) {
            var OCL = require('views/lib/ocl');
            var getReference = require('views/lib/getReference').getReference;

            var mol = OCL.Molecule.fromMolfile(molfile);
            if (mol.getAllAtoms() === 0) return;
            var result = {
                reference: getReference(doc)
            };
            result.ocl = mol.getIDCodeAndCoordinates();
            var mf = mol.getMolecularFormula();
            result.mf = mf.formula;
            result.em = mf.absoluteWeight;
            result.mw = mf.relativeWeight;
            result.index = mol.getIndex();
            return result;
        }

        var parseRXN = require('views/lib/rxnParse');
        var rxn = doc.$content.reactionRXN;
        var result = parseRXN(rxn);
        var products = result.products;
        for (var i = 0; i < products.length; ++i) {
            emitWithOwner(doc._id, substructureSearch(products[i]));
        }
    },
    reduce: '_count',
    designDoc: 'reactionSSS',
    withOwner: true
};

customViews.reactionTree = {
    map: function(doc) {
        if(doc.$type !== 'entry' || doc.$kind !== 'reaction') {
            return;
        }
        var codes = [];

        function emitElements(arr) {
            for (var i = 0; i < arr.length; ++i) {
                var current = arr[i];
                var toEmit = {
                    ocl: current.ocl
                };
                if(codes.indexOf(current.code) !== -1) {
                    toEmit.yield = current.yield;
                } else {
                    codes.push(current.code);
                }
                emitWithOwner(doc._id, toEmit);
            }
        }

        emitElements(doc.$content.reagents);
        emitElements(doc.$content.products);
    },
    reduce: '_count',
    designDoc: 'reactionTree',
    withOwner: true
};


module.exports = config;
