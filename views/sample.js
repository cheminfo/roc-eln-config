'use strict';

module.exports = {
  sample_toc: {
    map: function(doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
      var getReference = require('views/lib/getReference').getReference;
      var getToc = require('views/lib/getToc').getToc;
      var reference = getReference(doc);
      var toc = getToc(doc);
      toc.reference = reference;
      emitWithOwner(doc.$modificationDate, toc);
    },
    withOwner: true
  },
  sample_owners: {
    map: function(doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
      var getReference = require('views/lib/getReference').getReference;
      var getSampleOwners = require('views/lib/getSampleOwners')
        .getSampleOwners;
      var reference = getReference(doc);
      var toc = getSampleOwners(doc);
      toc.reference = reference;
      emitWithOwner(reference, toc);
    },
    withOwner: true
  },
  sampleByUuid: {
    map: function(doc) {
      if (doc.$type === 'entry' && doc.$kind === 'sample') {
        emitWithOwner(doc._id, null);
      }
    },
    withOwner: true
  },
  sampleId: {
    map: function(doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
      emit(doc.$id[0]);
    },
    reduce: function(keys, values, rereduce) {
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
  sampleById: {
    map: function(doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
      emitWithOwner(doc.$id, null);
    },
    withOwner: true
  }
};
