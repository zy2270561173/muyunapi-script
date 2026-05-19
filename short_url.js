// ==MuYunAPI==
// @name         短链接生成
// @slug         short_url
// @description  将长链接转换为短链接
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"url","type":"string","required":true,"description":"需要缩短的长链接"}]
// @response     {"code":200,"message":"success","data":{"original_url":"https://example.com/very/long/url","short_url":"https://cleanuri.com/abc123"}}
// ==/MuYunAPI==

/**
 * 短链接生成
 * 通过 cleanuri.com 将长链接转换为短链接
 *
 * 参数说明：
 * - url: 需要缩短的长链接（必填）
 *
 * 调用示例：
 * GET /api/short_url?url=https://example.com
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    const url = params && params.url;

    if (!url) {
      return {
        code: 400,
        message: '缺少必填参数：url',
        data: null,
      };
    }

    try {
      const response = await axios.post(
        'https://cleanuri.com/api/v1/shorten',
        new URLSearchParams({ url: url }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.result_url) {
        return {
          code: 200,
          message: 'success',
          data: {
            original_url: url,
            short_url: response.data.result_url,
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
