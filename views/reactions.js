'use strict';

module.exports = {
  reagentSSS: {
    map: function (doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'reaction') {
        return;
      }
      var reagents = doc.$content.reagents;
      for (var i = 0; i < reagents.length; i++) {
        var r = reagents[i];
        var result = {
          reference: doc.$id,
          ocl: r.ocl,
          mf: r.mf,
          em: r.em,
          mw: r.mw,
        };
        emitWithOwner(doc._id, result);
      }
    },
    reduce: '_count',
    designDoc: 'reactionSSS',
    withOwner: true,
  },
  productSSS: {
    map: function (doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'reaction') {
        return;
      }
      var products = doc.$content.products;
      for (var i = 0; i < products.length; i++) {
        var p = products[i];
        var result = {
          reference: doc.$id,
          ocl: p.ocl,
          mf: p.mf,
          em: p.em,
          mw: p.mw,
        };
        emitWithOwner(doc._id, result);
      }
    },
    reduce: '_count',
    designDoc: 'reactionSSS',
    withOwner: true,
  },
  reactionTree: {
    map: function (doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'reaction') {
        return;
      }
      var codes = [];

      function emitElements(arr) {
        for (var i = 0; i < arr.length; ++i) {
          var current = arr[i];
          var toEmit = {
            ocl: current.ocl,
          };
          if (codes.indexOf(current.code) !== -1) {
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
    withOwner: true,
  },
  reactionToc: {
    map: function (doc) {
      var overview;
      if (doc.$type !== 'entry' || doc.$kind !== 'reaction') return;

      if (doc._attachments && doc._attachments['overview.png']) {
        overview = 'overview.png';
      }

      var filteredProducts = doc.$content.products.filter(function (p) {
        if (p.kind && p.kind !== 'pure') return false;
        return p.yield > 0;
      });

      var totalYield = 0;
      filteredProducts.forEach(function (p) {
        totalYield += p.yield;
      });

      var toSend = {
        reference: doc.$id,
        reagents: doc.$content.reagents.map(function (r) {
          return {
            code: r.code,
            mf: r.mf,
            iupac: r.iupac,
            rn: r.rn,
            equivalent: r.equivalent,
          };
        }),
        products: filteredProducts.map(function (p) {
          return {
            batch: p.batch,
            mf: p.mf,
            yield: p.yield,
          };
        }),
        date: doc.$content.date,
        creationDate: doc.$creationDate,
        modificationDate: doc.$modificationDate,
        owners: doc.$owners,
        title: doc.$content.title,
        rxn: doc.$content.reactionRXN,
        hidden: doc.$content.hidden || false,
        status: doc.$content.status && doc.$content.status[0],
        overview: overview,
        yield: totalYield,
        meta: doc.$content.meta,
      };
      emitWithOwner(doc.$id, toSend);
    },
    withOwner: true,
    designDoc: 'reaction',
  },
};
