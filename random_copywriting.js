// ==MuYunAPI==
// @name         随机文案接口
// @slug         random_copywriting
// @description  随机获取毒鸡汤、安慰文案、疯狂星期四文案，支持指定类型或随机返回
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"type","type":"string","required":false,"description":"文案类型：jitang（毒鸡汤）、anwei（安慰）、kfc（疯狂星期四）、random（随机）","example":"random"}]
// @response     {"code":200,"data":{"type":"jitang","content":"努力不一定成功，但不努力一定很轻松。"}}
// ==/MuYunAPI==

const axios = require('axios');

module.exports = {

  async execute(slug, params, req) {

    // 获取类型参数
    let type = (params && params.type || 'random').toLowerCase();

    // 支持类型
    const validTypes = ['jitang', 'anwei', 'kfc', 'random'];

    if (!validTypes.includes(type)) {
      return {
        code: 400,
        message: 'type参数错误，仅支持：jitang、anwei、kfc、random',
        data: null
      };
    }

    // 随机类型
    if (type === 'random') {
      const randomTypes = ['jitang', 'anwei', 'kfc'];
      type = randomTypes[Math.floor(Math.random() * randomTypes.length)];
    }

    try {

      let content = '';

      // =========================
      // 毒鸡汤
      // =========================
      if (type === 'jitang') {

        const response = await axios.get(
          'https://kaiwu.xxlb.org/api/jitang',
          {
            timeout: 10000
          }
        );

        if (response.data) {

          if (typeof response.data === 'string') {
            content = response.data.trim();
          }

          else if (response.data.data) {
            content = response.data.data;
          }

          else if (response.data.content) {
            content = response.data.content;
          }

          else if (response.data.msg) {
            content = response.data.msg;
          }

          else if (response.data.text) {
            content = response.data.text;
          }

        }

      }

      // =========================
      // 安慰文案
      // =========================
      else if (type === 'anwei') {

        const response = await axios.get(
          'https://v.api.aa1.cn/api/api-wenan-anwei/index.php?type=json',
          {
            timeout: 10000
          }
        );

        if (response.data) {

          if (typeof response.data === 'string') {
            content = response.data.trim();
          }

          else if (response.data.msg) {
            content = response.data.msg;
          }

          else if (response.data.text) {
            content = response.data.text;
          }

          else if (response.data.content) {
            content = response.data.content;
          }

          else if (response.data.data) {
            content = response.data.data;
          }

        }

      }

      // =========================
      // KFC疯狂星期四
      // =========================
      else if (type === 'kfc') {

        const response = await axios.get(
          'https://tools.mgtv100.com/external/v1/pear/kfc',
          {
            timeout: 10000
          }
        );

        if (response.data) {

          if (typeof response.data === 'string') {
            content = response.data.trim();
          }

          else if (response.data.data) {
            content = response.data.data;
          }

          else if (response.data.content) {
            content = response.data.content;
          }

          else if (response.data.msg) {
            content = response.data.msg;
          }

          else if (response.data.text) {
            content = response.data.text;
          }

        }

      }

      // 内容为空
      if (!content) {
        return {
          code: 500,
          message: '获取文案失败',
          data: null
        };
      }

      // 返回结果
      return {
        code: 200,
        message: 'success',
        data: {
          type,
          content
        }
      };

    } catch (e) {

      return {
        code: 500,
        message: '请求失败：' + (e.message || '未知错误'),
        data: null
      };

    }

  }

};