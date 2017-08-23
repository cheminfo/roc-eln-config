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


module.exports = config;
