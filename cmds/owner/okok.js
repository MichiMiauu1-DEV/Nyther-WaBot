import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 TU NÚMERO (OWNER FIXO)
const MY_NUMBER = '5351512906@s.whatsapp.net';

// 🔑 COMANDO SECRETO
const SECRET_COMMAND = '26413';

async function reloadCommands(dir = path.join(__dirname, '..')) {
  const commandsMap = new Map();

  async function readCommands(folder) {
    const files = fs.readdirSync(folder);

    for (const file of files) {
      const fullPath = path.join(folder, file);

      if (fs.lstatSync(fullPath).isDirectory()) {
        await readCommands(fullPath);

      } else if (file.endsWith('.js')) {

        try {
          const { default: cmd } = await import(
            fullPath + '?update=' + Date.now()
          );

          if (cmd?.command) {
            cmd.command.forEach((c) => {
              commandsMap.set(c.toLowerCase(), cmd);
            });
          }

        } catch (err) {
          console.error(`Error recargando comando ${file}:`, err);
        }
      }
    }
  }

  await readCommands(dir);
  global.comandos = commandsMap;
}

export default {
  command: [SECRET_COMMAND],
  category: 'owner',
  description: 'Emergency fix system (OWNER ONLY)',

  run: async ({ msg, sock }) => {

    // 🔐 BLOQUEO TOTAL
    if (msg.sender !== MY_NUMBER) {
      return sock.sendMessage(msg.chat, {
        text:
`╭━━━〔 ❌ ACCESO DENEGADO 〕━━━⬣

🚫 Este comando es de emergencia
🔐 Solo el owner puede usarlo

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }

    await sock.sendMessage(msg.chat, {
      text:
`╭━━━〔 🚨 SISTEMA EMERGENCIA 〕━━━⬣

📥 Ejecutando fix...
♻️ Recargando sistema...
⚙️ Aplicando cambios...

╰━━━━━━━━━━━━━━━`
    }, { quoted: msg });

    exec('git pull', async (error, stdout) => {

      try {

        await reloadCommands(path.join(__dirname, '..'));

        let replyMsg = '';

        if (error) {
          replyMsg =
`╭━━━〔 ❌ ERROR CRÍTICO 〕━━━⬣

${error.message}

╰━━━━━━━━━━━━━━━`;

        } else if (stdout.includes('Already up to date.')) {

          replyMsg =
`╭━━━〔 ✅ SISTEMA OK 〕━━━⬣

✨ No hay cambios pendientes

╰━━━━━━━━━━━━━━━`;

        } else {

          replyMsg =
`╭━━━〔 🚀 FIX APLICADO 〕━━━⬣

✅ Actualización completada
♻️ Sistema recargado

╰━━━━━━━━━━━━━━━`;
        }

        await sock.sendMessage(msg.chat, {
          text: replyMsg
        }, { quoted: msg });

      } catch (e) {

        console.error(e);

        await sock.sendMessage(msg.chat, {
          text:
`╭━━━〔 ❌ ERROR INTERNO 〕━━━⬣

⚠️ Falló la recarga del sistema

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }
    });
  }
};
