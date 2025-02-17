
// ----------------------------------------------------------------------------

import ccxt from '../../../../ccxt.js';
import { HttpsProxyAgent } from 'https-proxy-agent'
import assert from 'assert';
import fs from 'fs'

let defaultOptions = JSON.parse (fs.readFileSync('../../../../keys.json', "utf8"));
defaultOptions = defaultOptions['binance']

// ----------------------------------------------------------------------------

;(async function testBinanceMarkets () {
    const cases = [
        {
            defaultType: undefined,
            defaultSubType: undefined,
            symbol: 'BTC/USDT',
            marketType: 'spot',
        },
        {
            defaultType: undefined,
            defaultSubType: undefined,
            symbol: 'BTCUSDT',
            marketType: 'spot',
        },
        {
            defaultType: 'spot',
            defaultSubType: undefined,
            symbol: 'BTCUSDT',
            marketType: 'spot',
        },
        {
            defaultType: 'spot',
            defaultSubType: undefined,
            symbol: 'BTC/USDT:USDT',
            marketType: 'swap',
        },
        {
            defaultType: 'future',
            defaultSubType: undefined,
            symbol: 'BTC/USDT',
            marketType: 'swap',
        },
        {
            defaultType: 'future',
            defaultSubType: undefined,
            symbol: 'BTCUSDT',
            marketType: 'swap',
        },
        {
            defaultType: 'future',
            defaultSubType: undefined,
            symbol: 'BTC/USDT:USDT',
            marketType: 'swap',
        },
        {
            defaultType: 'swap',
            defaultSubType: undefined,
            symbol: 'BTCUSDT',
            marketType: 'swap',
        },
        {
            defaultType: 'swap',
            defaultSubType: undefined,
            symbol: 'BTC/USDT',
            marketType: 'spot',
        },
        {
            defaultType: undefined,
            defaultSubType: 'inverse',
            symbol: 'BTC/USDT',
            marketType: 'spot',
        },
        {
            defaultType: undefined,
            defaultSubType: 'linear',
            symbol: 'BTC/USDT',
            marketType: 'spot',
        },
        {
            defaultType: undefined,
            defaultSubType: 'linear',
            symbol: 'BTCUSDT',
            marketType: 'swap',
        },
        {
            defaultType: undefined,
            defaultSubType: 'linear',
            symbol: 'BTC/USDT:USDT',
            marketType: 'swap',
        },
        {
            defaultType: 'future',
            defaultSubType: 'linear',
            symbol: 'BTC/USDT',
            marketType: 'swap',
        },
        {
            defaultType: 'swap',
            defaultSubType: 'linear',
            symbol: 'BTC/USDT',
            marketType: 'spot',
        },
    ]
    if (defaultOptions.httpProxy) {
        defaultOptions['agent'] = new HttpsProxyAgent (defaultOptions.httpProxy)
    }
    for (const test of cases) {
        // @ts-ignore
        const binance = new ccxt.binance (Object.assign ({}, defaultOptions, {
            options: {
                defaultType: test.defaultType,
                defaultSubType: test.defaultSubType,
            }
        }))
        let market = undefined
        const message = ` when defaultType: ${test.defaultType} and defaultSubType: ${test.defaultSubType} for ${test.symbol} got ${test.marketType} `
        try {
            await binance.loadMarkets ()
            market = binance.market (test.symbol)
        } catch (e) {
            console.log ('failed with ' + (e as any).name + message)
            process.exit (1)
        }
        const result = market['type']
        assert.equal (result, test.marketType, 'failed with ' + result + message)
        console.log ('succeeded' + message)
        await  (binance as any).sleep (100)
    }
}) ()

// usage
// node js/test/base/functions/test.binanceMarkets.js

