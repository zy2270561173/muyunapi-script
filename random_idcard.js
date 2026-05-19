// ==MuYunAPI==
// @name         随机身份证号
// @slug         random_idcard
// @description  按中国身份证标准生成含校验位的18位身份证号（非真实号码）
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"region_code","type":"string","required":false,"description":"地区码（6位），默认110000（北京）","default":"110000"}]
// @response     {"code":200,"message":"success","data":{"idcard":"110101199003076543","region":"北京市东城区","birthday":"1990-03-07","gender":"男"}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const regionCode = (params.region_code || '110000').toString().padStart(6, '0');

    if (!/^\d{6}$/.test(regionCode)) {
      return { code: 400, message: '地区码必须为6位数字', data: null };
    }

    try {
      const idcard = generateIdCard(regionCode);
      return {
        code: 200,
        message: 'success',
        data: idcard,
      };
    } catch (e) {
      return { code: 500, message: '生成失败: ' + e.message, data: null };
    }
  },
};

// 常见地区码
const REGIONS = {
  '110000': '北京市', '110100': '北京市东城区', '110101': '北京市东城区',
  '310000': '上海市', '310100': '上海市黄浦区',
  '440000': '广东省', '440100': '广州市', '440300': '深圳市',
  '330000': '浙江省', '330100': '杭州市',
  '510000': '四川省', '510100': '成都市',
  '420000': '湖北省', '420100': '武汉市',
  '430000': '湖南省', '430100': '长沙市',
  '320000': '江苏省', '320100': '南京市',
  '350000': '福建省', '350100': '福州市',
  '500000': '重庆市',
  '610000': '陕西省', '610100': '西安市',
};

function generateIdCard(regionCode) {
  // 前6位: 地区码
  const area = regionCode;

  // 7-14位: 出生日期 (1970-2005年随机)
  const year = 1970 + Math.floor(Math.random() * 36);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const maxDay = new Date(year, parseInt(month), 0).getDate();
  const day = String(1 + Math.floor(Math.random() * maxDay)).padStart(2, '0');
  const birthday = `${year}${month}${day}`;

  // 15-17位: 顺序码（第17位奇数为男，偶数为女）
  const seq = String(Math.floor(Math.random() * 999)).padStart(3, '0');

  // 前17位
  const base = area + birthday + seq;

  // 计算校验码
  const checkCode = calcCheckCode(base);

  const fullId = base + checkCode;
  const gender = parseInt(seq.charAt(2)) % 2 === 1 ? '男' : '女';

  // 查找地区名称
  let regionName = '';
  for (const [code, name] of Object.entries(REGIONS)) {
    if (fullId.startsWith(code)) {
      regionName = name;
      break;
    }
  }

  return {
    idcard: fullId,
    region: regionName || regionCode,
    birthday: `${year}-${month}-${day}`,
    gender: gender,
  };
}

function calcCheckCode(base17) {
  // 身份证校验码计算
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(base17.charAt(i)) * weights[i];
  }

  return checkCodes[sum % 11];
}
