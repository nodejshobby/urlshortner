require('dotenv').config()
const app = require('../src/app')
const supertest = require('supertest')
const assert = require('assert')
const Url = require('../src/model/Url')

describe('GET /', function () {
  it('should return status code 200', function (done) {
    supertest(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        return done()
      })
  })
})

describe('POST /', async function () {
  before(async function () {
    await Url.deleteMany()
  })

  it('should return status code 201 and expected message', function (done) {
    supertest(app)
      .post('/short')
      .send({
        url: 'https://www.facebook.com',
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err)
        Url.findOne({}, (error, data) => {
          if (err) throw error
          assert.equal(res.body.message, 'Short url is created')
          assert.equal(
            res.body.data.url,
            `${process.env.BASE_URL}/${data.shortCode}`,
          )
          return done()
        })
      })
  })

  it('should return an error and status code 400 when no url is supplied', function (done) {
    supertest(app)
      .post('/short')
      .send({})
      .expect(400)
      .expect({ message: 'Provide a url' })
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
  })

  it('should return an error and status code 400 when invalid url is supplied', function (done) {
    supertest(app)
      .post('/short')
      .send({ url: 'testing web app' })
      .expect(400)
      .expect({ message: 'Enter a valid url' })
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
  })
})

describe('GET /:code', function () {
  it('should return expected error when no shortcode', function (done) {
    supertest(app)
      .get("/''")
      .expect(400)
      .expect({ message: 'short url is not found' })
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
  })

  it('should return an header redirect to the original url', function (done) {
    Url.findOne({}, (error, data) => {
      if (error) throw error
      supertest(app)
        .get(`/${data.shortCode}`)
        .expect(302)
        .end(function (err, res) {
          if (err) throw err
          assert.equal(res.header.location, 'https://www.facebook.com')
          return done()
        })
    })
  })
})
