'use strict';

module.exports = {
  substructureSearch: {
    map: function(doc) {
      if (
        doc.$kind === 'sample' &&
        doc.$content.general &&
        doc.$content.general.molfile
      ) {
        var general = doc.$content.general || {};
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
        emitWithOwner(idStart, {
          reference: getReference(doc),
          mf: general.mf,
          em: general.em,
          mw: general.mw,
          ocl: general.ocl
        });
      }
    },
    withOwner: true,
    designDoc: 'sss'
  }
};
