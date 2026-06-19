import axios from "axios";

export default {
  command: ['gemini'],
  category: 'ai',

  run: async ({ msg, sock, args }) => {
    const chat = msg.chat;
    const prompt = args.join(" ");

    if (!prompt) {
      return sock.sendMessage(chat, { text: "⚠️ Pon tu pregunta después de *gemini" }, { quoted: msg });
    }

    try {
      await sock.sendPresenceUpdate('composing', chat);

      // Usamos la API de forma directa con tu clave AQ...
      const response = await axios({
        method: 'post',
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AQ.Ab8RN6LsMaqC0tqQ7v5Io4jqQUaK7g5TTNhBlzN8hg_3meMdvg'
        },
        data: {
          contents: [{ parts: [{ text: prompt }] }]
        }
      });

      const text = response.data.candidates[0].content.parts[0].text;

      sock.sendMessage(chat, { text: `🤖 *GEMINI RESPONDIO:*\n\n${text}` }, { quoted: msg });
      
    } catch (error) {
      console.error(error);
      sock.sendMessage(chat, { text: "❌ Error: La API Key no es válida o hubo un problema de conexión." }, { quoted: msg });
    }
  }
};
