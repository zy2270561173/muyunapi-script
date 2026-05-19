// ==MuYunAPI==
// @name         Base64编解码
// @slug         base64_codec
// @description  对文本进行Base64编码或解码
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"text","type":"string","required":true,"description":"待编码或解码的文本"},{"name":"action","type":"string","required":false,"description":"操作类型","default":"encode","options":["encode","decode"]}]
// @response     {"code":200,"message":"success","data":{"result":"SGVsbG8gV29ybGQ=","action":"encode"}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const text = params.text;
    const action = params.action || 'encode';

    if (!text) {
      return { code: 400, message: '缺少必填参数: text', data: null };
    }

    if (!['encode', 'decode'].includes(action)) {
      return { code: 400, message: 'action 参数无效，可选值: encode, decode', data: null };
    }

    try {
      let result;
      if (action === 'encode') {
        result = Buffer.from(text, 'utf-8').toString('base64');
      } else {
        result = Buffer.from(text, 'base64').toString('utf-8');
      }

      return {
        code: 200,
        message: 'success',
        data: { result, action },
      };
    } catch (e) {
      return { code: 500, message: '处理失败: ' + e.message, data: null };
    }
  },
};
