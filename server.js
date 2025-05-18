require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // install node-fetch@2 if needed

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // or your preferred OpenRouter model
        messages: [
          { role: 'system', content: 'You are a helpful assistant for a voting dApp.' },
          { role: 'user', content: message },
        ],
        // Optional: add temperature, max_tokens, etc.
      }),
    });

    const data = await response.json();

    // Send back the AI's reply
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ reply: 'AI service failed. Try again later.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ AI Chatbot server running at http://localhost:${PORT}`);
});
