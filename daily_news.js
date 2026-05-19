// ==MuYunAPI==
// @name         每日新闻
// @slug         daily_news
// @description  获取今日热点新闻列表，支持微博热搜、知乎热榜、百度热搜等
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"type","type":"string","required":false,"description":"热搜类型：todayHot/wbHot/zhihu/baidu，默认todayHot"}]
// @response     {"code":200,"message":"success","data":{"type":"todayHot","count":20,"list":[{"title":"...","hot":"...","url":"..."}]}}
// ==/MuYunAPI==

/**
 * 每日新闻 / 热搜榜
 * 通过 vvhan API 获取各大平台热搜榜单
 *
 * 参数说明：
 * - type: 热搜类型（可选，默认todayHot）
 *   todayHot = 今日热搜 | wbHot = 微博热搜 | zhihu = 知乎热榜 | baidu = 百度热搜
 *
 * 调用示例：
 * GET /api/daily_news
 * GET /api/daily_news?type=wbHot
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    const validTypes = ['todayHot', 'wbHot', 'zhihu', 'baidu'];
    let type = (params && params.type) || 'todayHot';

    if (!validTypes.includes(type)) {
      return {
        code: 400,
        message: `无效的类型，支持：${validTypes.join(' / ')}`,
        data: null,
      };
    }

    try {
      const response = await axios.get(`https://api.vvhan.com/api/hotlist/${type}`, {
        timeout: 10000,
      });

      const data = response.data;

      if (data && data.success === true && data.data) {
        const list = (data.data || []).map((item, index) => ({
          rank: index + 1,
          title: item.title || '',
          hot: item.hot || '',
          url: item.url || '',
        }));

        return {
          code: 200,
          message: 'success',
          data: {
            type: type,
            count: list.length,
            list: list,
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
