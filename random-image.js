// ==MuYunAPI==
// @name         栗次元图片
// @slug         clhestnut_dimension
// @description  随机返回一张图片，支持14种分类：通用/AI/AI壁纸/崩坏/风景/风景壁纸/平面/动漫/动漫壁纸/美女/头像/小红书/原神/原神壁纸
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"category","type":"string","required":false,"description":"图片分类：pc/ai/aimp/bd/fj/fjmp/lai/moe/moemp/mp/tx/xhl/ys/ysmp","example":"pc"},{"name":"count","type":"number","required":false,"description":"返回数量，默认1","example":"3"}]
// @response     {"code":200,"category":"pc","count":1,"data":{"id":"86","link":"https://tc.alcy.cc/tc/20260121/example.webp"}}
// ==/MuYunAPI==

/**
 * 随机图片接口
 * 文档：https://t.alcy.cc/docs.html
 * 
 * 参数说明：
 * - category: 图片分类（可选，默认 pc）
 *   pc=通用 | ai=AI | aimp=AI壁纸 | bd=崩坏 | fj=风景 | fjmp=风景壁纸
 *   lai=平面 | moe=动漫 | moemp=动漫壁纸 | mp=美女 | tx=头像 | xhl=小红书 | ys=原神 | ysmp=原神壁纸
 * - count: 返回数量（可选，默认1）
 * 
 * 调用示例：
 * GET https://t.alcy.cc/json?pc     -> 返回1张通用图片
 * GET https://t.alcy.cc/json?pc=3    -> 返回3张通用图片
 * GET https://t.alcy.cc/json?moe=5  -> 返回5张动漫图片
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    // 有效的分类列表
    const validCategories = ['pc', 'ai', 'aimp', 'bd', 'fj', 'fjmp', 'lai', 'moe', 'moemp', 'mp', 'tx', 'xhl', 'ys', 'ysmp'];

    // 从 params 中提取分类和数量（兼容两种签名）
    // 参数格式：{ pc: "3" } 或 { category: "pc", count: "3" }
    let category = (params && params.category) || 'pc';
    let count = parseInt(params && params.count) || 1;

    // 兼容直接传分类名作为 key 的方式
    if (params) {
      for (const cat of validCategories) {
        if (params[cat] !== undefined) {
          category = cat;
          count = parseInt(params[cat]) || 1;
          break;
        }
      }
    }

    // 验证分类
    if (!validCategories.includes(category)) {
      return {
        code: 400,
        message: `无效的分类，支持：${validCategories.join(' | ')}`,
        data: null,
      };
    }

    // 限制数量范围
    count = Math.min(Math.max(count, 1), 30);

    try {
      // 调用上游 API
      const response = await axios.get(`https://t.alcy.cc/json?${category}=${count}`, {
        timeout: 10000,
      });

      if (response.data && response.data.code === 200) {
        return {
          code: 200,
          category: category,
          count: count,
          data: response.data.data,
          message: 'success',
        };
      } else {
        return {
          code: 500,
          message: '上游接口返回异常',
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
