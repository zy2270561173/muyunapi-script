# MuYunAPI Scripts

内置脚本仓库，包含各种实用的 API 接口脚本。

## 脚本列表

| 文件名 | 接口名称 | 描述 |
|--------|----------|------|
| `ascii_art.js` | ASCII字符画 | 输入文字生成3x5点阵ASCII字符画 |
| `base64_codec.js` | Base64编解码 | 文本和Base64字符串互转 |
| `bing_wallpaper.js` | Bing必应每日壁纸 | 获取Bing每日高清壁纸，支持JSON/图片重定向 |
| `bmi_calculator.js` | BMI计算器 | 输入身高体重，计算BMI及健康建议 |
| `color_convert.js` | 颜色格式转换 | HEX/RGB/HSL 三种颜色格式互转 |
| `conan_quotes.js` | 名侦探柯南名言 | 随机获取柯南经典语录，支持中日双语、角色搜索 |
| `countdown.js` | 倒计时/纪念日 | 计算距目标日期的天数/周数/月数 |
| `daily_news.js` | 每日热搜 | 获取微博/知乎/百度等平台热搜榜 |
| `demo-builtin.js` | 示例内置库 | 演示脚本编写规范，含UUID/随机整数/时间戳 |
| `dns_query.js` | DNS查询 | 查询域名的A/AAAA/MX/TXT/NS等DNS记录 |
| `exchange_rate.js` | 汇率查询 | 查询全球货币汇率 |
| `hash_calculator.js` | Hash计算器 | 计算MD5/SHA1/SHA256/SHA512哈希值 |
| `ip_info.js` | IP详细信息 | 查询IP的地理位置、ASN、 ISP等详细信息 |
| `ip_query.js` | IP归属地查询 | 查询IP地址的归属地、ISP、经纬度 |
| `json_format.js` | JSON格式化校验 | 格式化、压缩或校验JSON字符串 |
| `lunar_calendar.js` | 农历查询 | 公历转农历，返回生肖、天干地支、节气 |
| `minecraft_player_info.js` | Minecraft玩家查询 | 查询正版玩家UUID、皮肤、头像、披风 |
| `morse_code.js` | 摩斯密码编解码 | 文本与摩斯密码互转，支持中英文 |
| `netease_hot_comment.js` | 网易云热评 | 获取网易云音乐随机热评 |
| `password_generator.js` | 随机密码生成器 | 生成高强度随机密码，支持自定义长度 |
| `qr_tools.js` | 二维码生成 | 调用qrtool.cn生成自定义二维码 |
| `qq-info.js` | QQ号信息 | 获取QQ号昵称、头像、等级、注册时间 |
| `qq_value_estimate.js` | QQ号价值评估 | 评估QQ号价值、稀有度、靓号等级 |
| `qweather-now.js` | 天气查询 | 通过和风天气API查询城市实时天气 |
| `random_cat.js` | 随机猫咪图片 | 获取随机猫咪图片 |
| `random_copywriting.js` | 随机文案接口 | 随机毒鸡汤、安慰文案、疯狂星期四文案 |
| `random_dog.js` | 随机狗狗图片 | 获取随机狗狗图片 |
| `random_idcard.js` | 随机身份证号 | 生成符合国家标准的18位身份证号（非真实） |
| `random_image.js` | 栗次元图片 | 随机返回多分类图片（通用/AI/动漫等） |
| `random_joke.js` | 随机笑话 | 获取中英文随机笑话 |
| `random_name.js` | 随机中文姓名 | 内置百家姓，随机生成中文姓名 |
| `random_number.js` | 随机数生成器 | 生成指定范围随机整数 |
| `random_phone.js` | 随机手机号 | 按运营商号段生成手机号（非真实） |
| `random_plate.js` | 随机车牌号 | 生成普通车牌或新能源车牌 |
| `regex_test.js` | 正则表达式测试 | 测试正则匹配，返回所有匹配结果和分组 |
| `short_url.js` | 短链接生成 | 长链接转换为短链接 |
| `ssl_info.js` | SSL证书查询 | 获取网站SSL证书信息、有效期、剩余天数 |
| `text_stats.js` | 文本统计 | 统计字数/词数/句数/阅读时间 |
| `timestamp_tool.js` | 时间戳工具 | 时间戳与日期互转 |
| `token_generate.js` | Token生成器 | 生成随机API Token |
| `unit_convert.js` | 单位换算工具 | 长度/重量/温度单位换算 |
| `url_codec.js` | URL编解码 | URL编码或解码 |
| `uuid_generate.js` | UUID生成器 | 生成RFC 4122标准UUID v4 |
| `web_title.js` | 网页标题抓取 | 输入URL，返回网页标题和描述 |
| `whois_info.js` | WHOIS域名查询 | 查询域名注册商、到期时间等 |
| `zodiac.js` | 星座运势 | 查询星座信息及趣味运势（1-5星） |

## 格式说明

所有脚本采用 MuYunAPI 元数据格式：

```javascript
// ==MuYunAPI==
// @name         接口名称
// @slug         接口标识
// @description  接口描述
// @category     分类ID
// @method       请求方法
// @requireAuth  是否需要认证
// @isFree       是否免费
// @theme        主题
// @params       参数列表(JSON)
// @response     响应示例(JSON)
// ==/MuYunAPI==
```

## 使用方法

将脚本放入 MuYunAPI 的 `script/` 或 `server/libraries/scripts/` 目录即可使用。
