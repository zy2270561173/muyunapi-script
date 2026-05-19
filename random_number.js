// ==MuYunAPI==
// @name         随机数生成器
// @slug         random_number
// @description  生成指定范围随机整数
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"min","type":"number","required":true,"description":"最小值","example":"1"},{"name":"max","type":"number","required":true,"description":"最大值","example":"100"}]
// @response     {"code":200,"data":{"min":1,"max":100,"value":57}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params) {

    let min = Number(params.min);
    let max = Number(params.max);

    if (isNaN(min) || isNaN(max)) {
      return {
        code: 400,
        message: 'min/max 必须是数字',
        data: null
      };
    }

    if (min > max) {
      [min, max] = [max, min];
    }

    const value = Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      code: 200,
      message: 'success',
      data: { min, max, value }
    };
  }
};