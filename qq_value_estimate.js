// ==MuYunAPI==
// @name         QQ号价值评估
// @slug         qq_value_estimate
// @description  本地算法评估QQ号价值、稀有度、年代、靓号等级与幸运值.
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"qq","type":"string","required":true,"description":"需要评估的QQ号","example":"1011"}]
// @response     {"code":200,"data":{"qq":"2823280574","score":87,"level":"稀有靓号","estimate_year":"2012左右","value":"￥120-300","luck":"大吉","tags":["双2","双8","10位QQ"],"analysis":"该QQ号结构较顺，重复数字较多，具有一定收藏价值。"}} 
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {

    const qq = params && params.qq;

    // QQ校验
    if (!qq) {
      return {
        code: 400,
        message: '缺少必填参数：qq',
        data: null
      };
    }

    const qqRegex = /^[1-9][0-9]{4,10}$/;

    if (!qqRegex.test(qq)) {
      return {
        code: 400,
        message: 'QQ号格式不正确',
        data: null
      };
    }

    // =========================
    // 开始分析
    // =========================

    let score = 50;
    let tags = [];

    const len = qq.length;

    // 位数分析
    if (len <= 5) {
      score += 50;
      tags.push('远古5位');
    } else if (len == 6) {
      score += 40;
      tags.push('6位老QQ');
    } else if (len == 7) {
      score += 30;
      tags.push('7位经典QQ');
    } else if (len == 8) {
      score += 20;
      tags.push('8位QQ');
    } else if (len == 9) {
      score += 10;
      tags.push('9位QQ');
    } else {
      tags.push('10位QQ');
    }

    // 重复数字检测
    const countMap = {};

    for (const c of qq) {
      countMap[c] = (countMap[c] || 0) + 1;
    }

    for (const num in countMap) {
      const count = countMap[num];

      if (count >= 2) {
        tags.push(`双${num}`);
        score += count * 2;
      }

      if (count >= 3) {
        tags.push(`豹子${num}`);
        score += 10;
      }

      if (count >= 4) {
        tags.push(`超级豹子${num}`);
        score += 20;
      }
    }

    // 顺子检测
    if (
      qq.includes('123') ||
      qq.includes('234') ||
      qq.includes('345') ||
      qq.includes('456') ||
      qq.includes('567') ||
      qq.includes('678') ||
      qq.includes('789')
    ) {
      score += 15;
      tags.push('顺子号');
    }

    // 回文检测
    const reversed = qq.split('').reverse().join('');

    if (qq === reversed) {
      score += 25;
      tags.push('回文号');
    }

    // AABB检测
    if (/(\d)\1(\d)\2/.test(qq)) {
      score += 20;
      tags.push('AABB结构');
    }

    // AAA检测
    if (/(\d)\1\1/.test(qq)) {
      score += 15;
      tags.push('AAA结构');
    }

    // 888/666 特殊加分
    if (qq.includes('888')) {
      score += 20;
      tags.push('发财号');
    }

    if (qq.includes('666')) {
      score += 15;
      tags.push('牛号');
    }

    // 幸运值
    let luck = '普通';

    if (score >= 120) {
      luck = '天选之号';
    } else if (score >= 100) {
      luck = '大吉';
    } else if (score >= 80) {
      luck = '中吉';
    } else if (score >= 60) {
      luck = '小吉';
    }

    // 等级
    let level = '普通QQ';

    if (score >= 130) {
      level = '神级靓号';
    } else if (score >= 110) {
      level = '极品靓号';
    } else if (score >= 90) {
      level = '稀有靓号';
    } else if (score >= 70) {
      level = '优质QQ';
    }

    // 年代估算
    let estimateYear = '';

    switch (len) {
      case 5:
        estimateYear = '1999-2000';
        break;
      case 6:
        estimateYear = '2000-2002';
        break;
      case 7:
        estimateYear = '2002-2005';
        break;
      case 8:
        estimateYear = '2005-2008';
        break;
      case 9:
        estimateYear = '2008-2012';
        break;
      case 10:
        estimateYear = '2012左右';
        break;
      default:
        estimateYear = '较新QQ';
    }

    // 价值估算
    let value = '￥5以下';

    if (score >= 130) {
      value = '￥5000+';
    } else if (score >= 110) {
      value = '￥1000-5000';
    } else if (score >= 90) {
      value = '￥120-1000';
    } else if (score >= 70) {
      value = '￥30-120';
    } else if (score >= 60) {
      value = '￥10-30';
    }

    // AI风格分析文案
    let analysis = '';

    if (score >= 120) {
      analysis = '此号极其稀有，属于高价值靓号，疑似网吧大神或远古用户专属。';
    } else if (score >= 90) {
      analysis = '该QQ号结构优秀，重复数字较多，具有一定收藏价值。';
    } else if (score >= 70) {
      analysis = '该QQ号整体较顺，属于质量不错的普通靓号。';
    } else {
      analysis = '该QQ号较为普通，但也许承载着青春回忆。';
    }

    // 分数限制
    if (score > 150) {
      score = 150;
    }

    return {
      code: 200,
      message: 'success',
      data: {
        qq,
        score,
        level,
        estimate_year: estimateYear,
        value,
        luck,
        tags,
        analysis
      }
    };

  }
};