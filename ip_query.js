// ==MuYunAPI==
// @name         IP归属地查询
// @slug         ip_query
// @description  查询IP地址的地理位置、ISP等信息
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"ip","type":"string","required":false,"description":"IP地址，不传则返回请求者IP"}]
// @response     {"code":200,"message":"success","data":{"ip":"8.8.8.8","country":"美国","city":"Mountain View","isp":"Google LLC"}}
// ==/MuYunAPI==

/**
 * IP归属地查询
 * 通过 ip-api.com 查询IP地址的地理位置和ISP信息
 *
 * 参数说明：
 * - ip: IP地址（可选，不传则返回请求者IP）
 *
 * 调用示例：
 * GET /api/ip_query?ip=8.8.8.8
 * GET /api/ip_query
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    const ip = params && params.ip;

    try {
      const url = ip
        ? `http://ip-api.com/json/${encodeURIComponent(ip)}?lang=zh-CN`
        : 'http://ip-api.com/json/?lang=zh-CN';

      const response = await axios.get(url, {
        timeout: 10000,
      });

      const data = response.data;

      if (data && data.status === 'success') {
        return {
          code: 200,
          message: 'success',
          data: {
            ip: data.query,
            country: data.country,
            regionName: data.regionName,
            city: data.city,
            zip: data.zip,
            lat: data.lat,
            lon: data.lon,
            timezone: data.timezone,
            isp: data.isp,
            org: data.org,
            as: data.as,
          },
        };
      } else {
        return {
          code: 400,
          message: data && data.message ? data.message : '查询失败，请检查IP地址是否正确',
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
