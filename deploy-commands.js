import { REST, Routes } from "discord.js";
import "dotenv/config";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)).default;
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[ATENÇÃO] O comando de ${filePath} está faltando o atributo requerido 'data' ou 'execute'`
      );
    }
  }
}

const rest = new REST().setToken(TOKEN);

(async () => {
  try {
    console.log(
      `Comecou a atualizar ${commands.length} comando(s) da aplicacao.`
    );
    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log(
      `Atualizou com sucesso ${data.length} comando(s) da aplicacao.`
    );
  } catch (error) {
    console.error(error);
  }
})();
