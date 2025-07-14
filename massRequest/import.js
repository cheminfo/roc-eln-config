'use strict';

const parseFilename = require('./parseFilename');

async function massReportImport(ctx, result) {
  const ext = ctx.fileExt.toLowerCase();
  if (ext !== '.pdf') {
    throw new Error(
      `Expected the extension to be .pdf in the filename: ${ctx.filename}`,
    );
  }
  result.jpath = ['spectra', 'mass'];
  result.metadata = {};
  const fileContent = await ctx.getContents();
  const { cheminfoID, user, filename } = parseFilename(
    ctx.filename,
    fileContent,
  );

  result.reference = filename;
  const entries = await ctx.couch.queryEntriesByRight(
    user,
    'sampleByUuid',
    'read', // TODO: should it be write here?
    {
      startkey: cheminfoID,
      endkey: `${cheminfoID}\ufff0`,
      // eslint-disable-next-line camelcase
      include_docs: true,
    },
  );

  if (entries.length !== 1) {
    throw new Error(`Expected one row as a result but got ${entries.length}`);
  }

  const entry = entries[0].doc;

  result.kind = 'sample';
  result.id = entry.$id;
  result.owner = entry.$owners[0];
  result.field = 'pdf';
}

massReportImport.source = ['/mass_requests/'];

module.exports = massReportImport;
