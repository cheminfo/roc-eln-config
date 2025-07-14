'use strict';

const parseFilename = require('./parseFilename');

test('parse filename', () => {
  const importFilename = 'JOB#2000431#TEST-1#tblcmZ6K_svcheminfo#zoom.pdf';
  const content = Buffer.from('xxx', 'utf-8');

  const { filename, cheminfoID, user } = parseFilename(importFilename, content);

  expect(cheminfoID).toHaveLength(12);
  expect(filename).toMatch(/^#zoom#2000431#TEST-1#/);
  expect(filename).toHaveLength('#zoom#2000431#TEST-1#'.length + 12); // 12 = 8 md5 chars + .pdf extension
  expect(user).toBe('svcheminfo@mpimf-heidelberg.mpg.de');
});

test('parse filename 2', () => {
  const importFilename = '#2002223#NM90 01-#aE7Lm%2F%2BJ_nmertes#report.pdf';
  const content = Buffer.from('xxx', 'utf-8');

  const { filename, cheminfoID, user } = parseFilename(importFilename, content);
  expect(cheminfoID).toHaveLength(12);
  expect(filename).toMatch(/^#report#2002223#NM90 01-#/);
  expect(filename).toHaveLength('#report#2002223#NM90 01-#'.length + 12); // 12 = 8 md5 chars + .pdf extension
  expect(user).toBe('nmertes@mpimf-heidelberg.mpg.de');
});

test('parse filename with no exp name', () => {
  const importFilename = 'ignored#2000431#TEST-1#tblcmZ6K_svcheminfo#.pdf';
  const content = Buffer.from('xxx', 'utf-8');

  const { filename, cheminfoID, user } = parseFilename(importFilename, content);

  expect(cheminfoID).toHaveLength(12);
  expect(filename).toMatch(/^#2000431#TEST-1#/);
  expect(filename).toHaveLength('#2000431#TEST-1#'.length + 12); // 12 = 8 md5 chars + .pdf extension
  expect(user).toBe('svcheminfo@mpimf-heidelberg.mpg.de');
});

test('should not start with a dot', () => {
  const importFilename = '._#2000431#TEST-1#tblcmZ6K_svcheminfo#SMJ.pdf';
  const content = Buffer.from('xxx', 'utf-8');

  expect(() => {
    parseFilename(importFilename, content);
  }).toThrow(/cannot start with a dot/);
});

test('should decode base64 string', () => {
  const importFilename = '#2000431#TEST-1#YIywN%2FgW_svcheminfo#SMJ.pdf';
  const { cheminfoID } = parseFilename(importFilename, Buffer.from('xxx'));

  expect(cheminfoID).toBe('608cb037f816');
});
