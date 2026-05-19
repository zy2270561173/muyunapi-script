/**
 * MuYunAPI 示例内置库脚本
 * 
 * 本文件用于演示动态脚本的编写规范
 * 上传后系统会自动加载并执行
 */

module.exports = {
  // 接口元数据定义
  apis: [
    {
      name: '随机UUID',
      slug: 'uuid',
      category_id: 6,
      description: '生成符合 RFC 4122 标准的 UUID v4',
      endpoint: 'local://uuid',
      method: 'GET',
      params: [
        { name: '无参数', type: 'string', required: false, description: '无需传参，直接调用即可生成 UUID', example: '' },
      ],
      is_free: 1,
      require_auth: 0,
    },
    {
      name: '随机整数',
      slug: 'random-int',
      category_id: 6,
      description: '生成指定范围内的随机整数',
      endpoint: 'local://random-int',
      method: 'GET',
      params: [
        { name: 'min', type: 'number', required: false, description: '最小值（默认0）', example: '1' },
        { name: 'max', type: 'number', required: false, description: '最大值（默认100）', example: '100' },
      ],
      is_free: 1,
      require_auth: 0,
    },
    {
      name: '时间戳转换',
      slug: 'timestamp',
      category_id: 6,
      description: '获取当前时间戳或转换指定时间',
      endpoint: 'local://timestamp',
      method: 'GET',
      params: [
        { name: 'format', type: 'string', required: false, description: '格式：unix/ms/s（默认unix）', example: 'ms' },
        { name: 'datetime', type: 'string', required: false, description: '要转换的日期时间（可选）', example: '2024-01-01 00:00:00' },
      ],
      is_free: 1,
      require_auth: 0,
    },
  ],

  // 执行接口逻辑
  // @param {string} slug - 接口标识
  // @param {object} params - 请求参数
  // @param {object} req - Express 请求对象（可选）
  async execute(slug, params = {}, req = null) {
    const handlers = {
      'uuid': () => {
        const { v4: uuidv4 } = require('uuid');
        return { uuid: uuidv4() };
      },
      'random-int': () => {
        const min = parseInt(params.min) || 0;
        const max = parseInt(params.max) || 100;
        return { number: Math.floor(Math.random() * (max - min + 1)) + min };
      },
      'timestamp': () => {
        const format = params.format || 'unix';
        const datetime = params.datetime;
        let date = datetime ? new Date(datetime) : new Date();
        
        return {
          timestamp: format === 'ms' ? date.getTime() : Math.floor(date.getTime() / 1000),
          datetime: date.toLocaleString('zh-CN'),
          iso: date.toISOString(),
        };
      },
    };

    const handler = handlers[slug];
    if (!handler) {
      throw new Error('未知的接口：' + slug);
    }

    return handler();
  },
};
