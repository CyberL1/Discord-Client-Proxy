import { Channel, Guild } from "discord-types/general";

export interface Command {
  id: string;
  applicationId: "-1";
  type: CommandType;
  inputType: 0;
  untranslatedName: string;
  displayName: string;
  untranslatedDescription: string;
  displayDescription: string;
  options?: Option[];
  predicate?(ctx: CommandContext): boolean;
  execute(options: CommandOption[], ctx: CommandContext): void;
}

export type CommandType = 1 | 2 | 3;

export interface Option {
  type: CommandOptionType;
  name: string;
  displayName: string;
  description: string;
  displayDescription: string;
  required?: boolean;
  choices?: ChoicesOption[];
  options?: Option[];
  channelTypes?: number[];
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  autocomplete?: boolean;
}

export const enum CommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP,
  STRING,
  INTEGER4,
  BOOLEAN,
  USER,
  CHANNEL,
  ROLE,
  MENTIONABLE,
  NUMBER,
  ATTACHMENT,
}

export interface ChoicesOption {
  name: string;
  displayName: string;
  value: string;
}

export interface CommandContext {
  channel: Channel;
  guild?: Guild;
}

export interface CommandOption {
  type: CommandOptionType;
  name: string;
  value: string;
  focused?: boolean;
  options?: CommandOption[];
}
