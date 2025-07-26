import { Events, MessageFlags } from "discord.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `Nenhum comando corresponde a ${interaction.commandName} foi encontrado`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Ocorreu um erro enquanto executava o comando",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "Ocorreu um erro enquanto executava o comando",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    console.log(interaction);
  },
};
