const fetch = require("node-fetch");
const Cache = require("@11ty/eleventy-cache-assets");
const dotenv = require('dotenv');
dotenv.config();
const API_KEY = process.env.BANXICO_API_KEY
const BANXICO_SERIES = {
    border_minimum_wage: 'SL11295',
    general_minimum_wage: 'SL11298',
    udi: 'SP68257'
}

module.exports = async function () {
    console.log("Fetching Banxico's economic indicators...");

    const api_data = {}
    for (const [key, value] of Object.entries(BANXICO_SERIES)) {
        const data = await fetch_data(value)
        api_data[key] = data
    }
    return api_data
}

async function fetch_data(series) {
    const json = await Cache(`https://www.banxico.org.mx/SieAPIRest/service/v1/series/${series}/datos/oportuno?token=${API_KEY}`, {
        duration: '1d',
        type: 'json'
    })
    return {
        amount: Number(json['bmx']['series'][0]['datos'][0]['dato']),
        latest_date: json['bmx']['series'][0]['datos'][0]['fecha'],
        series_id: json['bmx']['series'][0]['idSerie'],
        description: json['bmx']['series'][0]['titulo']
    }
}