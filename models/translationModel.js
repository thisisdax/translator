const mongoose = require('mongoose')

var translationSchema = new mongoose.Schema({
  inputLanguage: { type: String, required: true },
  inputText: { type: String, required: true, trim: true, maxlength: 10000 },
  outputLanguage: { type: String, required: true },
  outputText: { type: String },
  lang: { type: String, required: true }
})

module.exports = mongoose.model('Translate', translationSchema)
