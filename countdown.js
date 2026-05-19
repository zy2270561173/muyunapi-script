// ==MuYunAPI==
// @name         倒计时纪念日
// @slug         countdown
// @description  输入目标日期和事件名称，计算距今天数、周数、月数
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"date","type":"string","required":true,"description":"目标日期，格式YYYY-MM-DD","example":"2025-01-01"},{"name":"name","type":"string","required":false,"description":"事件名称","default":"目标日期"},{"name":"past","type":"boolean","required":false,"description":"是否是过去的日期","default":false}]
// @response     {"code":200,"message":"success","data":{"name":"新年","date":"2025-01-01","days":30,"weeks":4,"months":1,"totalHours":720}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const dateStr = params.date;
    const name = params.name || '目标日期';
    const past = params.past === 'true' || params.past === true;

    if (!dateStr) {
      return { code: 400, message: '缺少必填参数: date', data: null };
    }

    const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return { code: 400, message: '日期格式无效，请使用 YYYY-MM-DD 格式', data: null };
    }

    try {
      const targetDate = new Date(dateStr + 'T00:00:00');
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (isNaN(targetDate.getTime())) {
        return { code: 400, message: '日期无效', data: null };
      }

      const diffMs = Math.abs(targetDate.getTime() - now.getTime());
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      const diffWeeks = Math.floor(diffDays / 7);
      const totalHours = diffDays * 24;

      // 计算月数（近似）
      let diffMonths;
      if (targetDate > now) {
        diffMonths = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
        if (targetDate.getDate() < now.getDate()) diffMonths--;
      } else {
        diffMonths = (now.getFullYear() - targetDate.getFullYear()) * 12 + (now.getMonth() - targetDate.getMonth());
        if (now.getDate() < targetDate.getDate()) diffMonths--;
      }

      // 判断方向
      const isFuture = targetDate > now;
      const direction = past ? '已经过去' : (isFuture ? '还有' : '已经过去');

      // 构建描述文本
      let description;
      if (diffDays === 0) {
        description = `「${name}」就是今天！`;
      } else {
        description = `「${name}」${direction} ${diffDays} 天`;
        if (diffWeeks > 0) {
          description += `（约 ${diffWeeks} 周`;
          if (diffMonths > 0) {
            description += ` / ${diffMonths} 个月`;
          }
          description += '）';
        }
      }

      return {
        code: 200,
        message: 'success',
        data: {
          name,
          date: dateStr,
          today: now.toISOString().split('T')[0],
          days: diffDays,
          weeks: diffWeeks,
          months: Math.max(diffMonths, 0),
          totalHours,
          description,
          isFuture,
        },
      };
    } catch (e) {
      return { code: 500, message: '计算失败: ' + e.message, data: null };
    }
  },
};
