// ==MuYunAPI==
// @name         QQ号信息
// @slug         qq_info
// @description  获取指定QQ号的基本信息，包括昵称、头像、等级、注册时间等
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"qq","type":"string","required":true,"description":"需要查询的QQ号","example":"10001"}]
// @response     {"code":200,"data":{"qq":"10001","nickname":"腾讯客服","avatar":"https://q1.qlogo.cn/g?b=qq&nk=10001&s=640","level":100,"reg_time":"2000-01-01"}}
// ==/MuYunAPI==

/**
 * QQ号信息获取接口
 * 文档：https://www.devtool.top/doc/qq/info.html
 * 
 * 参数说明：
 * - qq: 需要查询的QQ号（必填）
 * 
 * 调用示例：
 * GET https://your-domain/api/qq_info?qq=10001
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    // 从 params 中提取 QQ 号
    const qq = params && params.qq;

    // 验证 QQ 号是否提供
    if (!qq) {
      return {
        code: 400,
        message: '缺少必填参数：qq',
        data: null,
      };
    }

    // 简单的 QQ 号格式校验（5-11位纯数字）
    const qqRegex = /^[1-9][0-9]{4,10}$/;
    if (!qqRegex.test(qq)) {
      return {
        code: 400,
        message: 'QQ号格式不正确，请输入5-11位的数字',
        data: null,
      };
    }

    try {
      // 调用上游 API
      const response = await axios.get(`https://api.devtool.top/qq/info?qq=${qq}`, {
        timeout: 10000,
      });

      // 根据 DevTool 文档，通常返回格式为 { code: 200, msg: "success", data: {...} }
      if (response.data && response.data.code === 200) {
        return {
          code: 200,
          data: response.data.data,
          message: 'success',
        };
      } else {
        return {
          code: 500,
          message: response.data.msg || '上游接口返回异常',
          data: null,
        };
      }
    } catch (e) {
      return {
        code: 500,
        message: '请求失败：' + (e.message || '未知错误'),
        data: null,
      };
    }
  }
};