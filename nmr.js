exports.getIndexes = function(doc) {
    if(doc.$type !== 'entry' || doc.$kind !== 'sample') return;
    if (!doc.$content.spectra || !doc.$content.spectra.nmr) return;
    var SDRanges = require('views/lib/SDRanges');
    var OCL = require('views/lib/ocl');
    var nmr = doc.$content.spectra.nmr.filter((nmr) => (nmr.dimension === 1 && nmr.nucleus[0] === '1H'))
    var toEmit = [];
    for (let j = 0; j < nmr.length; j++) {
        let general = doc.$content.general || {};
        let ranges = new SDRanges.Ranges(nmr[j].range);
        let entry = {
            description: general.description,
            mf: general.mf,
            id: String(doc.$id[0]),
            index: ranges.toIndex(),
            jcamp:  nmr[j].jcamp.dUrl,
        };
        if (general.molfile) {
            var oclid=OCL.Molecule.fromMolfile(general.molfile).getIDCodeAndCoordinates();
            entry.oclid = {
                value: oclid.idCode,
                coordinates: oclid.coordinates
            };
        }
        toEmit.push(entry);
    }
    return toEmit;
};
