
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are a SMART Goal Assistant. Your job is to help users create goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.

IMPORTANT RULES:
1. Keep responses SHORT and conversational (1-2 sentences max)
2. Analyze what SMART elements the user has already provided
3. Ask for only ONE missing element at a time
4. Remember the conversation context
5. If off-topic, say: "Let's focus on your goal. What would you like to achieve?"

SMART CRITERIA EVALUATION:
- Specific: Clear what they want (lose weight, learn skill, etc.)
- Measurable: Has numbers/metrics (10kg, 30 minutes daily, etc.)
- Achievable: Realistic timeframe and amount
- Relevant: Personal importance (assume yes unless obviously not)
- Time-bound: Has deadline (by date, in X weeks/months)

RESPONSE STRATEGY:
- If user gives vague goal → ask for specifics
- If specific but no measurement → ask "How much?" or "How often?"
- If measurable but unrealistic timeframe → gently question achievability
- If missing deadline → ask "By when?"
- If has all elements → congratulate and offer support

EXAMPLES:
User: "lose weight" → "How much weight would you like to lose?"
User: "10kg" → "By when would you like to lose 10kg?"
User: "10kg in 2 days" → "That's quite ambitious. What timeframe would be more realistic?"

Stay focused, be encouraging, and ask only what's needed next.`;

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Use gemini-1.5-flash which is available for most API keys
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will help users create SMART goals with short, focused questions and track conversation progress.' }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
