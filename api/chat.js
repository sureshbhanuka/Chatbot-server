// api/chat.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fetch = require('node-fetch'); // or native fetch in Node 18+

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for a voting dApp.' },
          { role: 'user', content: message },
        ]
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response.';
    res.status(200).json({ reply });
  } catch (err) {
    console.error('OpenRouter error:', err);
    res.status(500).json({ reply: 'AI service failed.' });
  }
});

app.use('/api', router);
module.exports = app;
