// ==MuYunAPI==
// @name         随机猫咪图片
// @slug         random_cat
// @description  获取随机的猫咪图片
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"count","type":"number","required":false,"description":"返回数量，默认1，最大10"}]
// @response     {"code":200,"message":"success","data":{"count":1,"images":[{"url":"https://cdn2.thecatapi.com/images/abc123.jpg","width":500,"height":500}]}}
// ==/MuYunAPI==

/**
 * 随机猫咪图片
 * 通过 TheCatAPI 获取随机猫咪图片
 *
 * 参数说明：
 * - count: 返回数量（可选，默认1，最大10）
 *
 * 调用示例：
 * GET /api/random_cat
 * GET /api/random_cat?count=3
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    let count = parseInt(params && params.count) || 1;
    count = Math.min(Math.max(count, 1), 10);

    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
        params: {
          limit: count,
        },
        timeout: 10000,
      });

      if (response.data && Array.isArray(response.data)) {
        const images = response.data.map((item) => ({
          url: item.url,
          width: item.width,
          height: item.height,
          id: item.id,
        }));

        return {
          code: 200,
          message: 'success',
          data: {
            count: images.length,
            images: images,
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
