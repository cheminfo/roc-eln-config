'use strict';

const md5 = require('crypto-md5');

function parseFilename(filename, fileContent) {
  // #{ticket number}#{sample name}#{cheminfoID}_{userid}#{varies}.pdf
  // #2002223#NM90 01-#aE7Lm%2F%2BJ_nmertes#report.pdf
  if (filename.startsWith('.')) {
    throw new Error(`Filename ${filename} cannot start with a dot`);
  }
  // eslint-disable-next-line prefer-named-capture-group
  const reg = /^([^#]*)#([^#]+)#([^#]+)#([^_]+)_([a-zA-Z]+)#([^#]*).pdf/;
  const match = reg.exec(filename);
  if (!match) {
    throw new Error(`${filename} could not match regex`);
  }
  const exp = match[6] || '';
  const ticketNumber = match[2];
  const sampleName = match[3];
  const cheminfoID = Buffer.from(
    decodeURIComponent(match[4]),
    'base64',
  ).toString('hex');
  const user = `${match[5]}@mpimf-heidelberg.mpg.de`;

  const hash = md5(fileContent, 'hex').substring(0, 8);
  return {
    cheminfoID,
    user,
    // filename: `${exp}${exp ? '_' : ''}${ticketNumber}_${hash}.pdf`
    filename: `#${exp}${
      exp ? '#' : ''
    }${ticketNumber}#${sampleName}#${hash}.pdf`,
  };
}

module.exports = parseFilename;
