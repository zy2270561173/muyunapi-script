# MuYunAPI Scripts

内置脚本仓库，包含各种实用的API接口脚本。

## 脚本列表

| 文件名 | 接口名称 | 描述 |
|--------|----------|------|
| `bing_wallpaper.js` | Bing必应每日壁纸 | 获取Bing每日高清壁纸，支持返回JSON数据或直接重定向到图片 |
| `minecraft_player_info.js` | Minecraft玩家查询 | 查询Minecraft正版玩家UUID、皮肤、头像、披风等信息 |
| `password_generator.js` | 随机密码生成器 | 生成高强度的随机密码，支持自定义长度和字符类型 |
| `qq-info.js` | QQ号信息 | 获取指定QQ号的基本信息，包括昵称、头像、等级、注册时间等 |
| `qq_value_estimate.js` | QQ号价值评估 | 本地算法评估QQ号价值、稀有度、年代、靓号等级与幸运值 |
| `qweather-now.js` | 天气查询 | 通过和风天气API查询城市实时天气 |
| `random_copywriting.js` | 随机文案接口 | 随机获取毒鸡汤、安慰文案、疯狂星期四文案 |
| `ssl_info.js` | SSL证书查询 | 获取网站SSL证书信息（颁发机构、有效期、剩余天数、协议版本） |
| `whois_info.js` | WHOIS域名信息查询 | 查询域名WHOIS信息（注册商、注册时间、到期时间、DNS等） |

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
