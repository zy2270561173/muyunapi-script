// ==MuYunAPI==
// @name         随机中文姓名
// @slug         random_name
// @description  随机生成中文姓名，支持指定性别和数量
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"gender","type":"string","required":false,"description":"性别","default":"random","options":["male","female","random"]},{"name":"count","type":"int","required":false,"description":"生成数量","default":1}]
// @response     {"code":200,"message":"success","data":{"names":["张三"],"gender":"random","count":1}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const gender = params.gender || 'random';
    const count = Math.min(Math.max(parseInt(params.count) || 1, 1), 20);

    if (!['male', 'female', 'random'].includes(gender)) {
      return { code: 400, message: 'gender 参数无效，可选值: male, female, random', data: null };
    }

    try {
      const names = [];
      for (let i = 0; i < count; i++) {
        const g = gender === 'random' ? (Math.random() > 0.5 ? 'male' : 'female') : gender;
        names.push(generateName(g));
      }

      return {
        code: 200,
        message: 'success',
        data: { names, gender, count },
      };
    } catch (e) {
      return { code: 500, message: '生成失败: ' + e.message, data: null };
    }
  },
};

// 百家姓前100
const SURNAMES = [
  '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈',
  '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许',
  '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏',
  '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章',
  '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦',
  '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳',
  '丰', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺',
  '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常',
  '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余',
  '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹',
];

// 男性常用名（50个）
const MALE_NAMES = [
  '伟', '强', '磊', '军', '勇', '杰', '涛', '明', '辉', '鹏',
  '华', '飞', '刚', '林', '超', '志', '浩', '宇', '博', '文',
  '昊', '天', '翔', '龙', '峰', '毅', '达', '建', '国', '海',
  '波', '宁', '亮', '成', '凯', '东', '平', '山', '川', '瑞',
  '嘉', '泽', '晨', '旭', '阳', '旭', '彬', '然', '皓', '睿',
];

// 女性常用名（50个）
const FEMALE_NAMES = [
  '芳', '娜', '敏', '静', '丽', '秀', '娟', '英', '华', '慧',
  '巧', '美', '娜', '玉', '萍', '红', '娥', '玲', '琳', '素',
  '蓉', '洁', '瑶', '璐', '颖', '雪', '婷', '雅', '欣', '梦',
  '蕾', '倩', '琴', '诗', '月', '云', '薇', '佳', '晓', '涵',
  '怡', '馨', '晴', '依', '若', '雨', '彤', '妍', '琪', '媛',
];

function generateName(gender) {
  const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
  const namePool = gender === 'male' ? MALE_NAMES : FEMALE_NAMES;

  // 随机决定名字长度（1-2个字）
  const nameLength = Math.random() > 0.4 ? 2 : 1;
  let givenName = '';

  for (let i = 0; i < nameLength; i++) {
    givenName += namePool[Math.floor(Math.random() * namePool.length)];
  }

  return surname + givenName;
}
