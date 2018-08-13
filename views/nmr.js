'use strict';

module.exports = {
  nmrIndex: {
    map: function(doc) {
      var nmr = require('views/lib/nmr');
      var nmrIndexes = nmr.getIndexes(doc);
      if (nmrIndexes) {
        for (var i = 0; i < nmrIndexes.length; i++) {
          emitWithOwner(null, nmrIndexes[i]);
        }
      }
    },
    designDoc: 'nmr',
    withOwner: true
  }
};
