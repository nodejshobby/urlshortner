const express = require('express')
const app = express()
const path = require('path')
const urlRoute = require('./routes/url.route')

require('./dbConnect').getConnection()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(urlRoute)
app.use((req, res, next) => {
  return res.status(404).json({ message: 'Page not found!' })
  next()
})
module.exports = app
