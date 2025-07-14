'use strict';

module.exports = {
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
    designDoc: 'analysis',
  },
  analysisBySampleAndId: {
    map: function (doc) {
      if (doc.$kind !== 'analysis') return;
      if (doc.$type !== 'entry') return;
      var len = doc.$id.length - 1;
      emitWithOwner([doc.$id[0], doc.$id[len]]);
    },
    withOwner: true,
    designDoc: 'analysis',
  },
  analysisRequestByUuid: {
    map: function (doc) {
      if (doc.$kind !== 'analysisRequest') return;
      emit([doc.$owners[0], doc.$content.productUuid]);
    },
    designDoc: 'analysisRequest',
  },
  analysisRequestByKindAndStatus: {
    map: function (doc) {
      if (doc.$kind !== 'analysisRequest') return;
      var emitWithOwner = function (key, data) {
        for (var i = 0; i < doc.$owners.length; i++) {
          emit([doc.$owners[i]].concat(key), data);
        }
      };

      var customMap = function (doc) {
        var reference =
          doc.$content.productId && doc.$content.productId.length
            ? doc.$content.productId.join(' ')
            : doc.$content.productId;
        var status = doc.$content.status ? doc.$content.status[0] : {};
        var kind = doc.$content.analysis ? doc.$content.analysis.kind : '';
        emitWithOwner([status.status], {
          reference: reference,
          status: status,
          kind: kind,
        });
      };
      customMap(doc);
    },
    designDoc: 'analysisRequest',
    withOwner: true,
  },
};
