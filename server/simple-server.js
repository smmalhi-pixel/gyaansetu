const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: "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" });

app.post('/api/doubt/solve', async (req, res) => {
  try {
    const { question } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a Hinglish tutor. Reply in Hindi+English. Never give direct answers. Guide with questions." },
        { role: "user", content: question }
      ],
      max_tokens: 300,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ reply: "Error: " + error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));