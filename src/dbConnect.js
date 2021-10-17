const mongoose = require('mongoose')

exports.getConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Database connected sucessfully')
  } catch (error) {
    console.log(error.message)
  }
}
