// ==MuYunAPI==
// @name         摩斯密码编解码
// @slug         morse_code
// @description  文本和摩斯密码互转，英文用标准摩斯码，中文用Unicode码点表示
// @category     6
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"text","type":"string","required":true,"description":"待编码或解码的文本"},{"name":"action","type":"string","required":false,"description":"操作类型","default":"encode","options":["encode","decode"]}]
// @response     {"code":200,"message":"success","data":{"result":".... . .-.. .-.. ---","action":"encode"}}
// ==/MuYunAPI==

module.exports = {
  async execute(slug, params, req) {
    const text = params.text;
    const action = params.action || 'encode';

    if (!text) {
      return { code: 400, message: '缺少必填参数: text', data: null };
    }

    if (!['encode', 'decode'].includes(action)) {
      return { code: 400, message: 'action 参数无效，可选值: encode, decode', data: null };
    }

    try {
      let result;
      if (action === 'encode') {
        result = encodeMorse(text);
      } else {
        result = decodeMorse(text);
      }

      return {
        code: 200,
        message: 'success',
        data: { result, action },
      };
    } catch (e) {
      return { code: 500, message: '处理失败: ' + e.message, data: null };
    }
  },
};

// 标准摩斯密码表
const MORSE_TABLE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
};

// 反向摩斯密码表
const REVERSE_MORSE = {};
for (const [key, value] of Object.entries(MORSE_TABLE)) {
  REVERSE_MORSE[value] = key;
}

function encodeMorse(text) {
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    if (MORSE_TABLE[upper]) {
      return MORSE_TABLE[upper];
    } else if (char === ' ') {
      return '/';
    } else if (/[\u4e00-\u9fff]/.test(char)) {
      // 中文字符用Unicode码点表示
      return 'U+' + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
    } else {
      return char;
    }
  }).join(' ');
}

function decodeMorse(text) {
  // 先尝试将中文Unicode码点还原
  const words = text.split(' / ');

  return words.map(word => {
    const chars = word.trim().split(' ');
    return chars.map(code => {
      if (REVERSE_MORSE[code]) {
        return REVERSE_MORSE[code];
      }
      // 尝试解析中文Unicode码点
      const unicodeMatch = code.match(/^U\+([0-9A-Fa-f]{4,5})$/);
      if (unicodeMatch) {
        return String.fromCharCode(parseInt(unicodeMatch[1], 16));
      }
      return code;
    }).join('');
  }).join(' ');
}
