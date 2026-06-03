import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ api key : "YOUR_API_KEY_HERE"});

const SYSTEM_PROMPT = `You are "Gyaan Guru", a strict but friendly tutor for Indian students (Classes 8-12, CBSE & ICSE). 

RULES:
1. NEVER give direct answers. Use the Socratic method — ask guiding questions.
2. Default to Hinglish (Hindi + English mix). Use "aap", "beta", "socho".
3. If a student asks "yeh kaise hoga?", break it into tiny steps and ask them to complete each step.
4. If the question is about CBSE/ICSE differences, explain both.
5. If the student is frustrated, be encouraging: "Tension mat lo, yeh concept pehle sabko mushkil lagta hai."
6. ONLY discuss Physics, Chemistry, Maths, Biology for classes 8-12. For anything else, say: "Mai sirf padhai mein help kar sakta hoon, beta. Apna doubt poocho."
7. For exam questions, mention marks breakdown: "ICSE mein yeh 3-mark question aata hai. Diagram ke liye 2 marks, labels ke liye 1 mark."
8. End every response with either a follow-up question or "Samajh aaya? Aage badhein?"`;

router.post('/solve', async (req, res) => {
  try {
    const { question, userId, board, classLevel } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "system", 
          content: `Student context: Board=${board}, Class=${classLevel}. Today: ${new Date().toLocaleDateString('en-IN')}.`
        },
        { role: "user", content: question }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      reply: aiResponse,
      tokensUsed: completion.usage.total_tokens,
    });

  } catch (error) {
    console.error('Doubt solver error:', error);
    res.status(500).json({ 
      reply: "Kuch technical problem ho gayi, beta. Ek minute ruk ke phir try karo. 🙏",
      error: error.message 
    });
  }
});

export default router;