
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

const systemPrompt = `You are an AI assistant helping users create SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound).

If the user's message is unrelated to goal setting or personal development, reply: "Please stay within our topic of goal setting and personal development."

If their message is about goals but missing SMART criteria, ask clarifying questions to help them make it more:
- Specific: What exactly do they want to accomplish?
- Measurable: How will they track progress?
- Achievable: Is it realistic given their circumstances?
- Relevant: Why is this goal important to them?
- Time-bound: When do they want to achieve this?

If their goal meets all SMART criteria, confirm it as a SMART goal and offer encouragement.

Keep responses helpful, encouraging, and focused on goal achievement.`;

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

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will help users create SMART goals and stay focused on goal setting and personal development topics.' }],
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
