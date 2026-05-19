// ==MuYunAPI==
// @name         颜色格式转换
// @slug         color_convert
// @description  在HEX、RGB、HSL颜色格式之间互相转换
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"color","type":"string","required":true,"description":"颜色值，支持HEX(#ff6600)、RGB(255,102,0)、HSL(24,100%,50%)格式","example":"#ff6600"},{"name":"to","type":"string","required":false,"description":"目标格式","default":"rgb","options":["rgb","hsl","hex"]}]
// @response     {"code":200,"message":"success","data":{"original":"#ff6600","rgb":"rgb(255, 102, 0)","hsl":"hsl(24, 100%, 50%)","hex":"#ff6600"}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const color = (params.color || '').trim();
    const to = (params.to || 'rgb').toLowerCase();

    if (!color) {
      return { code: 400, message: '缺少必填参数: color', data: null };
    }

    if (!['rgb', 'hsl', 'hex'].includes(to)) {
      return { code: 400, message: 'to 参数无效，可选值: rgb, hsl, hex', data: null };
    }

    try {
      let r, g, b;

      // 解析输入颜色
      if (color.startsWith('#')) {
        // HEX 格式
        const hex = color.replace('#', '');
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          r = parseInt(hex.substring(0, 2), 16);
          g = parseInt(hex.substring(2, 4), 16);
          b = parseInt(hex.substring(4, 6), 16);
        } else {
          return { code: 400, message: 'HEX颜色格式无效', data: null };
        }
      } else if (color.startsWith('rgb')) {
        // RGB 格式
        const match = color.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (!match) {
          return { code: 400, message: 'RGB颜色格式无效，应为 rgb(r, g, b) 或 r, g, b', data: null };
        }
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else if (color.startsWith('hsl')) {
        // HSL 格式 -> 先转 RGB
        const match = color.match(/([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
        if (!match) {
          return { code: 400, message: 'HSL颜色格式无效', data: null };
        }
        const h = parseFloat(match[1]) / 360;
        const s = parseFloat(match[2]) / 100;
        const l = parseFloat(match[3]) / 100;
        const rgb = hslToRgb(h, s, l);
        r = rgb[0]; g = rgb[1]; b = rgb[2];
      } else {
        return { code: 400, message: '无法识别的颜色格式，支持 HEX(#ff6600)、RGB(255,102,0)、HSL(24,100%,50%)', data: null };
      }

      // 验证 RGB 范围
      if ([r, g, b].some(v => isNaN(v) || v < 0 || v > 255)) {
        return { code: 400, message: '颜色值超出范围(0-255)', data: null };
      }

      // 转换为各种格式
      const hexVal = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
      const rgbVal = `rgb(${r}, ${g}, ${b})`;

      const hslRaw = rgbToHsl(r, g, b);
      const hslVal = `hsl(${hslRaw[0]}, ${hslRaw[1]}%, ${hslRaw[2]}%)`;

      const result = {
        original: color,
        rgb: rgbVal,
        hsl: hslVal,
        hex: hexVal,
      };

      return {
        code: 200,
        message: 'success',
        data: result,
      };
    } catch (e) {
      return { code: 500, message: '转换失败: ' + e.message, data: null };
    }
  },
};

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
