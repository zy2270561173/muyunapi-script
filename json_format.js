// ==MuYunAPI==
// @name         JSON格式化校验
// @slug         json_format
// @description  格式化、压缩或校验JSON字符串
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"json","type":"string","required":true,"description":"JSON字符串"},{"name":"action","type":"string","required":false,"description":"操作类型","default":"format","options":["format","minify","validate"]}]
// @response     {"code":200,"message":"success","data":{"result":"{\n  \"key\": \"value\"\n}","action":"format"}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const jsonStr = params.json;
    const action = params.action || 'format';

    if (!jsonStr) {
      return { code: 400, message: '缺少必填参数: json', data: null };
    }

    if (!['format', 'minify', 'validate'].includes(action)) {
      return { code: 400, message: 'action 参数无效，可选值: format, minify, validate', data: null };
    }

    try {
      const parsed = JSON.parse(jsonStr);

      if (action === 'validate') {
        return {
          code: 200,
          message: 'success',
          data: {
            valid: true,
            action: 'validate',
            type: Array.isArray(parsed) ? 'array' : typeof parsed,
          },
        };
      }

      if (action === 'format') {
        return {
          code: 200,
          message: 'success',
          data: {
            result: JSON.stringify(parsed, null, 2),
            action: 'format',
          },
        };
      }

      if (action === 'minify') {
        return {
          code: 200,
          message: 'success',
          data: {
            result: JSON.stringify(parsed),
            action: 'minify',
          },
        };
      }
    } catch (e) {
      return {
        code: 200,
        message: 'success',
        data: {
          valid: false,
          action: action,
          error: e.message,
        },
      };
    }
  },
};
