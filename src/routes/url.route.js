const router = require('express').Router()
const urlcontroller = require('../controllers/url.controller')

router.get('/', urlcontroller.urlIndex)
router.get('/:code', urlcontroller.redirectShort)
router.post('/short', urlcontroller.generateUrl)

module.exports = router
