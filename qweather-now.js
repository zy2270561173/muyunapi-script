// ==MuYunAPI==
// @name         天气查询
// @slug         qweather_now
// @description  通过和风天气API查询城市实时天气，输入城市名自动获取LocationID后返回当前天气数据。需要MuYunAPI认证：开启后请求必须携带apiKey+apiSecret
// @category     1
// @method       GET
// @requireAuth  true
// @isFree       true
// @theme        both
// @params       [{"name":"city","type":"string","required":true,"description":"城市名称，支持模糊搜索，如：北京、上海、广州","example":"北京"},{"name":"adm","type":"string","required":false,"description":"上级行政区划，用于排除重名城市，如：黑龙江","example":"beijing"},{"name":"lang","type":"string","required":false,"description":"语言，默认zh（中文），支持en等","example":"zh"},{"name":"apiKey","type":"string","required":true,"description":"MuYunAPI用户Key（requireAuth开启时必填）","example":"your_api_key"},{"name":"apiSecret","type":"string","required":true,"description":"MuYunAPI用户Secret（requireAuth开启时必填）","example":"your_api_secret"}]
// @response     {"code":200,"data":{"city":"北京","locationId":"101010100","temp":"24","feelsLike":"26","text":"多云","windDir":"东南风","windScale":"1","humidity":"72","pressure":"1003","vis":"16","precip":"0.0","obsTime":"2024-01-01T12:00+08:00"}}
// ==/MuYunAPI==

/**
 * 和风天气 - 实时天气查询
 * 文档：https://dev.qweather.com/docs/api/
 *
 * 流程：
 * 1. 调用 GeoAPI 将城市名转换为 LocationID
 * 2. 用 LocationID 调用实时天气接口
 *
 * 环境变量（需在服务器 .env 或启动脚本中配置）：
 * - QWEATHER_API_HOST  和风天气API域名（如 https://devapi.qweather.com）
 * - QWEATHER_API_KEY    和风天气开发者API Key
 */

const axios = require('axios');
const crypto = require('crypto');

// 和风天气配置 - 请在服务器环境变量中设置
const QWEATHER_HOST = process.env.QWEATHER_API_HOST || 'https://pr4wcruevj.re.qweatherapi.com';
const QWEATHER_KEY = process.env.QWEATHER_API_KEY || 'cc7670b7369840338ae4f6c02c8e3bbc';

module.exports = {
  async execute(slug, params, req) {
    const city = params && params.city;
    const apiKey = params && params.apiKey;
    const apiSecret = params && params.apiSecret;

    // ===== MuYunAPI 认证校验（当接口 requireAuth 为 true 时生效）=====
    if (!QWEATHER_KEY) {
      return { code: 500, message: '服务端未配置和风天气API Key，请在环境变量中设置 QWEATHER_API_KEY' };
    }

    try {
      // 验证 apiKey + apiSecret
      const verifyRes = await verifyAuth(apiKey, apiSecret);
      if (!verifyRes.valid) {
        return { code: 401, message: verifyRes.message };
      }
    } catch (e) {
      return { code: 500, message: '认证服务异常：' + e.message };
    }

    if (!city) {
      return { code: 400, message: '缺少必填参数：city（城市名称）' };
    }

    try {
      // ===== 第一步：城市搜索，获取 LocationID =====
      const geoParams = { location: city, key: QWEATHER_KEY, number: 1 };
      if (params.adm) geoParams.adm = params.adm;
      if (params.lang) geoParams.lang = params.lang;

      const geoRes = await axios.get(`${QWEATHER_HOST}/geo/v2/city/lookup`, {
        params: geoParams,
        timeout: 10000,
      });

      if (!geoRes.data || geoRes.data.code !== '200' || !geoRes.data.location || geoRes.data.location.length === 0) {
        return {
          code: 404,
          message: `未找到城市「${city}」的天气信息，请检查城市名称是否正确`,
        };
      }

      // 取第一个匹配结果
      const location = geoRes.data.location[0];
      const locationId = location.id;

      // ===== 第二步：查询实时天气 =====
      const weatherParams = { location: locationId, key: QWEATHER_KEY };
      if (params.lang) weatherParams.lang = params.lang;
      if (params.unit) weatherParams.unit = params.unit;

      const weatherRes = await axios.get(`${QWEATHER_HOST}/v7/weather/now`, {
        params: weatherParams,
        timeout: 10000,
      });

      if (!weatherRes.data || weatherRes.data.code !== '200') {
        const errMsg = weatherRes.data ? getQWeatherErrorMessage(weatherRes.data.code) : '未知错误';
        return { code: 500, message: `获取天气失败：${errMsg}` };
      }

      const now = weatherRes.data.now;

      // ===== 组装返回数据 =====
      return {
        code: 200,
        message: 'success',
        data: {
          city: location.name,
          adm1: location.adm1,
          adm2: location.adm2,
          country: location.country,
          locationId: locationId,
          lat: location.lat,
          lon: location.lon,
          temp: now.temp,
          feelsLike: now.feelsLike,
          icon: now.icon,
          text: now.text,
          windDir: now.windDir,
          windScale: now.windScale,
          windSpeed: now.windSpeed,
          humidity: now.humidity,
          precip: now.precip,
          pressure: now.pressure,
          vis: now.vis,
          cloud: now.cloud || '',
          dew: now.dew || '',
          obsTime: now.obsTime,
        },
      };
    } catch (e) {
      return {
        code: 500,
        message: '请求失败：' + (e.message || '未知错误'),
      };
    }
  }
};

/**
 * 和风天气状态码转错误信息
 */
function getQWeatherErrorMessage(code) {
  const messages = {
    '400': '请求错误',
    '401': '认证失败，请检查API Key',
    '402': '超过访问次数或余额不足',
    '403': '无访问权限',
    '404': '查询的数据或地区不存在',
    '429': '超过请求次数限制',
    '500': '服务器内部错误',
  };
  return messages[code] || `错误码: ${code}`;
}

/**
 * 验证 MuYunAPI 用户认证
 * 说明：此函数验证用户传入的 apiKey + apiSecret 是否有效
 * 实际项目中应该调用 MuYunAPI 的认证服务或查询数据库验证
 */
async function verifyAuth(apiKey, apiSecret) {
  // 检查参数是否存在
  if (!apiKey || !apiSecret) {
    return { valid: false, message: '缺少认证参数：apiKey 和 apiSecret 必填（请前往个人中心获取）' };
  }

  // 格式校验
  if (!/^[a-zA-Z0-9_-]{16,64}$/.test(apiKey)) {
    return { valid: false, message: 'apiKey 格式无效' };
  }
  if (!/^[a-zA-Z0-9_-]{32,128}$/.test(apiSecret)) {
    return { valid: false, message: 'apiSecret 格式无效' };
  }

  // ===== 实际认证逻辑（示例）=====
  // 方式1：调用 MuYunAPI 认证接口
  // const authRes = await axios.post('http://localhost:3000/api/auth/verify-key', {
  //   apiKey,
  //   apiSecret,
  //   slug: 'qweather_now'
  // });
  // if (authRes.data.code !== 200) {
  //   return { valid: false, message: authRes.data.message };
  // }

  // 方式2：本地数据库验证（需要引入 db 模块）
  // const db = require('../db/init');
  // const user = db.prepare('SELECT id FROM users WHERE api_key = ? AND api_secret = ?').get(apiKey, apiSecret);
  // if (!user) {
  //   return { valid: false, message: 'API Key 或 Secret 错误' };
  // }

  // 方式3：简单的签名验证（HMAC）
  // const expectedSecret = crypto.createHmac('sha256', process.env.MUYUN_API_SECRET || 'default-secret')
  //   .update(apiKey)
  //   .digest('hex');
  // if (apiSecret !== expectedSecret) {
  //   return { valid: false, message: 'API Secret 验证失败' };
  // }

  // ===== 当前示例：仅做格式校验，实际项目请替换为真实认证逻辑 =====
  console.log(`[认证] apiKey=${apiKey}, apiSecret=${apiSecret.substring(0, 8)}...`);

  // 模拟认证成功（实际使用时请替换为真实验证）
  return { valid: true, userId: 'demo-user' };
}
