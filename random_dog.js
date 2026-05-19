// ==MuYunAPI==
// @name         随机狗狗图片
// @slug         random_dog
// @description  获取随机的狗狗图片
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"count","type":"number","required":false,"description":"返回数量，默认1，最大10"}]
// @response     {"code":200,"message":"success","data":{"count":1,"images":["https://images.dog.ceo/breeds/...jpg"]}}
// ==/MuYunAPI==

/**
 * 随机狗狗图片
 * 通过 dog.ceo API 获取随机狗狗图片
 *
 * 参数说明：
 * - count: 返回数量（可选，默认1，最大10）
 *
 * 调用示例：
 * GET /api/random_dog
 * GET /api/random_dog?count=3
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    let count = parseInt(params && params.count) || 1;
    count = Math.min(Math.max(count, 1), 10);

    try {
      const response = await axios.get(
        `https://dog.ceo/api/breeds/image/random/${count}`,
        {
          timeout: 10000,
        }
      );

      const data = response.data;

      if (data && data.status === 'success' && data.message) {
        const images = Array.isArray(data.message) ? data.message : [data.message];

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
