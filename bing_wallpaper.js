// ==MuYunAPI==
// @name         Bing必应每日壁纸
// @slug         bing_wallpaper
// @description  获取Bing每日高清壁纸，支持返回JSON数据或直接重定向到图片。支持自定义分辨率和日期。
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"type","type":"string","required":false,"description":"返回类型，json(默认)返回数据，img直接重定向到图片","example":"json"},{"name":"idx","type":"string","required":false,"description":"日期偏移，0为今天，1为昨天，以此类推，最大支持16","example":"0"},{"name":"resolution","type":"string","required":false,"description":"图片分辨率，默认1920x1080，可选UHD(4K)","example":"1920x1080"}]
// @response     {"code":200,"data":{"url":"https://cn.bing.com/th?id=OHR.XXX_1920x1080.jpg","copyright":"图片版权信息","date":"20260514"}}
// ==/MuYunAPI==

const axios = require('axios');

module.exports = {
  async execute(slug, params, req) {
    // 获取参数
    const type = (params.type || 'json').toLowerCase();
    const idx = params.idx || '0'; // 0=今天, 1=昨天...
    const resolution = params.resolution || '1920x1080'; // 默认1080P

    try {
      // 请求 Bing 官方接口获取图片元数据
      const response = await axios.get('https://www.bing.com/HPImageArchive.aspx', {
        params: {
          format: 'js',
          idx: idx,
          n: 1
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      });

      const images = response.data.images;
      if (!images || images.length === 0) {
        return { code: 404, message: '未获取到壁纸数据，请稍后重试' };
      }

      const image = images[0];
      // 拼接完整的图片链接
      const imageUrl = `https://www.bing.com${image.urlbase}_${resolution}.jpg`;

      // 如果请求类型为 img，直接重定向到图片地址
      if (type === 'img') {
        return {
          _redirect: imageUrl 
        };
      }

      // 默认返回 JSON 格式数据
      return {
        code: 200,
        message: 'success',
        data: {
          url: imageUrl,
          copyright: image.copyright,        // 图片描述/版权信息
          copyrightlink: image.copyrightlink,// 版权相关链接
          date: image.startdate,             // 图片日期
          title: image.title || '',          // 图片标题
          quiz: image.quiz || ''             // 每日一题链接
        }
      };

    } catch (error) {
      return {
        code: 500,
        message: '获取Bing壁纸失败：' + (error.message || '未知错误')
      };
    }
  }
};