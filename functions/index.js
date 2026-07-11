const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')

admin.initializeApp()
const db = admin.firestore()

// Paynow merchant credentials (set via Firebase Config)
// firebase functions:config:set paynow.integration_id="..." paynow.integration_key="..."
const PAYNOW_INTEGRATION_ID = functions.config().paynow?.integration_id
const PAYNOW_INTEGRATION_KEY = functions.config().paynow?.integration_key
const PAYNOW_URL = 'https://www.paynow.co.zw/interface/initiatetransaction'
const PAYNOW_RESULT_URL = 'https://us-central1-studio-5711057632-ad846.cloudfunctions.net/paynowWebhook'

/**
 * POST /paynowInitiate
 * Body: { orderId, amount, phone, method }
 */
exports.paynowInitiate = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).send('')
    return
  }

  try {
    const { orderId, amount, phone, method } = req.body

    const reference = `SUNWAY-${orderId.slice(0, 8)}`
    const params = new URLSearchParams({
      resulturl: PAYNOW_RESULT_URL,
      returnurl: PAYNOW_RESULT_URL,
      reference,
      amount: amount.toString(),
      additionalinfo: `Order ${orderId}`,
      authemail: 'sales@sunway.co.zw',
    })

    // Build cart items from order
    const orderDoc = await db.collection('orders').doc(orderId).get()
    if (!orderDoc.exists) {
      res.status(404).json({ success: false, error: 'Order not found' })
      return
    }

    const order = orderDoc.data()
    order.items.forEach((item, i) => {
      params.append(`cartitem[${i}]`, `${item.name}*${item.qty}*${item.price_usd}`)
    })

    // Generate hash (Paynow requires MD5 hash of the request)
    const hash = generateHash(params)
    params.append('hash', hash)

    const response = await axios.post(PAYNOW_URL, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const result = parsePaynowResponse(response.data)

    if (result.status === 'Ok') {
      // Store poll URL
      await db.collection('orders').doc(orderId).update({
        paynow_poll_url: result.pollurl,
        paynow_status: 'pending',
      })

      res.json({
        success: true,
        poll_url: result.pollurl,
        instructions: getInstructions(method),
      })
    } else {
      res.json({ success: false, error: result.error || 'Paynow initiation failed' })
    }
  } catch (err) {
    functions.logger.error('Paynow initiation error:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

/**
 * GET /paynowStatus?orderId=...
 */
exports.paynowStatus = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  try {
    const { orderId } = req.query
    const orderDoc = await db.collection('orders').doc(orderId).get()

    if (!orderDoc.exists) {
      res.status(404).json({ success: false, error: 'Order not found' })
      return
    }

    const order = orderDoc.data()
    res.json({
      success: order.paynow_status === 'paid',
      status: order.paynow_status,
    })
  } catch (err) {
    functions.logger.error('Paynow status error:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

/**
 * POST /paynowWebhook — Paynow IPN callback
 */
exports.paynowWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { reference, status, pollurl, hash } = req.body

    // Verify hash
    const expectedHash = generateHash(new URLSearchParams(req.body))
    if (hash !== expectedHash) {
      res.status(403).send('Invalid hash')
      return
    }

    const orderId = reference.replace('SUNWAY-', '')
    const fullOrderId = (await findOrderByPrefix(orderId))?.id

    if (!fullOrderId) {
      res.status(404).send('Order not found')
      return
    }

    const paynowStatus = status === 'Paid' ? 'paid' : status === 'Cancelled' ? 'cancelled' : 'failed'
    const orderStatus = paynowStatus === 'paid' ? 'paid' : 'pending'

    await db.collection('orders').doc(fullOrderId).update({
      paynow_status: paynowStatus,
      status: orderStatus,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    })

    res.status(200).send('OK')
  } catch (err) {
    functions.logger.error('Webhook error:', err)
    res.status(500).send('Error')
  }
})

// Helpers

function generateHash(params) {
  const crypto = require('crypto')
  const str = `${PAYNOW_INTEGRATION_KEY}${params.toString()}`
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase()
}

function parsePaynowResponse(data) {
  const result = {}
  data.split('\n').forEach((line) => {
    const [key, ...vals] = line.split('=')
    if (key) result[key.trim()] = vals.join('=').trim()
  })
  return result
}

function getInstructions(method) {
  const instructions = {
    ecocash: 'Dial *151*2*4*amount*merchant# and follow prompts',
    onemoney: 'Dial *111# and select OneMoney to Pay, enter merchant code',
    innbucks: 'Visit any Innbucks till point and use merchant code provided',
    bank: 'Transfer to Sunway Pvt Ltd account and upload proof of payment',
  }
  return instructions[method] || ''
}

async function findOrderByPrefix(prefix) {
  const snap = await db.collection('orders')
    .where('__name__', '>=', prefix)
    .where('__name__', '<=', prefix + '\uf8ff')
    .limit(1)
    .get()

  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() }
}
