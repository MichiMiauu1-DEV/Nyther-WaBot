import { GoogleGenerativeAI } from "@google/generative-ai";

// Reemplaza 'TU_API_KEY_AQUI' por tu clave (ej: 'AQ.Ab8RN6LsMaqC0tqQ7v5Io4jqQUaK7g5TTNhBlzN8hg_3meMdvg')
const genAI = new GoogleGenerativeAI('AQ.Ab8RN6LsMaqC0tqQ7v5Io4jqQUaK7g5TTNhBlzN8hg_3meMdvg');

export default {
  command: ['gemini'],
  category: 'ai',

  run: async ({ msg, sock, args }) => {
    const chat = msg.chat;
    const prompt = args.join(" ");

    // Validación si el usuario no escribe nada
    if (!prompt) {
      return sock.sendMessage(chat, { 
        text: "╭━━━〔 🤖 𝙂𝙀𝙈𝙄𝙉𝙄 〕━━━⬣\n\n¿Qué quieres preguntarme?\nEjemplo: *gemini ¿Cuántas estrellas existen?\n\n╰━━━━━━━━━━━━━━━" 
      }, { quoted: msg });
    }

    try {
      // Indicador de "escribiendo..." en WhatsApp
      await sock.sendPresenceUpdate('composing', chat);

      // Usamos el modelo flash (rápido y eficiente)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Enviamos la respuesta formateada
      sock.sendMessage(chat, { 
        text: `╭━━━〔 🤖 𝙂𝙀𝙈𝙄𝙉𝙄 〕━━━⬣\n\n${text}\n\n╰━━━━━━━━━━━━━━━` 
      }, { quoted: msg });
      
    } catch (error) {
      console.error("Error al conectar con Gemini API:", error);
      sock.sendMessage(chat, { text: "❌ Hubo un error al procesar tu consulta con la IA. Verifica tu API Key en el código." }, { quoted: msg });
    }
  }
};
