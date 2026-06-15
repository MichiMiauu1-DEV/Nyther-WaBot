export default {
  command: ['resetbandera'],
  category: 'owner',

  run: async ({ msg, sock }) => {

    const userId = msg.sender;

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        flagWins: 0,
        achievements: []
      };
    }

    const u = global.db.users[userId];

    u.flagWins = 0;

    return sock.sendMessage(msg.chat, {
      text:
`╭━━━〔 🔄 𝙍𝙀𝙎𝙀𝙏 𝘾𝙊𝙈𝙋𝙇𝙀𝙏𝙀𝘿 〕━━━⬣

🌍 Tus victorias fueron reiniciadas a 0
🏆 Logros: intactos

╰━━━━━━━━━━━━━━━`
    }, { quoted: msg });
  }
};
