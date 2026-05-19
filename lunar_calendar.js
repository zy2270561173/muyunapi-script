// ==MuYunAPI==
// @name         农历查询
// @slug         lunar_calendar
// @description  输入公历日期，返回农历日期、生肖、天干地支、节气信息
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"year","type":"int","required":false,"description":"公历年（默认今年）"},{"name":"month","type":"int","required":false,"description":"公历月（默认当月）"},{"name":"day","type":"int","required":false,"description":"公历日（默认今天）"}]
// @response     {"code":200,"message":"success","data":{"solar":{"year":2024,"month":1,"day":1},"lunar":{"year":"癸卯","month":"冬月","day":"二十","yearGanZhi":"癸卯","animal":"兔"}}}
// ==/MuYunAPI==

/**
 * 农历查询 - 基于查表算法（覆盖2020-2030年）
 * 使用简化农历数据表实现公历转农历
 */

module.exports = {
  async execute(slug, params, req) {
    const now = new Date();
    const year = parseInt(params.year) || now.getFullYear();
    const month = parseInt(params.month) || (now.getMonth() + 1);
    const day = parseInt(params.day) || now.getDate();

    if (year < 2020 || year > 2030) {
      return { code: 400, message: '当前仅支持2020-2030年范围查询', data: null };
    }

    try {
      const result = solarToLunar(year, month, day);
      return {
        code: 200,
        message: 'success',
        data: result,
      };
    } catch (e) {
      return { code: 500, message: '查询失败: ' + e.message, data: null };
    }
  },
};

// 农历数据表 2020-2030
// 每个元素编码了该年的农历信息:
// 前4位hex: 闰月月份(0表示无闰月)
// 后12位hex: 每月大小(1=30天, 0=29天)
const LUNAR_DATA = {
  2020: 0x04bd8,   // 闰4月
  2021: 0x04ae0,
  2022: 0x0a570,
  2023: 0x054d5,
  2024: 0x0d260,
  2025: 0x0d950,
  2026: 0x16554,
  2027: 0x056a0,
  2028: 0x09ad0,
  2029: 0x055d2,
  2030: 0x04ae0,
};

// 闰月天数表
const LEAP_DAYS = {
  2020: 29, 2021: 0, 2022: 0, 2023: 0, 2024: 0,
  2025: 29, 2026: 29, 2027: 0, 2028: 0, 2029: 0, 2030: 0,
};

// 每年农历正月初一对应的公历日期
const SPRING_FESTIVAL = {
  2020: [2020, 1, 25],
  2021: [2021, 2, 12],
  2022: [2022, 2, 1],
  2023: [2023, 1, 22],
  2024: [2024, 2, 10],
  2025: [2025, 1, 29],
  2026: [2026, 2, 17],
  2027: [2027, 2, 6],
  2028: [2028, 1, 26],
  2029: [2029, 2, 13],
  2030: [2030, 2, 3],
};

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const LUNAR_MONTH_CN = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAY_CN = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

// 24节气近似日期表（每月两个）
const SOLAR_TERMS = {
  1: [['小寒', 5], ['大寒', 20]],
  2: [['立春', 4], ['雨水', 19]],
  3: [['惊蛰', 6], ['春分', 21]],
  4: [['清明', 5], ['谷雨', 20]],
  5: [['立夏', 6], ['小满', 21]],
  6: [['芒种', 6], ['夏至', 21]],
  7: [['小暑', 7], ['大暑', 23]],
  8: [['立秋', 7], ['处暑', 23]],
  9: [['白露', 8], ['秋分', 23]],
  10: [['寒露', 8], ['霜降', 23]],
  11: [['立冬', 7], ['小雪', 22]],
  12: [['大雪', 7], ['冬至', 22]],
};

function solarToLunar(year, month, day) {
  // 获取该年春节日期
  const sf = SPRING_FESTIVAL[year];
  const springFestivalDate = new Date(sf[0], sf[1] - 1, sf[2]);
  const targetDate = new Date(year, month - 1, day);

  // 计算与春节的天数差
  const diffDays = Math.floor((targetDate - springFestivalDate) / (24 * 60 * 60 * 1000));

  // 如果在春节之前，使用上一年的农历数据
  if (diffDays < 0) {
    const prevYear = year - 1;
    if (prevYear < 2020) {
      return { solar: { year, month, day }, lunar: { year: '', month: '', day: '', yearGanZhi: '', animal: '' }, solarTerm: '' };
    }
    const prevSf = SPRING_FESTIVAL[prevYear];
    const prevSpringFestivalDate = new Date(prevSf[0], prevSf[1] - 1, prevSf[2]);
    const prevDiffDays = Math.floor((targetDate - prevSpringFestivalDate) / (24 * 60 * 60 * 1000));
    const lunarInfo = getLunarFromDays(prevYear, prevDiffDays);
    return buildResult(year, month, day, prevYear, lunarInfo);
  }

  const lunarInfo = getLunarFromDays(year, diffDays);
  return buildResult(year, month, day, year, lunarInfo);
}

function getLunarFromDays(year, daysDiff) {
  const data = LUNAR_DATA[year];
  const leapMonth = (data >> 16) & 0xf; // 闰月月份
  const monthDays = [];
  let totalDays = 0;

  // 解析每月天数
  for (let i = 0; i < 12; i++) {
    const isBig = (data >> (15 - i)) & 1;
    const days = isBig ? 30 : 29;
    monthDays.push(days);
    totalDays += days;
  }

  // 闰月天数
  if (leapMonth > 0) {
    const leapDays = LEAP_DAYS[year] || 29;
    monthDays.splice(leapMonth, 0, leapDays);
    totalDays += leapDays;
  }

  // 从正月初一开始累加
  let remaining = daysDiff;
  let lunarMonth = 1;
  let isLeap = false;

  for (let i = 0; i < monthDays.length; i++) {
    if (remaining < monthDays[i]) {
      lunarMonth = i + 1;
      if (leapMonth > 0 && i === leapMonth) {
        isLeap = true;
      }
      break;
    }
    remaining -= monthDays[i];
  }

  // 计算农历日
  const lunarDay = remaining + 1;

  // 计算农历年（如果超过12月+闰月，年份+1）
  let lunarYear = year;

  return { lunarYear, lunarMonth, lunarDay, isLeap };
}

function buildResult(solarYear, solarMonth, solarDay, lunarYear, lunarInfo) {
  // 天干地支（农历年）
  const ganIndex = (lunarYear - 4) % 10;
  const zhiIndex = (lunarYear - 4) % 12;
  const ganZhi = TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
  const animal = ANIMALS[zhiIndex];

  // 农历月名
  let monthName;
  if (lunarInfo.isLeap) {
    monthName = '闰' + LUNAR_MONTH_CN[lunarInfo.lunarMonth - 1] + '月';
  } else {
    monthName = LUNAR_MONTH_CN[lunarInfo.lunarMonth - 1] + '月';
  }

  // 农历日名
  const dayName = LUNAR_DAY_CN[Math.min(lunarInfo.lunarDay - 1, 29)];

  // 查询节气
  let solarTerm = '';
  const terms = SOLAR_TERMS[solarMonth];
  if (terms) {
    for (const [name, date] of terms) {
      if (solarDay === date) {
        solarTerm = name;
        break;
      }
    }
  }

  return {
    solar: { year: solarYear, month: solarMonth, day: solarDay },
    lunar: {
      year: ganZhi + '年',
      month: monthName,
      day: dayName,
      yearGanZhi: ganZhi,
      animal: animal,
      isLeap: lunarInfo.isLeap || false,
    },
    solarTerm: solarTerm || null,
  };
}
