
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store conversation histories in memory (indexed by session ID)
const conversationHistories = new Map();

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

// Serve chat page
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Get or create conversation history for this session
    if (!conversationHistories.has(sessionId)) {
      conversationHistories.set(sessionId, [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will help users create SMART goals with short, focused questions and track conversation progress.' }],
        },
      ]);
    }

    const history = conversationHistories.get(sessionId);

    // Use gemini-1.5-flash which is available for most API keys
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const aiResponse = response.text();

    // Update conversation history
    history.push(
      {
        role: 'user',
        parts: [{ text: message }],
      },
      {
        role: 'model',
        parts: [{ text: aiResponse }],
      }
    );

    console.log(`Session ${sessionId} - User: ${message}`);
    console.log(`Session ${sessionId} - AI: ${aiResponse}`);

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

// Root route
app.get('/', (req, res) => {
  res.redirect('/chat');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Chat interface available at http://localhost:${PORT}/chat`);
});

module.exports = app;
