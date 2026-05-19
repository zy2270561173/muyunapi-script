// ==MuYunAPI==
// @name         网易云热评
// @slug         netease_hot_comment
// @description  获取网易云音乐热门评论
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"count","type":"number","required":false,"description":"返回数量，默认1，最大10"}]
// @response     {"code":200,"message":"success","data":{"count":1,"comments":[{"content":"评论内容","song":"歌曲名","author":"评论者"}]}}
// ==/MuYunAPI==

/**
 * 网易云热评
 * 通过 vvhan API 获取网易云音乐热门评论
 *
 * 参数说明：
 * - count: 返回数量（可选，默认1，最大10）
 *
 * 调用示例：
 * GET /api/netease_hot_comment
 * GET /api/netease_hot_comment?count=3
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    let count = parseInt(params && params.count) || 1;
    count = Math.min(Math.max(count, 1), 10);

    try {
      const response = await axios.get('https://api.vvhan.com/api/hotlist/wyMusic', {
        timeout: 10000,
      });

      const data = response.data;

      if (data && data.success === true && data.data) {
        // vvhan 接口返回的数据格式为数组
        const allComments = Array.isArray(data.data) ? data.data : [];

        // 取前 count 条
        const comments = allComments.slice(0, count).map((item) => ({
          content: item.content || item.title || '',
          song: item.song || item.name || '',
          author: item.author || item.nick || '',
          avatar: item.avatar || '',
        }));

        return {
          code: 200,
          message: 'success',
          data: {
            count: comments.length,
            comments: comments,
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
