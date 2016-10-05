'use strict';

const express = require('express');
const app = express();
const { createReadStream, createWriteStream, rmdirSync, readdirSync, unlinkSync } = require('fs');
const multer = require('multer');
const { json } = require('body-parser');
const UploadImg = require('./models/Upload.js');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/imguploader';
/////////////////////////////////////////
//Store the current uploads dir
const uploadsDir = readdirSync('./partials/uploads');
//Destination to upload file
const upload = multer({
  dest: __dirname + '/partials/uploads/',
});


//Middle wares
app.use(express.static(__dirname + '/partials/'));
app.use(json());

//Post uploaded img to this route
app.post('/uploads', upload.single('image'), (req, res) => {
  let img64 = "";

  //Create readStream to encode img into base64 string
  createReadStream(`./partials/uploads/${req.file.filename}`, { encoding: 'base64'})
  .on('data', (buffer) => {
    //Concatenate the buffer object
    img64 += buffer;
  })
  .on('end', () => {
    console.log("Test end");

    //Save uploaded to database
    UploadImg
    .create({ base64: img64, time: new Date() })
    .then(() => {
      console.log("Img has been saved to db");
    })
    .catch(console.error);

    res.send(`<img src="data:image/jpg;base64,${img64}" />`);

    if (uploadsDir.length === 1) {
      uploadsDir.forEach((each) => {
        unlinkSync(`./partials/uploads/${each}`);
      });
    };

  });


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

mongoose.connect(MONGODB_URL, () => {
  app.listen(3000, () => console.log("Listening on port 3000"));
});
