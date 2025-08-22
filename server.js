// server.js
import express from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as genieApi from './src/genieApi.js'; // <-- Use import, not require

const app = express();
const PORT = 3001;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//app.use(cors());
app.use(bodyParser.json());

app.post('/api/start-conversation', async (req, res) => {
  try {
    const { question } = req.body;
    const data = await genieApi.startConversation(question);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/message-status/:conversationId/:messageId', async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;
    const data = await genieApi.getMessageStatus(conversationId, messageId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/query-result/:conversationId/:messageId/:attachmentId', async (req, res) => {
  try {
    const { conversationId, messageId, attachmentId } = req.params;
    const data = await genieApi.getQueryResult(conversationId, messageId, attachmentId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});