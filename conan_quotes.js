// ==MuYunAPI==
// @name         名侦探柯南名言
// @slug         conan_quotes
// // @description  随机获取《名侦探柯南》中的经典语录，支持中日双语、角色搜索、内容关键词搜索
// @category     1
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        dark
// @params       [{"name":"la","type":"string","required":false,"description":"语言类型：c=中文, j=日文, al=全部(双语)","example":"c","default":"al"},{"name":"qu","type":"string","required":false,"description":"角色名模糊搜索（支持中日文）","example":"柯南"},{"name":"s","type":"string","required":false,"description":"名言内容关键词搜索（支持中日文）","example":"真相"},{"name":"n","type":"int","required":false,"description":"返回数量（随机模式1-20，列表模式1-50）","example":"5","default":"1"},{"name":"type","type":"string","required":false,"description":"返回格式：json/text/html/js","example":"json","default":"json"}]
// @response     {"code":200,"data":{"id":123,"quote":"真相只有一个！","japanese":"真実はいつも一つ！","character":"江户川柯南","_signature":{"api":"MuYunApi","source":"cqs.muysky.cn"}}}
// ==/MuYunAPI==

/**
 * 名侦探柯南名言接口
 * 文档：https://cqs.muysky.cn/api
 *
 * 上游端点：
 *   GET /api/quotes/random  - 随机名言（默认1条，最多20条）
 *   GET /api/quotes         - 全部名言列表（支持分页筛选）
 *   GET /api/quotes/:id     - 通过ID获取单条名言
 *   GET /api/stats          - 统计数据
 *
 * 通用参数：la(语言) qu(角色) s(关键词) n(数量) type(格式)
 */

const axios = require('axios');

const BASE_URL = 'https://cqs.muysky.cn';

const VALID_LA = ['c', 'j', 'al'];
const VALID_TYPE = ['json', 'text', 'html', 'js'];

module.exports = {
  async execute(slug, params, req) {
    const qp = {};

    // 语言
    if (params.la && VALID_LA.includes(params.la)) qp.la = params.la;
    // 角色搜索
    if (params.qu) qp.qu = params.qu;
    // 内容关键词
    if (params.s) qp.s = params.s;
    // 返回格式
    if (params.type && VALID_TYPE.includes(params.type)) qp.type = params.type;

    // 数量限制
    if (params.n) {
      const num = parseInt(params.n);
      if (num > 0) qp.n = Math.min(num, 20);
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/quotes/random`, {
        params: qp,
        timeout: 10000,
      });

      return {
        code: 200,
        message: 'success',
        data: response.data,
      };
    } catch (e) {
      return {
        code: 502,
        message: '上游请求失败：' + (e.message || '网络异常'),
        data: null,
      };
    }
  },
};
