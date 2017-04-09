const express = require('express')
const request = require('request')
const config = require('config')
const Translation = require('../models/translationModel')
const router = express.Router()

router.get('/', function (req, res) { // redirects user to main page
  res.status(200).redirect('/')
})

router.post('/', function (req, res) {
  const lang = req.body.inputLanguage + '-' + req.body.outputLanguage
  Translation.findOne( // first query to check if input text exist already
    {
      inputText: req.body.inputText,
      inputLanguage: req.body.inputLanguage,
      outputLanguage: req.body.outputLanguage
    }, function (err, inputTranslation) {
    if (err) return err
    Translation.findOne( // second query to check results exist for wanted translation
      {
        outputText: req.body.inputText,
        outputLanguage: req.body.inputLanguage,
        inputLanguage: req.body.outputLanguage
      }, function (err, outputTranslation) {
      if (err) return err
      if (inputTranslation !== null) { // check if database has existing translation
        return res.status(200).send(inputTranslation.outputText)
      } else if (outputTranslation !== null) { // check if database has existing translation in output format
        return res.status(200).send(outputTranslation.inputText)
      } else {
        request.post({url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?',
          form: { key: config.get('API_KEY'),
            text: req.body.inputText,
            lang
          }},
          function (err, response, body) {
            if (err) return res.status(response.statusCode).send(response.statusMessage)
            const result = JSON.parse(body) // body returns JSON format data

            if (result.code !== 200) {
              return res.status(400).send(result.message)
            } else {
              Translation.create({ // store new translated text into database
                inputText: req.body.inputText,
                outputText: result.text.toString(),
                inputLanguage: req.body.inputLanguage,
                outputLanguage: req.body.outputLanguage,
                lang
              }, function (err, translation) {
                if (err) return err
              })

              return res.status(200).send(result.text.toString())
            }
          }
        )
      }
    })
  })
})

module.exports = router
