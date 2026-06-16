export default {
  command: ['restart'],
  category: 'owner',
  description: 'Reiniciar el socket del bot.',
  isOwner: true,
  run: async ({ msg, sock }) => {
    await sock.reply(msg.chat, `✎ No... Esperen.*`, msg);
    setTimeout(() => {
      if (process.send) {
        process.send("restart");
      } else {
        process.exit(0);
      }
    }, 3000);
  },
};
