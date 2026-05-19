// ==MuYunAPI==
// @name         单位换算工具
// @slug         unit_convert
// @description  支持常见单位换算（长度/重量/温度）
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"type","type":"string","required":true,"description":"cm2inch / kg2lb / c2f","example":"cm2inch"},{"name":"value","type":"number","required":true,"description":"数值","example":"100"}]
// @response     {"code":200,"data":{"type":"cm2inch","input":100,"result":39.37}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params) {

    const type = params.type;
    const value = Number(params.value);

    if (isNaN(value)) {
      return { code: 400, message: 'value必须是数字', data: null };
    }

    let result = 0;

    switch (type) {

      case 'cm2inch':
        result = value * 0.3937;
        break;

      case 'inch2cm':
        result = value / 0.3937;
        break;

      case 'kg2lb':
        result = value * 2.20462;
        break;

      case 'lb2kg':
        result = value / 2.20462;
        break;

      case 'c2f':
        result = (value * 9 / 5) + 32;
        break;

      case 'f2c':
        result = (value - 32) * 5 / 9;
        break;

      default:
        return {
          code: 400,
          message: '不支持的转换类型',
          data: null
        };
    }

    return {
      code: 200,
      message: 'success',
      data: {
        type,
        input: value,
        result: Number(result.toFixed(2))
      }
    };
  }
};