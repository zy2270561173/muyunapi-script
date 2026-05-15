// ==MuYunAPI==
// @name         WHOIS域名信息查询
// @slug         whois_info
// @description  查询域名WHOIS信息（注册商、注册时间、到期时间、DNS等），基于本地whois命令解析
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"domain","type":"string","required":true,"description":"需要查询的域名","example":"qq.com"}]
// @response     {"code":200,"data":{"domain":"qq.com","registrar":"MarkMonitor Inc.","creation_date":"1998-11-02","expiration_date":"2030-11-02","name_servers":["ns1.qq.com","ns2.qq.com"],"status":["clientDeleteProhibited"],"raw":"..."}}
// ==/MuYunAPI==

const { exec } = require('child_process');

module.exports = {

  async execute(slug, params, req) {

    let domain = params && params.domain;

    // 参数校验
    if (!domain) {
      return {
        code: 400,
        message: '缺少必填参数：domain',
        data: null
      };
    }

    // 清洗域名
    domain = domain
      .replace(/^https?:\/\//, '')
      .split('/')[0]
      .trim()
      .toLowerCase();

    // 简单格式校验
    const domainRegex = /^(?!-)[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      return {
        code: 400,
        message: '域名格式不正确',
        data: null
      };
    }

    try {

      const raw = await new Promise((resolve, reject) => {

        // Linux / 宝塔环境需要安装 whois
        exec(`whois ${domain}`, { timeout: 10000 }, (err, stdout, stderr) => {

          if (err) return reject(err);

          resolve(stdout || stderr || '');

        });

      });

      if (!raw || raw.length < 10) {
        return {
          code: 500,
          message: 'WHOIS查询失败或返回为空',
          data: null
        };
      }

      // =========================
      // 解析 WHOIS（通用粗解析）
      // =========================

      const lines = raw.split('\n');

      let registrar = '';
      let creation_date = '';
      let expiration_date = '';
      let status = [];
      let name_servers = [];

      for (const line of lines) {

        const l = line.toLowerCase();

        // 注册商
        if (l.includes('registrar') && !registrar) {
          registrar = line.split(':')[1]?.trim();
        }

        // 注册时间
        if (
          l.includes('creation date') ||
          l.includes('created date') ||
          l.includes('registration time')
        ) {
          creation_date = line.split(':')[1]?.trim();
        }

        // 到期时间
        if (
          l.includes('registry expiry') ||
          l.includes('expiration date') ||
          l.includes('expiry date')
        ) {
          expiration_date = line.split(':')[1]?.trim();
        }

        // DNS
        if (l.includes('name server')) {
          const ns = line.split(':')[1]?.trim();
          if (ns) name_servers.push(ns);
        }

        // 状态
        if (l.includes('status:')) {
          const st = line.split(':')[1]?.trim();
          if (st) status.push(st);
        }
      }

      return {
        code: 200,
        message: 'success',
        data: {
          domain,
          registrar: registrar || 'unknown',
          creation_date: creation_date || 'unknown',
          expiration_date: expiration_date || 'unknown',
          name_servers,
          status,
          raw
        }
      };

    } catch (e) {

      return {
        code: 500,
        message: 'WHOIS查询失败：' + (e.message || '未知错误'),
        data: null
      };

    }

  }

};