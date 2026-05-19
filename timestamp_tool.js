// ==MuYunAPI==
// @name         时间戳工具
// @slug         timestamp_tool
// @description  获取当前时间戳 / 时间转换工具
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"type","type":"string","required":false,"description":"now / toTimestamp / toDate","example":"now"},{"name":"value","type":"string","required":false,"description":"时间或时间戳","example":"1710000000"}]
// @response     {"code":200,"data":{"timestamp":1710000000,"date":"2026-05-15 12:00:00"}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params) {

    const type = params.type || 'now';
    const value = params.value;

    const format = (d) => {
      return d.toISOString().replace('T', ' ').substring(0, 19);
    };

    if (type === 'now') {
      const now = Date.now();
      return {
        code: 200,
        message: 'success',
        data: {
          timestamp: Math.floor(now / 1000),
          date: format(new Date())
        }
      };
    }

    if (type === 'toTimestamp') {
      const ts = Math.floor(new Date(value).getTime() / 1000);
      return {
        code: 200,
        message: 'success',
        data: { timestamp: ts }
      };
    }

    if (type === 'toDate') {
      const d = new Date(Number(value) * 1000);
      return {
        code: 200,
        message: 'success',
        data: {
          date: format(d)
        }
      };
    }

    return {
      code: 400,
      message: 'type参数错误',
      data: null
    };
  }
};