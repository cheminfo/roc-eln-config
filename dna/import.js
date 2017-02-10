'use strict';

const bioParsers = require('bio-parsers');
const userLookupTable = require('./userLookup');

module.exports = {
    kind: 'sample',
    source: [], // add optional mounted directories with the spectra
    getID(filename, contents) {
        const terms = filename.split('_');
        if(terms.length < 2) {
            throw new Error('Invalid filename');
        }
        const user = terms[0].toLowerCase();
        const [project, batch] = terms[1].split('-');
        if(batch) {
            return [user, project, batch];
        } else {
            return [user, project];
        }
    },
    getOwner(filename) {
        // return the main owner of the entry
        const user = filename.split('_')[0].toLowerCase();
        if(userLookupTable[user]) {
            return [userLookupTable[user], 'dnaRead', 'dnaWrite'];
        } else {
            throw new Error('Unknown user');
        }
    },
    parse(filename, contents) {

        contents = contents.toString('utf-8');
        const reference = filename.replace('.gb', '');
        const toReturn = {
            jpath: 'biology.dna',
            content_type: 'chemical/x-genbank',
            reference: reference
        };

        if (/\.gb$/i.test(filename)) { // parse genbank
            bioParsers.genbankToJson(contents, function(parsed) {
                // All sequences must be parsed successfully for the import to succeed
                if(parsed.some(p => p.success !== true)) {
                    throw new Error('Error parsing genbank');
                }
                toReturn.data = {
                    seq: parsed
                };
                toReturn.field = 'genbank';
            });
        } else {
            throw new Error('unexpected file extension: ' + filename);
        }
        return toReturn;
    }
};
