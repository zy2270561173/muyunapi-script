// ==MuYunAPI==
// @name         Token生成器
// @slug         token_generate
// @description  生成随机API Token（用于接口鉴权/会话标识）
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"length","type":"number","required":false,"description":"Token长度，默认32","example":"32"}]
// @response     {"code":200,"data":{"token":"a8f3c2d9e1b4..."}}
// ==/MuYunAPI==

const crypto = require('crypto');

module.exports = {
  async execute(slug, params) {

    let length = Number(params.length || 32);

    if (isNaN(length) || length < 8) {
      length = 32;
    }

    const token = crypto.randomBytes(length).toString('hex');

    return {
      code: 200,
      message: 'success',
      data: {
        token
      }
    };
  }
};