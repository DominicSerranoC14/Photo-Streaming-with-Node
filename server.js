'use strict';

const express = require('express');
const app = express();
const { createReadStream, createWriteStream, readFile } = require('fs');
const readStream = createReadStream('yoshi.jpg');
const bodyparser = require('body-parser');
const multer = require('multer');
/////////////////////////////////////////

const upload = multer({
  dest: __dirname + '/partials/uploads/',
});

app.use(express.static(__dirname + '/partials/'));
// app.use(bodyparser.urlencoded({extended: false}));


const img64 = new Buffer('yoshi.jpg', 'base64');
const imgASCII = new Buffer(img64, 'ascii');


app.post('/uploads', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send(`<img src="./uploads/${req.file.filename}"/ >`)
});


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
