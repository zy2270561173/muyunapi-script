// ==MuYunAPI==
// @name         网页标题抓取
// @slug         web_title
// @description  获取指定网页的标题和描述信息
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"url","type":"string","required":true,"description":"要抓取的网页URL"}]
// @response     {"code":200,"message":"success","data":{"url":"https://example.com","title":"Example Domain","description":"This domain is for use in illustrative examples in documents."}}
// ==/MuYunAPI==

/**
 * 网页标题抓取
 * 请求指定URL，从HTML中提取 <title> 和 <meta name="description"> 内容
 *
 * 参数说明：
 * - url: 要抓取的网页URL（必填）
 *
 * 调用示例：
 * GET /api/web_title?url=https://example.com
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

    // 简单的URL格式校验
    try {
      new URL(url);
    } catch (e) {
      return {
        code: 400,
        message: 'url参数格式不正确，请输入有效的URL',
        data: null,
      };
    }

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        },
        maxRedirects: 5,
        validateStatus: function (status) {
          return status < 400;
        },
      });

      const html = response.data;

      // 提取 <title> 标签内容
      let title = '';
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1].trim().replace(/\s+/g, ' ');
      }

      // 提取 <meta name="description" content="..."> 内容
      let description = '';
      const descMatch = html.match(/<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*["']([\s\S]*?)["'][^>]*>/i)
        || html.match(/<meta[^>]+content\s*=\s*["']([\s\S]*?)["'][^>]+name\s*=\s*["']description["'][^>]*>/i);
      if (descMatch) {
        description = descMatch[1].trim().replace(/\s+/g, ' ');
      }

      return {
        code: 200,
        message: 'success',
        data: {
          url: url,
          title: title || '(无标题)',
          description: description || '(无描述)',
        },
      };
    } catch (e) {
      return {
        code: 502,
        message: '上游请求失败：' + (e.message || '未知错误'),
        data: null,
      };
    }
  },
};
