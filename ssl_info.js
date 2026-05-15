// ==MuYunAPI==
// @name         SSL证书查询
// @slug         ssl_info
// @description  获取网站SSL证书信息（颁发机构、有效期、剩余天数、协议版本），本地TLS直连查询
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"domain","type":"string","required":true,"description":"需要查询SSL的域名","example":"qq.com"}]
// @response     {"code":200,"data":{"domain":"qq.com","issuer":"DigiCert Inc","subject":"*.qq.com","valid_from":"2025-01-01","valid_to":"2026-01-01","days_left":188,"protocol":"TLSv1.3","valid":true}}
// ==/MuYunAPI==

const tls = require('tls');

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

    // 简单域名清洗
    domain = domain.replace(/^https?:\/\//, '').split('/')[0];

    try {

      const options = {
        host: domain,
        port: 443,
        servername: domain,
        rejectUnauthorized: false,
        timeout: 10000
      };

      const certInfo = await new Promise((resolve, reject) => {

        const socket = tls.connect(options, () => {

          const cert = socket.getPeerCertificate(true);

          if (!cert || !cert.valid_from) {
            socket.end();
            return reject(new Error('无法获取证书信息'));
          }

          const now = new Date();
          const validTo = new Date(cert.valid_to);
          const validFrom = new Date(cert.valid_from);

          const daysLeft = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));

          resolve({
            domain,
            issuer: cert.issuer && cert.issuer.O || cert.issuer.CN || 'unknown',
            subject: cert.subject && cert.subject.CN || 'unknown',
            valid_from: validFrom.toISOString(),
            valid_to: validTo.toISOString(),
            days_left: daysLeft,
            protocol: socket.getProtocol(),
            valid: daysLeft > 0
          });

          socket.end();
        });

        socket.setTimeout(10000, () => {
          socket.destroy();
          reject(new Error('连接超时'));
        });

        socket.on('error', (err) => {
          reject(err);
        });

      });

      return {
        code: 200,
        message: 'success',
        data: certInfo
      };

    } catch (e) {

      return {
        code: 500,
        message: 'SSL查询失败：' + (e.message || '未知错误'),
        data: null
      };

    }

  }

};