const fetch = require('node-fetch')
const dotenv = require('dotenv');
dotenv.config();
const API_KEY = process.env.REVUE_API_KEY

const handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body)
    const email = body.email
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Email is required'
        })
      }
    }
    console.info({ email })
    const response = await fetch('https://www.getrevue.co/api/v2/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 201,
      body: JSON.stringify(data),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
