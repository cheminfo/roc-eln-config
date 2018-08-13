'use strict';

module.exports = {
  dnaMd5: {
    map: function(doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
      if (!doc.$content.biology || !doc.$content.biology.nucleic) return;
      var md5 = require('views/lib/md5');
      var dna = doc.$content.biology.nucleic;
      var toEmit = [];
      // iterate over each reference - usually 1 file <--> 1 reference
      for (var i = 0; i < dna.length; i++) {
        toEmit.push({
          ref: dna[i].reference,
          seq: []
        });
        // Iterate over the sequences the genbank file contains - usually just 1
        for (var j = 0; j < dna[i].seq.length; j++) {
          var seq = dna[i].seq[j];
          toEmit[i].seq.push({
            size: seq.size,
            name: seq.name,
            md5: md5.md5(seq.sequence),
            features: []
          });
          // Iterate over the features a genbank file contains
          for (var k = 0; k < seq.features.length; k++) {
            toEmit[i].seq[j].features.push({
              name: seq.features[k].name,
              md5: md5.md5(
                seq.sequence.slice(
                  seq.features[k].start,
                  seq.features[k].end + 1
                )
              )
            });
          }
        }
      }
      if (toEmit.length) {
        emitWithOwner(null, toEmit);
      }
    },
    designDoc: 'dna',
    withOwner: true
  },

  dnaFeatures: {
    map: function(doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
      if (!doc.$content.biology || !doc.$content.biology.nucleic) return;
      var md5 = require('views/lib/md5');
      var dna = doc.$content.biology.nucleic;
      var toEmit = [];
      // iterate over each reference - usually 1 file <--> 1 reference
      for (var i = 0; i < dna.length; i++) {
        toEmit.push({
          ref: dna[i].reference,
          features: []
        });
        // Iterate over the sequences the genbank file contains - usually just 1
        for (var j = 0; j < dna[i].seq.length; j++) {
          var seq = dna[i].seq[j];
          // Iterate over the features a genbank file contains
          for (var k = 0; k < seq.features.length; k++) {
            var sequence = seq.sequence.slice(
              seq.features[k].start,
              seq.features[k].end + 1
            );
            toEmit[i].features.push({
              name: seq.features[k].name,
              md5: md5.md5(sequence),
              seq: sequence
            });
          }
        }
      }
      if (toEmit.length) {
        emitWithOwner(null, toEmit);
      }
    },
    designDoc: 'dna',
    withOwner: true
  },

  dnaSequences: {
    map: function(doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
      if (!doc.$content.biology || !doc.$content.biology.nucleic) return;
      var md5 = require('views/lib/md5');
      var dna = doc.$content.biology.nucleic;
      var toEmit = [];
      // iterate over each reference - usually 1 file <--> 1 reference
      for (var i = 0; i < dna.length; i++) {
        toEmit.push({
          ref: dna[i].reference,
          seq: []
        });
        // Iterate over the sequences the genbank file contains - usually just 1
        for (var j = 0; j < dna[i].seq.length; j++) {
          var seq = dna[i].seq[j];
          toEmit[i].seq.push({
            size: seq.size,
            name: seq.name,
            md5: md5.md5(seq.sequence),
            seq: seq.sequence
          });
        }
      }
      if (toEmit.length) {
        emitWithOwner(null, toEmit);
      }
    },
    designDoc: 'dna',
    withOwner: true
  }
};
