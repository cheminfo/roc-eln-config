exports.getIndexes = function(doc) {
    if(doc.$type !== 'entry' || doc.$kind !== 'sample') return;
    if (!doc.$content.spectra || !doc.$content.spectra.nmr) return;
    var SDRanges = require('views/lib/SDRanges');
    var nmr = doc.$content.spectra.nmr.filter((nmr) => (nmr.dimension === 1 && nmr.nucleus[0] === '1H'));
    var toEmit = [];
    for (let j = 0; j < nmr.length; j++) {
        let general = doc.$content.general || {};
        let entry = {
            description: general.description,
            mf: general.mf,
            id: String(doc.$id[0]),
            index: SDRanges.toIndex(nmr[j].range),
            jcamp:  nmr[j].jcamp.dUrl,
        };

        var oclid = '';
        if (doc.$content.general && doc.$content.general.molfile) {
            if (doc.$content.general.ocl) {
                oclid=doc.$content.general.ocl;
            } else {
                log('No associated ocl code for ' + doc._id);
            }
        }

        entry.oclid = oclid;
        toEmit.push(entry);
    }
    return toEmit;
};
