const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = Schema(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },

    longUrl: {
      required: true,
      type: String,
    },

    shortUrl: {
      required: true,
      type: String,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Url', urlSchema)
