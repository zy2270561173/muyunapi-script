// ==MuYunAPI==
// @name         DNS查询
// @slug         dns_query
// @description  查询域名的DNS解析记录
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"domain","type":"string","required":true,"description":"要查询的域名"},{"name":"type","type":"string","required":false,"description":"记录类型：A/AAAA/MX/TXT/NS/CNAME/SOA，默认A"}]
// @response     {"code":200,"message":"success","data":{"domain":"example.com","type":"A","answers":[{"name":"example.com","type":1,"ttl":300,"data":"93.184.216.34"}]}}
// ==/MuYunAPI==

/**
 * DNS查询
 * 通过 Google DNS-over-HTTPS 查询域名的DNS解析记录
 *
 * 参数说明：
 * - domain: 要查询的域名（必填）
 * - type: 记录类型（可选，默认A，支持 A/AAAA/MX/TXT/NS/CNAME/SOA）
 *
 * 调用示例：
 * GET /api/dns_query?domain=example.com
 * GET /api/dns_query?domain=example.com&type=MX
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    const domain = params && params.domain;
    const validTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA'];
    let type = (params && params.type) || 'A';

    if (!domain) {
      return {
        code: 400,
        message: '缺少必填参数：domain',
        data: null,
      };
    }

    type = type.toUpperCase();
    if (!validTypes.includes(type)) {
      return {
        code: 400,
        message: `无效的记录类型，支持：${validTypes.join(' / ')}`,
        data: null,
      };
    }

    try {
      const response = await axios.get('https://dns.google/resolve', {
        params: {
          name: domain,
          type: type,
        },
        timeout: 10000,
      });

      const data = response.data;

      if (data && data.Status === 0) {
        return {
          code: 200,
          message: 'success',
          data: {
            domain: data.Question && data.Question[0] ? data.Question[0].name : domain,
            type: type,
            answers: (data.Answer || []).map((record) => ({
              name: record.name,
              type: record.type,
              ttl: record.TTL,
              data: record.data,
            })),
          },
        };
      } else {
        const statusMsg = {
          1: '格式错误（FORMERR）',
          2: '服务器失败（SERVFAIL）',
          3: '域名不存在（NXDOMAIN）',
          4: '不支持（NOTIMP）',
          5: '拒绝（REFUSED）',
        };
        return {
          code: 400,
          message: statusMsg[data.Status] || `DNS查询失败，状态码：${data.Status}`,
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
