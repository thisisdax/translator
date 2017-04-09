const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const translate = require('./controllers/translate')
const config = require('config')
const app = express()
mongoose.Promise = global.Promise
let PORT = ''

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(config.get('test.mongodb'))
  PORT = 'test.port'
  console.log('Running Test Database')
} else if (process.env.NODE_ENV === 'dev') {
  mongoose.connect(config.get('dev.mongodb'))
  PORT = 'dev.port'
  console.log('Running Development Database')
} else {
  mongoose.connect(process.env.MONGODB_URI || config.get('production.mongodb'))
  PORT = 'production.port'
  console.log('Running Production Database')
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.redirect('/index.html')
})
app.use('/translate', translate)

app.listen(config.get(PORT), () => console.log('Listening to ', config.get(PORT)))

module.exports = app
