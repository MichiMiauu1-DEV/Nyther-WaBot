export default {
  command: ['resetacertanime'],
  category: 'admin',

  run: async ({ msg, sock }) => {

    const chat = msg.chat;
    const userId = msg.sender;

    // 🛑 SOLO OWNER / ADMIN (ajusta si quieres)
    const isOwner = global.owner?.includes(userId.split('@')[0]);

    if (!isOwner) {
      return sock.sendMessage(chat, {
        text: "❌ No tienes permiso para reiniciar esto."
      }, { quoted: msg });
    }

    if (!global.db?.groups?.[chat]) {
      global.db.groups[chat] = {};
    }

    const g = global.db.groups[chat];

    // 🧹 limpiar TODO lo del juego
    if (g.animeTimer) clearTimeout(g.animeTimer);

    g.animeActive = null;
    g.animeTimer = null;

    // opcional: historial por si lo estabas usando
    g.animeHistory = [];

    return sock.sendMessage(chat, {
      text:
`🧹 RESET COMPLETO

✔ acertijos eliminados
✔ timers limpiados
✔ partidas reiniciadas

🟢 El sistema está listo para usarse de nuevo.`
    }, { quoted: msg });
  }
};
