import { Command } from "../discordTypes.ts";

export const command: Command = {
  id: "-{generateId}",
  applicationId: "-1",
  untranslatedName: "echo",
  displayName: "echo",
  type: 1,
  inputType: 0,
  untranslatedDescription: "Make Clyde say something",
  displayDescription: "Make Clyde say something",
  options: [
    {
      type: 3,
      name: "text",
      displayName: "text",
      description: "The text to echo",
      displayDescription: "The text to echo",
      required: true,
    },
  ],
  execute: async (options, { channel, guild }) => {
    const text = options.find(({ name }) => name === "text");
    d.Z.sendBotMessage(channel.id, `${text?.value}`);
  },
};
