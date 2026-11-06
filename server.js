import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// AI mijozlarni ishga tushirish
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const AI_LIST = [
  {
    id: 'chatgpt',
    name: 'ChatGPT (GPT-4o)',
    color: '#10a37f',
    available: !!openai,
    call: async (messages) => {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
      });
      return completion.choices[0].message.content;
    }
  },
  {
    id: 'gemini',
    name: 'Gemini (1.5 Pro)',
    color: '#4285f4',
    available: !!genAI,
    call: async (messages) => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));
      // Oxirgi xabar foydalanuvchining savoli
      const lastMessage = chatHistory.pop().parts[0].text;
      const chat = model.startChat({ history: chatHistory });
      const result = await chat.sendMessage(lastMessage);
      return result.response.text();
    }
  },
  {
    id: 'perplexity',
    name: 'Perplexity (Sonar Large)',
    color: '#20b2aa',
    available: !!process.env.PERPLEXITY_API_KEY,
    call: async (messages) => {
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: 'llama-3.1-sonar-large-128k-chat',
        messages: messages,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.choices[0].message.content;
    }
  },
  {
    id: 'arena',
    name: 'Arena AI',
    color: '#8b5cf6',
    available: !!openai, // Standart modeldan foydalanamiz, tizim so'rovi alohida
    call: async (messages) => {
      const arenaMessages = [
        {
          role: 'system',
          content: 'Sen Arena AI suniy intellektisan. O\'zbekcha gapirasan, o\'z fikrlaringni boshqalardan farqli ravishda aniq va qisqa bayon etasan, raqiblaringning xatolarini topib, ularni mulohazali tanqid qilasan.'
        },
        ...messages
      ];
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: arenaMessages,
        temperature: 0.8,
      });
      return completion.choices[0].message.content;
    }
  }
];

// Asosiy sahifa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API holatini tekshirish
app.get('/api/status', (req, res) => {
  res.json({
    ais: AI_LIST.map(ai => ({
      id: ai.id,
      name: ai.name,
      color: ai.color,
      available: ai.available
    }))
  });
});

// Barcha AIdan birinchi javobni olish
app.post('/api/debate/start', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Bahs mavzusi kiritilmadi!' });
    }

    const systemPrompt = `Sen ${''}suniy intellektisan. Berilgan mavzu bo'yicha o'z fikringni aniq, qisqa (100-150 so'zdan oshmasin) va ishonarli bayon et. Boshqalar fikriga keyinroq javob berasan, hozircha faqat o'z pozitsiyangni yoz. Mavzu: ${topic}`;

    const results = await Promise.allSettled(
      AI_LIST.filter(ai => ai.available).map(async (ai) => {
        try {
          const response = await ai.call([{ role: 'user', content: systemPrompt.replace('Sen suniy', `Sen ${ai.name} suniy`) }]);
          return {
            aiId: ai.id,
            name: ai.name,
            color: ai.color,
            content: response,
            round: 1,
            error: null
          };
        } catch (err) {
          console.error(`${ai.name} da xato:`, err.message);
          return {
            aiId: ai.id,
            name: ai.name,
            color: ai.color,
            content: null,
            round: 1,
            error: `${ai.name} javob bera olmadi: ${err.message}`
          };
        }
      })
    );

    const responses = results.map(r => r.status === 'fulfilled' ? r.value : {
      error: r.reason?.message || 'Noma\'lum xato'
    });

    res.json({ topic, round: 1, responses });
  } catch (err) {
    console.error('Bosh sahifada xato:', err);
    res.status(500).json({ error: 'Serverda xato yuz berdi!' });
  }
});

// Navbatdagi bosqich - har bir AI boshqalarning javoblariga javob beradi
app.post('/api/debate/round', async (req, res) => {
  try {
    const { topic, history, round } = req.body;
    const nextRound = round + 1;

    const results = await Promise.allSettled(
      AI_LIST.filter(ai => ai.available).map(async (ai) => {
        // Boshqalarning oldingi barcha javoblarini to'plash
        const otherResponses = history
          .filter(h => h.aiId !== ai.id && h.content && !h.error)
          .map(h => `${h.name} (${h.round}-bosqich) dedi:\n${h.content}`)
          .join('\n\n');

        const prompt = `Mavzu: ${topic}\n\nBahsning hozirgacha bo'lgan javoblari:\n${otherResponses}\n\nSen ${ai.name} sifatida boshqa AIlarning yuqoridagi fikrlariga javob ber. Qachon to'g'ri, qachon noto'g'ri ekanliklarini ayt, o'z pozitsiyangni himoya qil. Juda qisqa yoz, 80-120 so'zdan oshmasin.`;

        try {
          const response = await ai.call([{ role: 'user', content: prompt }]);
          return {
            aiId: ai.id,
            name: ai.name,
            color: ai.color,
            content: response,
            round: nextRound,
            error: null
          };
        } catch (err) {
          return {
            aiId: ai.id,
            name: ai.name,
            color: ai.color,
            content: null,
            round: nextRound,
            error: `${ai.name} javob bera olmadi: ${err.message}`
          };
        }
      })
    );

    const responses = results.map(r => r.status === 'fulfilled' ? r.value : {
      error: r.reason?.message || 'Noma\'lum xato'
    });

    res.json({ topic, round: nextRound, responses });
  } catch (err) {
    console.error('Bahs davomida xato:', err);
    res.status(500).json({ error: 'Serverda xato yuz berdi!' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Bahs Arena serveri ${PORT} portida ishga tushdi!`);
  console.log(`🌐 Brauzeringizda http://localhost:${PORT} manzilini oching`);
  console.log('📋 Mavjud AIlar:');
  AI_LIST.forEach(ai => {
    console.log(`  - ${ai.name}: ${ai.available ? '✅ Tayyor' : '❌ API kalit kiritilmagan'}`);
  });
});
