// ==MuYunAPI==
// @name         汇率查询
// @slug         exchange_rate
// @description  查询实时汇率信息，支持各种货币之间的兑换
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"base","type":"string","required":false,"description":"基准货币代码，默认USD"},{"name":"target","type":"string","required":false,"description":"目标货币代码，默认CNY"}]
// @response     {"code":200,"message":"success","data":{"base":"USD","target":"CNY","rate":7.2456,"amount":1,"result":7.2456,"update_time":"2024-01-01T00:00:00Z"}}
// ==/MuYunAPI==

/**
 * 汇率查询
 * 通过 ExchangeRate-API 查询实时汇率
 *
 * 参数说明：
 * - base: 基准货币代码（可选，默认USD）
 * - target: 目标货币代码（可选，默认CNY）
 *
 * 调用示例：
 * GET /api/exchange_rate
 * GET /api/exchange_rate?base=EUR&target=CNY
 * GET /api/exchange_rate?base=USD&target=JPY
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    const base = (params && params.base) || 'USD';
    const target = (params && params.target) || 'CNY';

    // 验证货币代码格式（3位大写字母）
    const currencyRegex = /^[A-Z]{3}$/;
    if (!currencyRegex.test(base)) {
      return {
        code: 400,
        message: '基准货币代码格式不正确，应为3位大写字母（如 USD、CNY、EUR）',
        data: null,
      };
    }
    if (!currencyRegex.test(target)) {
      return {
        code: 400,
        message: '目标货币代码格式不正确，应为3位大写字母（如 USD、CNY、EUR）',
        data: null,
      };
    }

    try {
      const response = await axios.get(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`, {
        timeout: 10000,
      });

      const data = response.data;

      if (data && data.result === 'success' && data.rates) {
        const rate = data.rates[target];

        if (rate === undefined) {
          return {
            code: 400,
            message: `不支持的目标货币代码：${target}`,
            data: null,
          };
        }

        return {
          code: 200,
          message: 'success',
          data: {
            base: base,
            target: target,
            rate: rate,
            amount: 1,
            result: rate,
            update_time: data.time_last_update_utc || '',
            next_update_time: data.time_next_update_utc || '',
          },
        };
      } else {
        return {
          code: 502,
          message: '上游接口返回异常',
          data: null,
        };
      }
    } catch (e) {
      return {
        code: 502,
        message: '上游请求失败：' + (e.message || '未知错误'),
        data: null,
      };
    }
  },
};
