const Cache = require("@11ty/eleventy-cache-assets");
const dotenv = require('dotenv');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { getProxyForUrl } = require('proxy-from-env');

dotenv.config();

const API_KEY = process.env.BANXICO_API_KEY
const MINIMUM_WAGE_SERIES = {
    border_minimum_wage: 'SL11295',
    general_minimum_wage: 'SL11298',
}
const UDI_SERIES = {
    udi: 'SP68257'
}
const CETES_SERIES = {
    cetes_28_days_yield_rate: 'SF43936',
    cetes_91_days_yield_rate: 'SF43939',
    cetes_182_days_yield_rate: 'SF43942',
    cetes_364_days_yield_rate: 'SF43945'
}
const BANXICO_SERIES = {
    ...MINIMUM_WAGE_SERIES,
    ...UDI_SERIES,
    ...CETES_SERIES
}
const proxyAgents = new Map()

module.exports = async function () {
    if (!API_KEY) {
        if (process.env.DEBUG?.includes('banxico')) {
            console.warn("BANXICO_API_KEY is not set; returning empty Banxico indicators.");
        }
        return {};
    }

    if (process.env.DEBUG?.includes('banxico')) {
        console.log("Fetching Banxico's economic indicators...");
    }

    const entries = await Promise.all(
        Object.entries(BANXICO_SERIES).map(async ([key, value]) => {
            const data = await fetch_data(value)
            return [key, data]
        })
    )

    return Object.fromEntries(entries)
}

async function fetch_data(series) {
    const url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${series}/datos/oportuno?token=${API_KEY}`
    const json = await Cache(url, {
        duration: '1d',
        type: 'json',
        fetchOptions: getFetchOptions(url)
    })
    const now = Date.now()
    const nowWithMxFormat = new Intl
        .DateTimeFormat("es-MX", { dateStyle: "short" })
        .format(new Date(now))
    const nowWithFriendlyFormat = new Intl
        .DateTimeFormat("es-MX", { dateStyle: "medium" })
        .format(new Date(now))

    /* This is in dd/MM/yyyy format */
    const updatedAtString = json['bmx']['series'][0]['datos'][0]['fecha']
    const updatedAtDateComponents = updatedAtString.split("/")
    const day = updatedAtDateComponents[0]
    /* -1 since months are 0 indexed for new Date constructor */
    const month = Number(updatedAtDateComponents[1] - 1)
    const year = updatedAtDateComponents[2]
    const updatedAt = new Date(year, month, day)
    const updatedAtFriendly = new Intl
        .DateTimeFormat("es-MX", { dateStyle: "medium" })
        .format(updatedAt)

    return {
        description: json['bmx']['series'][0]['titulo'].replace(/\s\s+/g, '. '),
        amount: Number(json['bmx']['series'][0]['datos'][0]['dato']),
        series_id: json['bmx']['series'][0]['idSerie'],
        updated_at_friendly: updatedAtFriendly,
        udpated_at: updatedAtString,
        updated_at_epoch: updatedAt.getTime(),
        consulted_at_friendly: nowWithFriendlyFormat,
        consulted_at: nowWithMxFormat,
        consulted_at_epoch: now
    }
}

function getFetchOptions(url) {
    const proxyUrl = getProxyForUrl(url)

    if (!proxyUrl) {
        return {}
    }

    if (!proxyAgents.has(proxyUrl)) {
        proxyAgents.set(proxyUrl, new HttpsProxyAgent(proxyUrl))
    }

    return {
        agent: proxyAgents.get(proxyUrl)
    }
}
