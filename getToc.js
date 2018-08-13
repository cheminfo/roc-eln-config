exports.getToc = function(doc) {
  var content = doc.$content;
  var general = content.general || {};
  var spectra = content.spectra || {};
  var names = general.name || [];
  var nmr = spectra.nmr;
  var ir = spectra.ir;
  var mass = spectra.mass;
  var nb1d = 0,
    nb2d = 0,
    nb1h = 0,
    nb13c = 0;
  if (nmr) {
    var has1d = nmr.some(function(nmr) {
      return nmr.dimension === 1;
    });
    var has2d = nmr.some(function(nmr) {
      return nmr.dimension === 2;
    });
    for (var i = 0; i < nmr.length; i++) {
      for (var i = 0; i < nmr.length; i++) {
        if (nmr[i].dimension === 1) {
          nb1d++;
          if (
            Array.isArray(nmr[i].nucleus) &&
            typeof nmr[i].nucleus[0] === 'string'
          ) {
            if (nmr[i].nucleus[0].toLowerCase() === '1h') {
              nb1h++;
            } else if (nmr[i].nucleus[0].toLowerCase() === '13c') {
              nb13c++;
            }
          }
        } else if (nmr[i].dimension === 2) nb2d++;
      }
    }
  }
  return {
    mf: general.mf,
    mw: general.mw,
    // We don't need the index
    ocl: general.ocl && {
      value: general.ocl.value,
      coordinates: general.ocl.coordinates
    },
    keyword: general.keyword,
    hasNmr: nmr && nmr.length,
    hasIR: ir && ir.length,
    hasMass: mass && mass.length,
    has1d: has1d,
    has2d: has2d,
    nb1d: nb1d,
    nb2d: nb2d,
    nb1h: nb1h,
    nb13c: nb13c,
    modificationDate: doc.$modificationDate,
    b64ShortId: hexToBase64(doc._id.substring(0, 12)),
    names: names.map(function(name) {
      // names are added for search purposes
      if (name) return name.value;
    })
  };
};

function InvalidCharacterError(message) {
  this.message = message;
}
InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function hexToBase64(str) {
  return btoa(
    String.fromCharCode.apply(
      null,
      str
        .replace(/\r|\n/g, '')
        .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
        .replace(/ +$/, '')
        .split(' ')
    )
  );
}

// Source: https://github.com/davidchambers/Base64.js
function btoa(input) {
  var chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var str = String(input);
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars, output = '';
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || ((map = '='), idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))
  ) {
    charCode = str.charCodeAt((idx += 3 / 4));
    if (charCode > 0xff) {
      throw new InvalidCharacterError(
        "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
      );
    }
    block = (block << 8) | charCode;
  }
  return output;
}
