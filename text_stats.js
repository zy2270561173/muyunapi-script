// ==MuYunAPI==
// @name         文本统计
// @slug         text_stats
// @description  统计文本的字符数、字数、词数、句数、段落数、中文字数、英文单词数、预计阅读时间
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"text","type":"string","required":true,"description":"待统计的文本"}]
// @response     {"code":200,"message":"success","data":{"chars":100,"charsNoSpace":95,"words":50,"sentences":5,"paragraphs":3,"chineseChars":30,"englishWords":20,"readingTime":"约1分钟"}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const text = params.text;

    if (!text) {
      return { code: 400, message: '缺少必填参数: text', data: null };
    }

    try {
      const stats = analyzeText(text);

      return {
        code: 200,
        message: 'success',
        data: stats,
      };
    } catch (e) {
      return { code: 500, message: '统计失败: ' + e.message, data: null };
    }
  },
};

function analyzeText(text) {
  // 字符数（含空格）
  const chars = text.length;

  // 字符数（不含空格）
  const charsNoSpace = text.replace(/\s/g, '').length;

  // 中文字符数
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;

  // 英文单词数（连续的英文字母序列）
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;

  // 数字数量
  const numbers = (text.match(/\d+/g) || []).length;

  // 总词数（中文每个字算一个词 + 英文单词数）
  const words = chineseChars + englishWords;

  // 句数（按中英文句号、问号、感叹号分割）
  const sentences = (text.match(/[。！？.!?]+/g) || []).length || (text.trim() ? 1 : 0);

  // 段落数（按换行分割，去除空行）
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);

  // 行数
  const lines = text.split('\n').length;

  // 预计阅读时间（中文约500字/分钟，英文约200词/分钟）
  const readingMinutes = chineseChars / 500 + englishWords / 200;
  let readingTime;
  if (readingMinutes < 1) {
    readingTime = '不到1分钟';
  } else if (readingMinutes < 60) {
    readingTime = `约${Math.ceil(readingMinutes)}分钟`;
  } else {
    readingTime = `约${Math.floor(readingMinutes / 60)}小时${Math.ceil(readingMinutes % 60)}分钟`;
  }

  return {
    chars,
    charsNoSpace,
    words,
    sentences,
    paragraphs,
    lines,
    chineseChars,
    englishWords,
    numbers,
    readingTime,
  };
}
