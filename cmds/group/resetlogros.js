if (!global.db) global.db = {};
if (!global.db.users) global.db.users = {};

export default {
  command: ['resetlogros'],
  category: 'owner',

  run: async ({ msg, sock }) => {

    const userId = msg.sender;

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: []
      };
    }

    const u = global.db.users[userId];

    // 🔥 RESET LOGROS
    u.achievements = [];

    return sock.sendMessage(msg.chat, {
      text:
`╭━━━〔 🧹 𝙍𝙀𝙎𝙀𝙏 𝙇𝙊𝙂𝙍𝙊𝙎 〕━━━⬣

🏆 Todos tus logros han sido eliminados
📭 Inventario vacío

╰━━━━━━━━━━━━━━━`
    }, { quoted: msg });
  }
};
