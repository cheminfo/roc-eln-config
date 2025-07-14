'use strict';

const nmrMetadata = require('nmr-metadata');

const ldapUtil = require('../../ldapUtil');

async function nmrImport(ctx, result) {
  result.kind = 'sample';

  result.skipAttachment();
  result.jpath = ['spectra', 'nmr'];
  result.metadata = {};
  const filename = ctx.filename;
  result.reference = filename;
  const filenameInfo = parseFilename(filename);
  result.id = filenameInfo.id;

  const ext = ctx.fileExt.toLowerCase();
  if (ext !== '.jdx') {
    throw new Error(`This does not seem to be a JCAMP: ${filename}`);
  }

  const contents = await ctx.getContents('latin1');
  const starts = [];
  const regtitle = /^##TITLE=/gm;
  let regresult;
  while ((regresult = regtitle.exec(contents)) !== null) {
    starts.push(regresult.index);
  }

  if (starts.length !== 3) {
    throw new Error(`expected 3 elements in the file. found ${starts.length}`);
  }

  // first element is the link
  for (let i = 1; i < 3; i++) {
    const start = starts[i];
    const end = starts[i + 1];
    const jcamp = contents.substring(start, end);
    const metadata = nmrMetadata.fromJcamp(jcamp, { computeRanges: true });
    const isFt = !!metadata.isFt;
    result.addAttachment({
      jpath: ['spectra', 'nmr'],
      metadata,
      reference: filename,
      contents: Buffer.from(jcamp),
      field: isFt ? 'jcamp' : 'jcampFID',
      filename:
        filename.substring(0, filename.length - 4) +
        (isFt ? '.jdx' : '.fid.jdx'),
      // eslint-disable-next-line camelcase
      content_type: 'chemical/x-jcamp-dx',
    });
  }

  // TODO: Would be better to interrogate ldap to check user existence
  result.owner = `${filenameInfo.user}@mpimf-heidelberg.mpg.de`;
  const group = await ldapUtil.getDepartmentFromUid(filenameInfo.user);
  result.groups = ['nmrAdmin', 'nmrRead', 'nmrWrite', group];
}

function parseFilename(filename) {
  let firstPart = filename.indexOf('_');
  if (firstPart === -1) firstPart = filename.indexOf('-');
  if (firstPart === 0) throw new Error(`Invalid filename: ${filename}`);
  const dot = filename.indexOf('.');
  if (firstPart === -1) firstPart = dot;
  let user = filename.substring(dot + 1).split('.')[1];
  const ldapUser = ldapMap[user] || user;
  return {
    id: [
      filename.substring(0, firstPart),
      firstPart === dot ? null : filename.substring(firstPart + 1, dot),
    ],
    user: ldapUser,
  };
}

const ldapMap = {
  jb: 'jbroich',
  grosskurth: 'horst',
  admin: 'jbroich',
  miwang: 'mwang',
  abutkevich: 'abutkevi',
  cgrosskurth: 'baust',
};

nmrImport.source = ['/nmr_cheminfo/'];

module.exports = nmrImport;
