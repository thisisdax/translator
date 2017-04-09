const supertest = require('supertest')
const should = require('should')
const app = require('../app.js')
const server = supertest(app)
const Translation = require('../models/translationModel')

describe('Cleaning up test database', function () {
  it('should clean up database', (done) => {
    Translation.remove({}, (err, item) => {
      if (err) return err
      item.result.should.have.property('ok', '1')
    })
    Translation.find({}, (err, item) => {
      if (err) return err
      item.should.be.instanceof(Array).and.havelengthOf(0)
    })
    done()
  })
})

describe('Unit Test - Controllers', function () {
  it('should return with status code 200', function (done) {
    this.timeout(5000)
    server
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err) return err
      res.status.should.equal(200)
      res.error.should.equal(false)
      done()
    })
  })

  it('should redirect status code 302', function (done) {
    this.timeout(5000)
    server
    .get('/translate')
    .expect(302)
    .expect('Location', '/')
    .end(function (err, res) {
      if (err) return err
      res.status.should.equal(302)
      res.error.should.equal(false)
      done()
    })
  })

  it('should return status code 400, Invalid parameter: lang', function (done) {
    this.timeout(5000)
    server
    .post('/translate')
    .send(
      {
        inputText: 'Hello, my name is Dax.'
      }
    )
    .expect(400)
    .end(function (err, res) {
      if (err) return err
      should.exist(res)
      res.error.status.should.equal(400)
      res.error.should.have.property('text', 'Invalid parameter: lang')
      done()
    })
  })

  it('should return status code 400, Invalid parameter: text', function (done) {
    this.timeout(5000)
    server
    .post('/translate')
    .send(
      {
        inputText: '',
        inputLanguage: 'en',
        outputLanguage: 'fr'
      }
    )
    .expect(400)
    .end(function (err, res) {
      if (err) return err
      should.exist(res)
      res.error.status.should.equal(400)
      res.error.should.have.property('text', 'Invalid parameter: text')
      done()
    })
  })

  it('should return status code 200 and translated message from Yandex API', function (done) {
    this.timeout(5000)
    server
    .post('/translate')
    .send(
      {
        inputText: 'Hello, my name is Dax.',
        inputLanguage: 'en',
        outputLanguage: 'fr'
      }
    )
    .expect(200)
    .end(function (err, res) {
      if (err) return err
      should.exist(res)
      res.status.should.equal(200)
      res.should.have.property('text', 'Bonjour, mon nom est Dax.')
      Translation.findOne({
        inputText: 'Hello, my name is Dax.',
        inputLanguage: 'en',
        outputLanguage: 'fr'
      }, function (err, data) {
        if (err) return err
        should.exist(data)
        data.should.have.property('_id')
      })
      done()
    })
  })

  it('should return status code 200 and translated message from database', function (done) {
    Translation.findOne({
      outputText: 'Bonjour, mon nom est Dax.',
      inputLanguage: 'en',
      outputLanguage: 'fr'
    }, function (err, data) {
      if (err) return err
      should.exist(data)
      data.should.have.property('inputText', 'Hello, my name is Dax.')
    })
    server
    .post('/translate')
    .send(
      {
        inputText: 'Bonjour, mon nom est Dax.',
        inputLanguage: 'fr',
        outputLanguage: 'en'
      }
    )
    .expect(200)
    .end(function (err, res) {
      if (err) return err
      res.status.should.equal(200)
      res.should.have.property('text', 'Hello, my name is Dax.')
      done()
    })
  })
})
