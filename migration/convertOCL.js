const path = require('path');
const superagent = require('superagent');
const password = process.env.COUCHDB_PASSWORD;
const OCL = require('openchemlib');
const db = 'eln';
const host = 'localhost:5984';
updateDB().then(() => console.log('success')).catch((e) =>  console.log('update failed', e.message));

async function updateDB() {
    let samples = await getAllSamples();
    samples = samples.body.rows;
    let count = 0;
    for(let i=0; i<samples.length; i++) {
          await update(samples[i].doc);
          count++;
    }
    console.log('count', count);
}

function getAllSamples() {
    return superagent.get(`http://admin:${password}@${host}/${db}/_design/app/_view/entryByKind?key="sample"&reduce=false&include_docs=true`);
}

function getAllReactions() {
    return superagent.get(`http://admin:${password}@${host}/${db}/_design/app/_view/entryByKind?key="reaction"&reduce=false&include_docs=true`);    
}

function update(entry) {
    const mol = OCL.Molecule.fromMolfile(entry.$content.general.molfile);
    const oclid = mol.getIDCodeAndCoordinates();
    entry.$content.general.ocl = {
        value: oclid.idCode,
        coordinates: oclid.coordinates,
        index: mol.getIndex()
    };
    console.log(entry._id);
    return superagent.put(`http://admin:${password}@${host}/${db}/${entry._id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(entry);
}
