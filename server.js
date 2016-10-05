'use strict';

const express = require('express');
const app = express();
const { createReadStream, createWriteStream, rmdirSync, readdirSync, unlinkSync } = require('fs');
const multer = require('multer');
const bodyparser = require('body-parser');
const UploadImg = require('./models/Upload.js');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/imguploader';
/////////////////////////////////////////
let imageArray = [];
//Destination to upload file
const upload = multer({
  dest: __dirname + '/partials/uploads/',
});


//Middle wares
app.use(express.static('partials'));
app.set('view engine', 'pug');
app.use(bodyparser.urlencoded({extended: false}));

app.get('/', (req, res) => res.render('index'));

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

    //Save uploaded img to database
    UploadImg
    .create({ base64: img64, time: new Date() })
    .then(() => {
      console.log("Img has been saved to db");
    })
    .catch(console.error);

    //Push the uploaded img to the imageArray
    imageArray.push(img64);
    //Send the imageArray to index.pug
    res.render('index', { imageArray });

    //If the uploadsDir contains any files, then loop through the dir and unlink each file
    readdirSync('./partials/uploads').forEach((each) => {
      unlinkSync(`./partials/uploads/${each}`);
    });

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
