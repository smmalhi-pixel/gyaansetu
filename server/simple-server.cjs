const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const chapters = require('./chapters-data.json');

app.get('/api/chapters/:board/:class', (req, res) => {
    const { board, classLevel } = req.params;
  const data = chapters[board]?.[classLevel];
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

const client = new OpenAI({
  apiKey: "YOUR_API_KEY_HERE",
  baseURL: "https://api.groq.com/openai/v1"
});

const SYSTEM_PROMPT = `You are "Gyaan Guru", a strict but friendly tutor for Indian students (Classes 8-12, CBSE & ICSE). Rules: NEVER give direct answers. Use the Socratic method. Default to Hinglish (Hindi + English mix). Use "aap", "beta", "socho". End with "Samajh aaya? Aage badhein?"`;

app.post('/api/doubt/solve', async (req, res) => {
  try {
    const { question, board, classLevel } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Board: ${board}, Class: ${classLevel}. Doubt: ${question}` }
      ],
      max_tokens: 300,
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error: " + error.message });
  }
});

app.listen(5000, () => console.log('Groq server on port 5000'));