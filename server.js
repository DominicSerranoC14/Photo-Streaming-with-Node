'use strict';

const express = require('express');
const app = express();
const { createReadStream, createWriteStream, readFile } = require('fs');
// const readStream = createReadStream('yoshi.jpg');
const bodyparser = require('body-parser');
const multer = require('multer');
/////////////////////////////////////////

const upload = multer({
  dest: __dirname + '/partials/uploads/',
});

app.use(express.static(__dirname + '/partials/'));


app.post('/uploads', upload.single('image'), (req, res) => {
  let img64 = "";

  createReadStream(`./partials/uploads/${req.file.filename}`, { encoding: 'base64'})
  .on('data', (buffer) => {
    img64 += buffer;
  })
  .on('end', () => {
    console.log("Test end");

    res.send(`<img src="data:image/jpg;base64,${img64}" />`)
  })

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
