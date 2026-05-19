// ==MuYunAPI==
// @name         随机笑话
// @slug         random_joke
// @description  获取随机笑话，支持中文和英文
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"lang","type":"string","required":false,"description":"语言：zh/en，默认zh"},{"name":"type","type":"string","required":false,"description":"笑话类型：any/general/programming，默认any"}]
// @response     {"code":200,"message":"success","data":{"lang":"zh","type":"general","content":"为什么程序员总是分不清万圣节和圣诞节？因为 Oct 31 = Dec 25。"}}
// ==/MuYunAPI==

/**
 * 随机笑话
 * 通过 JokeAPI 获取随机笑话
 *
 * 参数说明：
 * - lang: 语言（可选，默认zh，支持 zh/en）
 * - type: 笑话类型（可选，默认any，支持 any/general/programming）
 *
 * 调用示例：
 * GET /api/random_joke
 * GET /api/random_joke?lang=en&type=programming
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    const validLangs = ['zh', 'en'];
    const validTypes = ['any', 'general', 'programming'];

    let lang = (params && params.lang) || 'zh';
    let type = (params && params.type) || 'any';

    if (!validLangs.includes(lang)) {
      return {
        code: 400,
        message: `无效的语言，支持：${validLangs.join(' / ')}`,
        data: null,
      };
    }

    if (!validTypes.includes(type)) {
      return {
        code: 400,
        message: `无效的类型，支持：${validTypes.join(' / ')}`,
        data: null,
      };
    }

    // JokeAPI 的语言代码映射
    const langMap = {
      zh: 'zh',
      en: 'en',
    };

    try {
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any', {
        params: {
          lang: langMap[lang],
          type: type === 'any' ? undefined : type,
        },
        timeout: 10000,
      });

      const data = response.data;

      if (data && !data.error) {
        let content = '';

        if (data.type === 'single') {
          content = data.joke;
        } else if (data.type === 'twopart') {
          content = data.setup + '\n' + data.delivery;
        }

        return {
          code: 200,
          message: 'success',
          data: {
            lang: lang,
            type: data.category || type,
            joke_type: data.type,
            content: content,
          },
        };
      } else {
        return {
          code: 502,
          message: (data && data.message) || '上游接口返回异常',
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
