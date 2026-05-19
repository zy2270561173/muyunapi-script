// ==MuYunAPI==
// @name         Hash计算器
// @slug         hash_calculator
// @description  计算文本的MD5、SHA1、SHA256、SHA512哈希值
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"text","type":"string","required":true,"description":"待计算哈希的文本"},{"name":"type","type":"string","required":false,"description":"哈希算法类型","default":"md5","options":["md5","sha1","sha256","sha512"]}]
// @response     {"code":200,"message":"success","data":{"hash":"5d41402abc4b2a76b9719d911017c592","type":"md5"}}
// ==/MuYunAPI==

const crypto = require('crypto');

module.exports = {
  async execute(slug, params, req) {
    const text = params.text;
    const type = (params.type || 'md5').toLowerCase();

    if (!text) {
      return { code: 400, message: '缺少必填参数: text', data: null };
    }

    const validTypes = ['md5', 'sha1', 'sha256', 'sha512'];
    if (!validTypes.includes(type)) {
      return { code: 400, message: 'type 参数无效，可选值: md5, sha1, sha256, sha512', data: null };
    }

    try {
      const hash = crypto.createHash(type).update(text, 'utf-8').digest('hex');

      return {
        code: 200,
        message: 'success',
        data: { hash, type },
      };
    } catch (e) {
      return { code: 500, message: '计算失败: ' + e.message, data: null };
    }
  },
};
