const cds = require('@sap/cds');
const SequenceHelper = require("./lib/SequenceHelper");
const { Readable, PassThrough } = require('stream');

module.exports = cds.service.impl(async function () {

  const {
    Files
  } = this.entities;

  this.before('CREATE', Files, async (req) => {
    console.log('Create called');
    console.log(JSON.stringify(req.data));
    req.data.url = `/v2/attachments/Files(${req.data.ID})/content`
  });

  this.on('UPDATE', Files, async (req) => {
    let chunks;
    req.data.content.on('data', (chunk)=> {
      chunks += chunk;
    });
    req.data.content.on('end', ()=> {
      console.log(chunks.toString());
    });
  });


});