const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')
const Purchase = require('../models/Purchase')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    const purchase = await Purchase.create({
      content,
      ad: purchaseAd,
      client: user
    })

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
