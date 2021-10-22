const urlModel = require('../model/Url')
const { nanoid } = require('nanoid')
const validUrl = require('valid-url')

exports.urlIndex = (req, res) => {
  res.sendFile('index.html')
}

exports.generateUrl = async (req, res) => {
  const { url } = req.body

  if (!url) return res.status(400).json({ message: 'Provide a url' })
  if (!validUrl.isWebUri(url))
    return res.status(400).json({ message: 'Enter a valid url' })
  try {
    const shortCode = await nanoid(7)
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`
    const longUrl = url
    const urlGenerated = await urlModel.create({
      shortCode,
      shortUrl,
      longUrl,
    })

    return res.status(201).json({
      message: 'Short url is created',
      data: { url: urlGenerated.shortUrl },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Ooops, Something went wrong!' })
  }
}

exports.redirectShort = async (req, res) => {
  const { code } = req.params

  if (!code) return res.status(400).json({ message: 'Invalid Request' })

  try {
    const shortUrl = await urlModel.findOne({
      shortCode: code,
    })

    if (!shortUrl)
      return res.status(400).json({ message: 'short url is not found' })

    return res.redirect(shortUrl.longUrl)
  } catch (error) {
    return res.status(500).json({ message: 'Ooops, Something went wrong!' })
  }
}
