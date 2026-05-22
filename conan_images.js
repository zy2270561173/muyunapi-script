// ==MuYunAPI==
// @name         名侦探柯南图集
// @slug         conan_images
// @description  随机获取《名侦探柯南》高清图片，支持PC/移动端分类、自定义数量及多种返回格式
// @category     1
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        dark
// @params       [{"name":"ap","type":"string","required":false,"description":"图片来源：pc=电脑版, mb=手机版","example":"mb","default":"pc"},{"name":"n","type":"int","required":false,"description":"返回图片数量（1-20）","example":"3","default":"1"},{"name":"type","type":"string","required":false,"description":"返回格式：json/url/base64/img","example":"json","default":"json"}]
// @response     {"code":200,"data":{"n_param":1,"ap":"pc","count":1,"images":[{"index_in_n":0,"original_name":"conan_abc.jpg","url":"http://..."}]}}
// ==/MuYunAPI==

/**
 * 名侦探柯南图集接口 (对接本地 Node.js 服务)
 * 
 * 上游端点（你的 Node.js 服务）：
 *   GET http://localhost:4605/
 * 
 * 参数映射：
 *   ap(来源分类) n(数量) type(返回格式)
 */

const axios = require('axios');

// ⚠️ 注意：如果你在 MuYunAPI 平台上部署此脚本，请将 localhost 替换为你 FRP 穿透后的公网 IP 和端口
// 例如：const BASE_URL = 'http://111.170.155.145:4605';
const BASE_URL = 'https://cnd.muysky.cn';

const VALID_AP = ['pc', 'mb'];
const VALID_TYPE = ['json', 'url', 'base64', 'img'];

module.exports = {
  async execute(slug, params, req) {
    const qp = {};

    // 映射 ap 参数 (pc / mb)
    if (params.ap && VALID_AP.includes(params.ap)) {
      qp.ap = params.ap;
    } else {
      qp.ap = 'pc'; // 默认 PC 端图片
    }

    // 映射 type 参数 (json / url / base64 / img)
    if (params.type && VALID_TYPE.includes(params.type)) {
      qp.type = params.type;
    } else {
      qp.type = 'json'; // 默认返回 JSON
    }

    // 映射并限制 n 参数 (数量)
    if (params.n) {
      const num = parseInt(params.n);
      if (num > 0) {
        // 限制最大数量为 20，防止单次请求过多
        qp.n = Math.min(num, 20); 
      }
    }

    try {
      // 发起请求到你的本地 Node.js 服务
      const response = await axios.get(BASE_URL, {
        params: qp,
        timeout: 10000, // 10秒超时
      });

      return {
        code: 200,
        message: 'success',
        data: response.data, // 直接透传你 Node.js 服务返回的 JSON 数据
      };
    } catch (e) {
      return {
        code: 502,
        message: '上游图集服务请求失败：' + (e.message || '请检查你的 Node.js 服务是否已启动'),
        data: null,
      };
    }
  },
};
