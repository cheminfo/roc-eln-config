'use strict';

module.exports = {
  // Only stock info by $id
  sampleStockById: {
    map: function(doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
      var getReference = require('views/lib/getReference').getReference;
      var stock = doc.$content.stock || {};
      emitWithOwner(doc.$id, {
        reference: getReference(doc),
        stock: stock.history && stock.history[0],
        modificationDate: doc.$modificationDate
      });
    },
    reduce: '_count',
    designDoc: 'stock',
    withOwner: true
  },
  stockSupplier: {
    map: function(doc) {
      if (doc.$kind !== 'sample') return;
      if (!doc.$content.stock) return;
      emit(doc.$content.stock.supplier);
    },
    reduce: function(keys, values, rereduce) {
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
  locations: {
    map: function(doc) {
      if (doc.$kind !== 'sample') return;
      if (!doc.$content.stock) return;
      var history = doc.$content.stock.history;
      if (history && history.length) {
        emit(history[0].location.split('-_.'));
      }
    },
    reduce: '_count',
    designDoc: 'stock'
  },
  stockLoc: {
    map: function(doc) {
      if (doc.$kind !== 'sample') return;
      if (!doc.$content.stock) return;
      var history = doc.$content.stock.history;
      if (history && history.length) {
        emit(history[0].location);
      }
    },
    reduce: function(keys, values, rereduce) {
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
  // Stock info and chemical info
  stockToc: {
    map: function test(doc) {
      if (
        doc.$kind === 'sample' &&
        doc.$content.general &&
        doc.$content.stock
      ) {
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
          ocl: general.ocl,
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
  }
};
