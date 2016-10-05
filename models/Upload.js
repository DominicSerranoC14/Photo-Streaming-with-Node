'use strict';

const mongoose = require('mongoose');
/////////////////////////////////////////

module.exports = mongoose.model('upload', {
  base64: String,
  time: String
});
