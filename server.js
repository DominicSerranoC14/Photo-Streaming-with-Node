'use strict';

const express = require('express');
const app = express();
const { createReadStream, createWriteStream, readFile } = require('fs');
const readStream = createReadStream('yoshi.png');
const bodyparser = require('body-parser');
/////////////////////////////////////////

app.use(express.static(__dirname + '/partials/'));

const img64 = new Buffer('yoshi.png', 'base64');
const imgUTF = new Buffer(img64, 'utf-8');


//Upload side: transform each jpg img into a 64 bit string and save to db

//Download: transform each 64bit into a buffer obj

/////////////////////////////////////////
// app.get('/img', (req, res) => {
//   readStream.on('data', (buffer) => {})
//   .pipe(createWriteStream('/img-of-yoshi.jpg'))
//
//   readStream.on('end', () =>  {
//     res.send('Hello');
//     console.log("End")
//   })
//
// });
/////////////////////////////////////////

app.listen(3000, () => console.log("Listening on port 3000"));
