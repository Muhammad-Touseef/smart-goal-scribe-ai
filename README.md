
# SMART Goal AI Assistant

A web application that helps users create SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) using AI assistance powered by Google Gemini.

## Project Structure

- `src/` - React frontend application
- `backend/` - Express.js backend server

## Features

- Interactive chat interface for goal planning
- AI-powered guidance for creating SMART goals
- Real-time conversation with the AI assistant
- Responsive design with modern UI components
- RESTful API for external integrations

## Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

5. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

### Running Both Frontend and Backend

1. Open two terminal windows
2. In the first terminal, run the backend:
```bash
cd backend
npm run dev
```

3. In the second terminal, run the frontend:
```bash
npm run dev
```

### API Integration

To connect the frontend to the backend, update the `handleSendMessage` function in `src/pages/Index.tsx` to make actual API calls instead of the simulated response:

```javascript
const response = await fetch('http://localhost:3001/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: inputMessage }),
});

const data = await response.json();
const aiResponse: Message = {
  id: (Date.now() + 1).toString(),
  text: data.response,
  sender: 'ai',
  timestamp: new Date()
};
```

## API Endpoints

### POST /chat
Send a message to the AI assistant.

**Request:**
```json
{
  "message": "I want to lose weight"
}
```

**Response:**
```json
{
  "response": "That's a great goal! To make it SMART, let's be more specific. How much weight would you like to lose, and by when?"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deployment

### Frontend (Vercel/Netlify)
The frontend can be deployed to Vercel or Netlify by connecting your repository.

### Backend (Railway/Render/Heroku)
The backend can be deployed to Railway, Render, or Heroku. Make sure to set the `GEMINI_API_KEY` environment variable.

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, Google Generative AI
- **Development:** Vite, ESLint, Prettier
