// ==MuYunAPI==
// @name         正则表达式测试
// @slug         regex_test
// @description  测试正则表达式，返回匹配结果、分组捕获等信息
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"pattern","type":"string","required":true,"description":"正则表达式模式","example":"\\d+"},{"name":"text","type":"string","required":true,"description":"待匹配的文本","example":"abc123def456"},{"name":"flags","type":"string","required":false,"description":"正则标志","default":"gi"}]
// @response     {"code":200,"message":"success","data":{"match":true,"matches":["123","456"],"count":2,"groups":[]}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const pattern = params.pattern;
    const text = params.text;
    const flags = params.flags || 'gi';

    if (!pattern) {
      return { code: 400, message: '缺少必填参数: pattern', data: null };
    }

    if (text === undefined || text === null) {
      return { code: 400, message: '缺少必填参数: text', data: null };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = [];
      const groups = [];
      let match;

      // 使用 exec 获取所有匹配和分组
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1),
        });

        // 防止无限循环（零宽匹配）
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }

      // 测试是否匹配
      const testRegex = new RegExp(pattern, flags.replace('g', ''));
      const isMatch = testRegex.test(text);

      return {
        code: 200,
        message: 'success',
        data: {
          match: isMatch,
          matches: matches.map(m => m.value),
          count: matches.length,
          details: matches,
        },
      };
    } catch (e) {
      return { code: 400, message: '正则表达式无效: ' + e.message, data: null };
    }
  },
};
