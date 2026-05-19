// ==MuYunAPI==
// @name         二维码生成
// @slug         qrtool_generate
// @description  调用 qrtool.cn 免费接口生成二维码。特点：无需鉴权、支持跨域、速度快。
// @category     4
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"text","type":"string","required":true,"description":"二维码内容（建议URL编码）","example":"Hello%20World"},{"name":"size","type":"number","required":false,"description":"尺寸(像素)，默认300","example":"500"},{"name":"margin","type":"number","required":false,"description":"留白边距(像素)，默认size*0.05","example":"20"},{"name":"level","type":"string","required":false,"description":"容错级别：L,M,Q,H，默认M","example":"H"}]
// @response     {"code":200,"message":"success","data":{"image_url":"https://api.qrtool.cn/?text=test"}}
// ==/MuYunAPI==

/**
 * 免费二维码生成接口
 * 文档：https://qrtool.cn/open/
 * 
 * 参数说明：
 * - text: 必填，二维码包含的内容
 * - size: 可选，尺寸，默认300
 * - margin: 可选，边距，默认为 size 的 5%
 * - level: 可选，容错率，默认 M
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    // 1. 参数提取（兼容两种签名）
    const text = params.text || slug;
    const size = params.size ? parseInt(params.size) : undefined;
    const margin = params.margin ? parseInt(params.margin) : undefined;
    const level = params.level || undefined; // L, M, Q, H

    // 必填校验
    if (!text) {
      return {
        code: 400,
        message: "缺少必要参数：text (二维码内容)",
        data: null,
      };
    }

    // 2. 构造上游请求参数
    // 注意：上游接口是直接通过 Query 参数传递的
    const upstreamParams = {
      text: text
    };

    // 只有传了值才加进去，避免覆盖上游默认值
    if (size) upstreamParams.size = size;
    if (margin) upstreamParams.margin = margin;
    if (level) upstreamParams.level = level;

    try {
      // 3. 调用上游 API
      // 注意：该接口直接返回图片流，但通常作为代理接口，我们返回请求该图片的 URL
      const baseUrl = "https://api.qrtool.cn/";

      // 拼接参数生成最终图片链接
      const url = new URL(baseUrl);
      Object.keys(upstreamParams).forEach(key => {
        url.searchParams.append(key, upstreamParams[key]);
      });

      // 4. 返回结果
      // 由于该接口直接输出图片，我们返回一个包含图片链接的对象
      // 调用者可以直接将此链接放入 img 标签的 src 中
      return {
        code: 200,
        message: "success",
        data: {
          // 返回生成的二维码图片地址
          qr_code_url: url.toString(),
          // 返回原始参数，方便调试
          params: upstreamParams
        }
      };

    } catch (e) {
      return {
        code: 500,
        message: '请求失败：' + (e.message || '网络错误'),
        data: null,
      };
    }
  }
};