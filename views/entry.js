'use strict';

module.exports = {
  entryByOwnersAndKind: {
    map: function (doc) {
      if (doc.$type === 'entry') {
        emitWithOwner(doc.$kind);
      }
    },
    reduce: '_count',
    withOwner: true,
  },
  entry_owners: {
    map: function (doc) {
      if (doc.$type !== 'entry') return;

      var getReference = require('views/lib/getReference').getReference;
      emitWithOwner(doc.$modificationDate, {
        kind: doc.$kind,
        reference: getReference(doc),
        creationDate: doc.$creationDate,
        modificationDate: doc.$modificationDate,
        owners: doc.$owners,
      });
    },
    withOwner: true,
  },
  entryByIdWithOwner: {
    map: function (doc) {
      if (doc.$type !== 'entry') return;
      emitWithOwner(doc.$id, null);
    },
    withOwner: true,
  },
};
