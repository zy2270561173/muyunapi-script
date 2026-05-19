// ==MuYunAPI==
// @name         名侦探柯南名言
// @slug         conan_quotes
// @description  随机获取《名侦探柯南》中的经典语录，支持中日双语及角色搜索
// @category     1
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        dark
// @params       [{"name":"la","type":"string","required":false,"description":"语言类型","example":"c","default":"al","options":["c","j","al"]},{"name":"qu","type":"string","required":false,"description":"角色搜索","example":"柯南"},{"name":"s","type":"string","required":false,"description":"内容关键词","example":"真相"},{"name":"n","type":"int","required":false,"description":"返回数量","example":"5","default":"1"}]
// @response     {"code":200,"data":{"id":123,"quote":"真相只有一个！","japanese":"真実はいつも一つ！","character":"江户川柯南","_signature":{"api":"MuYunApi","source":"cqs.muysky.cn"}}}
// ==/MuYunAPI==

/**
 * 名侦探柯南名言接口
 * 文档：https://cqs.muysky.cn/api
 * 
 * 功能：从公开的柯南API获取名言数据
 * 
 * 参数说明：
 * - la: 语言 (c=中文, j=日文, al=全部)
 * - qu: 角色名模糊搜索
 * - s: 名言内容关键词搜索
 * - n: 返回数量 (随机模式下最大20)
 */

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    // 构建上游 API URL
    // 根据文档，随机接口为 /api/quotes/random
    let url = 'https://cqs.muysky.cn/api/quotes/random';
    
    const queryParams = [];
    
    // 处理可选参数
    if (params.la) {
      // 限制参数范围
      if (['c', 'j', 'al'].includes(params.la)) {
        queryParams.push(`la=${params.la}`);
      }
    }
    
    if (params.qu) {
      queryParams.push(`qu=${encodeURIComponent(params.qu)}`);
    }
    
    if (params.) {
      queryParams.push(`s=${encodeURIComponent(params.)}`);
    }
    
    if (params.n) {
      const num = parseInt(params.n);
      // 随机接口最大限制为20
      if (num > 0 && num <= 20) {
        queryParams.push(`n=${num}`);
      }
    }

    // 拼接参数
    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        // 如果返回的是数组（多条数据）或者对象（单条数据），都希望能统一处理
        // 这里直接透传数据，不做过多处理，保持原汁原味
      });

      // 根据上游文档，如果是单条数据，通常直接返回对象
      // 如果是多条（n>1），返回的是 { count, quotes } 结构
      // 我们将数据原样返回，但确保格式统一
      if (response.data) {
        return {
          code: 200,
          message: 'success',
          data: response.data
        };
      } else {
        return {
          code: 502,
          message: '上游数据解析失败',
          data: null
        };
      }
    } catch (e) {
      return {
        code: 500,
        message: '请求错误：' + (e.message || '网络异常'),
        data: null
      };
    }
  }
};
