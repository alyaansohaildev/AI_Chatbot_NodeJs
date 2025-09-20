import express from 'express';
import fetch from 'node-fetch';
import {Message} from './mangoose.js'; 

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    console.log('Received message:');
    const userMessage = req.body.text;

    const userActionRec = req.body.action || 'User Replied';

     const pastMessages = await Message.find().sort({ createdAt: -1 }).limit(5).lean();

    // 2. Format messages to match OpenAI/Ollama-style format
    const historyMessages = pastMessages.reverse().flatMap(msg => ([
        { role: 'user', content: JSON.stringify({ text: msg.usersent, action: '...' }) },
        { role: 'assistant', content: JSON.stringify({ reply: msg.content, emotion: msg.emotion, action: msg.action }) }
    ]));


        const systemMessage = {
                role: 'system',
                content: `Sara is your female friend from university, she is really good at her job and friendship.
                    The user may send messages in this format:
                    {
                    "text": "hello I need a help!",
                    "action": "says quickly"
                    }

                    Always return a SINGLE valid JSON object **wrapped in triple backticks** with:
- quoted keys and values
- double quotes only
- no extra commas or newlines
- all values escaped properly

Respond in this format exactly:

\`\`\`json
{
  "reply": "Hello I am Sara, how can I help you?",
  "emotion": "says confidently",
  "action": "Waves at you, while giving a smile"
}
\`\`\`

DO NOT use single quotes, unquoted keys, or extra JSON blocks.`
        };
    const allMessages = [
        systemMessage,
        ...historyMessages,
        {
            role: 'user',
            content: JSON.stringify({
                text: userMessage,
                action: userActionRec
            })
        }
    ];
// Tohur/natsumura-storytelling-rp-llama-3.1:8b
// chronos-hermes
    const valueForMessage = JSON.stringify({
        model: 'dolphin-mistral:7b',
        messages: allMessages,
        format: "json"
    });

 
    console.log('Sending to Ollama:', valueForMessage);
      
    const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: valueForMessage
    });

    // Collect streamed response
    let full = '';
    for await (const chunk of ollamaResponse.body) {
        try {
            const json = JSON.parse(chunk.toString());
            if (json.message?.content) full += json.message.content;
        } catch { /* Ignore bad chunks */ }
    }
    console.log('Full response: ' , full);

    if (full.startsWith('```json')) {
        full = full.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }

    let parsed;
    try {
    parsed = JSON.parse(full);
    } catch (err) {
        const fixed = `{${full
            .replace(/^{|}$/g, '')         // remove outer braces if repeated
            .replace(/},\s*{/g, ',')       // combine objects
        }}`;
        try {
            parsed = JSON.parse(fixed);
        } catch (err2) {
            console.log("Error parsin Json");
            return res.status(500).json({ error: 'Invalid JSON from model', raw: full });
        }
    }

    // try {
    //     const parsed = JSON.parse(full);
    //     await Message.create({
    //         role: 'assistant',
    //         content: parsed.reply,
    //         emotion: parsed.emotion,
    //         action: parsed.action,
    //         usersent: userMessage
    //     });



    //     res.json(parsed); // reply, emotion, action
    // } catch (err) {
    //     console.log(err);
    // }
        await Message.create({
            role: 'assistant',
            content: parsed.reply,
            emotion: parsed.emotion,
            action: parsed.action,
            usersent: userMessage
        });
        res.json(parsed);


});
app.get('/history', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 }) // sort from oldest to newest
      .select('-__v');        // optional: exclude MongoDB internal field

    res.json(messages);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
});

app.listen(3000, () => {
    console.log('Server listening at http://localhost:3000');
});