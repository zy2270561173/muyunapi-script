// ==MuYunAPI==
// @name         Minecraft玩家查询
// @slug         minecraft_player_info
// @description  查询Minecraft正版玩家UUID、皮肤、头像、披风等信息（Mojang官方接口）
// @category     2
// @method       GET
// @requireAuth  false
// @isFree       true
// @theme        both
// @params       [{"name":"player","type":"string","required":true,"description":"Minecraft玩家名称","example":"Notch"}]
// @response     {"code":200,"data":{"name":"Notch","uuid":"069a79f444e94726a5befca90e38aaf5","avatar":"https://crafatar.com/avatars/069a79f444e94726a5befca90e38aaf5?size=256","skin":"https://crafatar.com/skins/069a79f444e94726a5befca90e38aaf5","cape":"https://crafatar.com/capes/069a79f444e94726a5befca90e38aaf5","render":"https://crafatar.com/renders/body/069a79f444e94726a5befca90e38aaf5?size=512","official":true}}
// ==/MuYunAPI==

const axios = require('axios');

module.exports = {

  async execute(slug, params, req) {

    const player = params && params.player;

    // 参数校验
    if (!player) {
      return {
        code: 400,
        message: '缺少必填参数：player',
        data: null
      };
    }

    // Minecraft玩家名校验
    const nameRegex = /^[A-Za-z0-9_]{3,16}$/;

    if (!nameRegex.test(player)) {
      return {
        code: 400,
        message: '玩家名称格式不正确',
        data: null
      };
    }

    try {

      // =========================
      // Mojang官方接口查询UUID
      // =========================

      const mojangResponse = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${player}`,
        {
          timeout: 10000,
          headers: {
            'User-Agent': 'MuYunAPI/1.0'
          }
        }
      );

      // 玩家不存在
      if (!mojangResponse.data || !mojangResponse.data.id) {
        return {
          code: 404,
          message: '玩家不存在或不是正版账号',
          data: null
        };
      }

      const uuid = mojangResponse.data.id;
      const name = mojangResponse.data.name;

      // =========================
      // 构建各种资源链接
      // =========================

      const avatar =
        `https://crafatar.com/avatars/${uuid}?size=256`;

      const skin =
        `https://crafatar.com/skins/${uuid}`;

      const cape =
        `https://crafatar.com/capes/${uuid}`;

      const render =
        `https://crafatar.com/renders/body/${uuid}?size=512`;

      // =========================
      // 查询详细Profile
      // =========================

      let hasCape = false;

      try {

        const profileResponse = await axios.get(
          `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`,
          {
            timeout: 10000,
            headers: {
              'User-Agent': 'MuYunAPI/1.0'
            }
          }
        );

        if (
          profileResponse.data &&
          profileResponse.data.properties
        ) {

          const textureProperty =
            profileResponse.data.properties.find(
              p => p.name === 'textures'
            );

          if (textureProperty) {

            const decoded = JSON.parse(
              Buffer.from(textureProperty.value, 'base64').toString()
            );

            if (
              decoded.textures &&
              decoded.textures.CAPE
            ) {
              hasCape = true;
            }

          }

        }

      } catch (e) {
        // 忽略详细资料错误
      }

      // =========================
      // 返回结果
      // =========================

      return {
        code: 200,
        message: 'success',
        data: {
          name,
          uuid,
          avatar,
          skin,
          cape: hasCape ? cape : null,
          render,
          official: true
        }
      };

    } catch (e) {

      // Mojang返回404
      if (e.response && e.response.status === 404) {
        return {
          code: 404,
          message: '玩家不存在或不是正版账号',
          data: null
        };
      }

      return {
        code: 500,
        message: '请求失败：' + (e.message || '未知错误'),
        data: null
      };
    }

  }

};