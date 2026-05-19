// ==MuYunAPI==
// @name         随机手机号
// @slug         random_phone
// @description  按中国运营商号段随机生成手机号（非真实号码）
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"carrier","type":"string","required":false,"description":"运营商类型","default":"random","options":["random","mobile","unicom","telecom"]},{"name":"count","type":"int","required":false,"description":"生成数量","default":1}]
// @response     {"code":200,"message":"success","data":{"phones":["13812345678"],"carrier":"random","count":1}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const carrier = params.carrier || 'random';
    const count = Math.min(Math.max(parseInt(params.count) || 1, 1), 10);

    if (!['random', 'mobile', 'unicom', 'telecom'].includes(carrier)) {
      return { code: 400, message: 'carrier 参数无效，可选值: random, mobile, unicom, telecom', data: null };
    }

    try {
      const phones = [];
      for (let i = 0; i < count; i++) {
        phones.push(generatePhone(carrier));
      }

      return {
        code: 200,
        message: 'success',
        data: { phones, carrier, count },
      };
    } catch (e) {
      return { code: 500, message: '生成失败: ' + e.message, data: null };
    }
  },
};

// 运营商号段
const PREFIXES = {
  mobile: [
    '134', '135', '136', '137', '138', '139',
    '147', '148', '150', '151', '152', '157', '158', '159',
    '172', '178', '182', '183', '184', '187', '188', '195', '197', '198',
  ],
  unicom: [
    '130', '131', '132', '145', '146',
    '155', '156', '166', '167', '171', '175', '176',
    '185', '186', '196',
  ],
  telecom: [
    '133', '149', '153', '173', '174', '177',
    '180', '181', '189', '190', '191', '193', '199',
  ],
};

function generatePhone(carrier) {
  let prefix;
  if (carrier === 'random') {
    const carriers = ['mobile', 'unicom', 'telecom'];
    const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
    prefix = PREFIXES[randomCarrier][Math.floor(Math.random() * PREFIXES[randomCarrier].length)];
  } else {
    prefix = PREFIXES[carrier][Math.floor(Math.random() * PREFIXES[carrier].length)];
  }

  // 生成后8位
  let suffix = '';
  for (let i = 0; i < 8; i++) {
    suffix += Math.floor(Math.random() * 10);
  }

  return prefix + suffix;
}
