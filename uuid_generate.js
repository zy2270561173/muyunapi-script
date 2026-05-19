// ==MuYunAPI==
// @name         UUID生成器
// @slug         uuid_generate
// @description  生成随机UUID（v4标准），用于唯一标识生成
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       []
// @response     {"code":200,"data":{"uuid":"550e8400-e29b-41d4-a716-446655440000"}}
// ==/MuYunAPI==

const { randomUUID } = require('crypto');

module.exports = {
  async execute() {
    return {
      code: 200,
      message: 'success',
      data: {
        uuid: randomUUID()
      }
    };
  }
};