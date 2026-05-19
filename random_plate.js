// ==MuYunAPI==
// @name         随机车牌号
// @slug         random_plate
// @description  按中国车牌规则随机生成普通车牌或新能源车牌
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"type","type":"string","required":false,"description":"车牌类型","default":"normal","options":["normal","new_energy"]},{"name":"count","type":"int","required":false,"description":"生成数量","default":1}]
// @response     {"code":200,"message":"success","data":{"plates":["京A12345"],"type":"normal","count":1}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const type = params.type || 'normal';
    const count = Math.min(Math.max(parseInt(params.count) || 1, 1), 10);

    if (!['normal', 'new_energy'].includes(type)) {
      return { code: 400, message: 'type 参数无效，可选值: normal, new_energy', data: null };
    }

    try {
      const plates = [];
      for (let i = 0; i < count; i++) {
        plates.push(type === 'normal' ? generateNormalPlate() : generateNewEnergyPlate());
      }

      return {
        code: 200,
        message: 'success',
        data: { plates, type, count },
      };
    } catch (e) {
      return { code: 500, message: '生成失败: ' + e.message, data: null };
    }
  },
};

// 省份简称
const PROVINCES = [
  '京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘',
  '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋',
  '蒙', '陕', '吉', '闽', '贵', '粤', '川', '青', '藏', '琼', '宁',
];

// 字母（排除I和O）
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

// 数字
const DIGITS = '0123456789';

// 字母+数字
const ALPHANUM = LETTERS + DIGITS;

function randomChar(str) {
  return str[Math.floor(Math.random() * str.length)];
}

function generateNormalPlate() {
  // 格式: 省份简称 + 字母 + 5位字母数字
  const province = randomChar(PROVINCES);
  const letter = randomChar(LETTERS);
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += randomChar(ALPHANUM);
  }
  return province + letter + code;
}

function generateNewEnergyPlate() {
  // 小型新能源: 省份简称 + 字母 + 6位(字母数字)
  // 大型新能源: 省份简称 + 字母 + 5位数字 + D/F
  const isSmall = Math.random() > 0.5;
  const province = randomChar(PROVINCES);
  const letter = randomChar(LETTERS);

  if (isSmall) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += randomChar(ALPHANUM);
    }
    return province + letter + code;
  } else {
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += randomChar(DIGITS);
    }
    code += randomChar('DF');
    return province + letter + code;
  }
}
