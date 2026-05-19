// ==MuYunAPI==
// @name         BMI计算器
// @slug         bmi_calculator
// @description  输入身高和体重，计算BMI值，返回健康等级和建议
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"height","type":"number","required":true,"description":"身高（厘米）","example":170},{"name":"weight","type":"number","required":true,"description":"体重（公斤）","example":65}]
// @response     {"code":200,"message":"success","data":{"bmi":22.5,"level":"正常","advice":"您的体重在正常范围内，请继续保持健康的生活方式。"}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const height = parseFloat(params.height);
    const weight = parseFloat(params.weight);

    if (isNaN(height) || height <= 0) {
      return { code: 400, message: 'height 参数无效，请输入有效的身高（厘米）', data: null };
    }

    if (isNaN(weight) || weight <= 0) {
      return { code: 400, message: 'weight 参数无效，请输入有效的体重（公斤）', data: null };
    }

    if (height > 300) {
      return { code: 400, message: '身高数值异常，请确认单位为厘米', data: null };
    }

    if (weight > 500) {
      return { code: 400, message: '体重数值异常，请确认单位为公斤', data: null };
    }

    try {
      // BMI = 体重(kg) / 身高(m)^2
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      const bmiRounded = Math.round(bmi * 10) / 10;

      const result = getBMILevel(bmiRounded);

      return {
        code: 200,
        message: 'success',
        data: {
          bmi: bmiRounded,
          level: result.level,
          advice: result.advice,
          height: height,
          weight: weight,
          healthyRange: {
            min: Math.round(18.5 * heightM * heightM * 10) / 10,
            max: Math.round(23.9 * heightM * heightM * 10) / 10,
          },
        },
      };
    } catch (e) {
      return { code: 500, message: '计算失败: ' + e.message, data: null };
    }
  },
};

function getBMILevel(bmi) {
  if (bmi < 18.5) {
    return {
      level: '偏瘦',
      advice: '您的体重偏轻，建议增加营养摄入，适当进行力量训练，保持均衡饮食。',
    };
  } else if (bmi < 24) {
    return {
      level: '正常',
      advice: '您的体重在正常范围内，请继续保持健康的生活方式，注意饮食均衡和规律运动。',
    };
  } else if (bmi < 28) {
    return {
      level: '偏胖',
      advice: '您的体重略微偏高，建议适当控制饮食，增加有氧运动，保持健康体重。',
    };
  } else {
    return {
      level: '肥胖',
      advice: '您的体重超出正常范围较多，建议咨询医生或营养师，制定科学的减重计划。',
    };
  }
}
