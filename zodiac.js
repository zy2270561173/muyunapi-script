// ==MuYunAPI==
// @name         星座运势
// @slug         zodiac
// @description  输入月日，返回星座名称、星座符号、今日运势（随机生成的趣味运势）
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"month","type":"int","required":false,"description":"月份（默认当月）"},{"name":"day","type":"int","required":false,"description":"日期（默认今天）"}]
// @response     {"code":200,"message":"success","data":{"name":"狮子座","symbol":"♌","date":"7.23-8.22","fortune":{"overall":4,"love":3,"career":5,"wealth":2}}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const now = new Date();
    const month = parseInt(params.month) || (now.getMonth() + 1);
    const day = parseInt(params.day) || now.getDate();

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return { code: 400, message: '月份或日期无效', data: null };
    }

    try {
      const zodiac = getZodiac(month, day);
      const fortune = generateFortune();

      return {
        code: 200,
        message: 'success',
        data: {
          name: zodiac.name,
          symbol: zodiac.symbol,
          element: zodiac.element,
          date: zodiac.date,
          fortune,
        },
      };
    } catch (e) {
      return { code: 500, message: '查询失败: ' + e.message, data: null };
    }
  },
};

const ZODIAC_LIST = [
  { name: '摩羯座', symbol: '♑', element: '土象', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: '水瓶座', symbol: '♒', element: '风象', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: '双鱼座', symbol: '♓', element: '水象', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: '白羊座', symbol: '♈', element: '火象', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: '金牛座', symbol: '♉', element: '土象', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: '双子座', symbol: '♊', element: '风象', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
  { name: '巨蟹座', symbol: '♋', element: '水象', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
  { name: '狮子座', symbol: '♌', element: '火象', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: '处女座', symbol: '♍', element: '土象', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: '天秤座', symbol: '♎', element: '风象', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23 },
  { name: '天蝎座', symbol: '♏', element: '水象', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22 },
  { name: '射手座', symbol: '♐', element: '火象', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21 },
];

const OVERALL_DESC = ['运势低迷，宜静不宜动', '运势平平，保持平常心', '运势尚可，小有收获', '运势不错，适合行动', '运势大好，万事亨通'];
const LOVE_DESC = ['感情方面需要耐心', '感情稳定，适合沟通', '桃花运不错，注意把握', '甜蜜指数上升', '桃花运爆棚'];
const CAREER_DESC = ['工作压力较大，注意休息', '工作平稳推进中', '工作效率提升，有突破', '事业运佳，贵人相助', '事业腾飞，大展宏图'];
const WEALTH_DESC = ['注意理财，避免冲动消费', '财运平稳，量入为出', '有小财入账', '财运亨通，适合投资', '偏财运极佳'];

function getZodiac(month, day) {
  for (const z of ZODIAC_LIST) {
    if (z.startMonth === z.endMonth) {
      if (month === z.startMonth && day >= z.startDay && day <= z.endDay) {
        return { ...z, date: `${z.startMonth}.${z.startDay}-${z.endMonth}.${z.endDay}` };
      }
    } else if (z.startMonth > z.endMonth) {
      // 跨年（摩羯座）
      if ((month === z.startMonth && day >= z.startDay) || (month === z.endMonth && day <= z.endDay)) {
        return { ...z, date: `${z.startMonth}.${z.startDay}-${z.endMonth}.${z.endDay}` };
      }
    } else {
      if ((month === z.startMonth && day >= z.startDay) || (month === z.endMonth && day <= z.endDay)) {
        return { ...z, date: `${z.startMonth}.${z.startDay}-${z.endMonth}.${z.endDay}` };
      }
    }
  }
  return ZODIAC_LIST[0]; // 默认摩羯座
}

function generateFortune() {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const overall = rand(1, 5);
  const love = rand(1, 5);
  const career = rand(1, 5);
  const wealth = rand(1, 5);

  return {
    overall,
    love,
    career,
    wealth,
    overallDesc: OVERALL_DESC[overall - 1],
    loveDesc: LOVE_DESC[love - 1],
    careerDesc: CAREER_DESC[career - 1],
    wealthDesc: WEALTH_DESC[wealth - 1],
  };
}
