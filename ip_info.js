// ==MuYunAPI==
// @name         IP详细信息
// @slug         ip_info_v2
// @description  查询IP地址的详细信息，包括地理位置、ASN、运营商等
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"ip","type":"string","required":false,"description":"IP地址，不传则返回请求者IP"}]
// @response     {"code":200,"message":"success","data":{"ip":"8.8.8.8","city":"Mountain View","region":"California","country":"US","org":"AS15169 Google LLC","loc":"37.3860,-122.0838","timezone":"America/Los_Angeles"}}
// ==/MuYunAPI==

/**
 * IP详细信息
 * 通过 ipinfo.io 查询IP地址的详细信息
 *
 * 参数说明：
 * - ip: IP地址（可选，不传则返回请求者IP）
 *
 * 调用示例：
 * GET /api/ip_info_v2?ip=8.8.8.8
 * GET /api/ip_info_v2
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    const ip = params && params.ip;

    try {
      const url = ip
        ? `https://ipinfo.io/${encodeURIComponent(ip)}/json`
        : 'https://ipinfo.io/json';

      const response = await axios.get(url, {
        timeout: 10000,
      });

      const data = response.data;

      if (data && data.ip) {
        return {
          code: 200,
          message: 'success',
          data: {
            ip: data.ip,
            city: data.city || '',
            region: data.region || '',
            country: data.country || '',
            loc: data.loc || '',
            org: data.org || '',
            postal: data.postal || '',
            timezone: data.timezone || '',
          },
        };
      } else if (data && data.error) {
        return {
          code: 400,
          message: data.error.message || data.reason || '查询失败',
          data: null,
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
