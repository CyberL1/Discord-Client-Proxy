import { Command } from "../discordTypes.ts";

export const command: Command = {
  id: "-{generateId}",
  applicationId: "-1",
  untranslatedName: "channelinfo",
  displayName: "channelinfo",
  type: 1,
  inputType: 0,
  untranslatedDescription: "Get channel's basic info",
  displayDescription: "Get channel's basic info",
  execute: async (options, { channel, guild }) => {
    const guildOrDm = guild
      ? `channel in guild named **${guild.name}** (**${guild.id}**)`
      : `direct message with **${channel.rawRecipients[0].username}** (**${channel.rawRecipients[0].id}**)`;

    d.Z.sendBotMessage(
      channel.id,
      `You're chatting in <#${channel.id}> (**${channel.name || channel.id}**) which is a ${guildOrDm}`,
    );
  },
};
