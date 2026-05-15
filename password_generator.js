// ==MuYunAPI==
// @name         随机密码生成器
// @slug         password_generator
// @description  生成高强度的随机密码，支持自定义长度、包含的字符类型（大写字母、小写字母、数字、特殊符号）
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"length","type":"number","required":false,"description":"密码长度，默认16，范围8-128","example":"16"},{"name":"uppercase","type":"boolean","required":false,"description":"是否包含大写字母(A-Z)，默认true","example":"true"},{"name":"lowercase","type":"boolean","required":false,"description":"是否包含小写字母(a-z)，默认true","example":"true"},{"name":"numbers","type":"boolean","required":false,"description":"是否包含数字(0-9)，默认true","example":"true"},{"name":"symbols","type":"boolean","required":false,"description":"是否包含特殊符号(!@#$...)，默认true","example":"true"}]
// @response     {"code":200,"data":{"password":"xK9#mP2$vL5@qR8!","length":16}}
// ==/MuYunAPI==

const crypto = require('crypto');

module.exports = {
  async execute(slug, params, req) {
    // 1. 获取并处理参数
    let length = parseInt(params.length) || 16;
    // 限制密码长度在合理范围内
    if (length < 4) length = 4;
    if (length > 128) length = 128;

    const hasUpper = params.uppercase !== 'false'; // 默认包含大写
    const hasLower = params.lowercase !== 'false'; // 默认包含小写
    const hasNumber = params.numbers !== 'false';  // 默认包含数字
    const hasSymbol = params.symbols !== 'false';  // 默认包含符号

    // 2. 定义字符集
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let allChars = '';
    if (hasUpper) allChars += upperChars;
    if (hasLower) allChars += lowerChars;
    if (hasNumber) allChars += numberChars;
    if (hasSymbol) allChars += symbolChars;

    // 如果用户把所有选项都关了，默认至少给小写字母
    if (allChars === '') {
      allChars = lowerChars;
    }

    // 3. 使用 crypto 模块生成安全的随机密码
    let password = '';
    // 创建一个长度为 length 的 Buffer 用于存放随机字节
    const randomBuffer = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      // 将随机字节映射到字符集范围内
      password += allChars[randomBuffer[i] % allChars.length];
    }

    // 4. 返回结果
    return {
      code: 200,
      message: 'success',
      data: {
        password: password,
        length: length,
        options: {
          uppercase: hasUpper,
          lowercase: hasLower,
          numbers: hasNumber,
          symbols: hasSymbol
        }
      }
    };
  }
};