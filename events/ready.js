import { Events } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`O Gizzy ta on! ${client.user.tag}`);
  },
};
