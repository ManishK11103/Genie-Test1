import React, { useState } from 'react';
import { startConversation, getMessageStatus } from './genieApi';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const askGenie = async () => {
    const { conversation, message } = await startConversation(question);
    const conversationId = conversation.id;
    const messageId = message.id;

    let status = 'IN_PROGRESS';
    while (status === 'IN_PROGRESS') {
      const result = await getMessageStatus(conversationId, messageId);
      status = result.status;
      if (status === 'COMPLETED'||status === 'SUBMITTED') {
        setResponse(result.attachments?.[0]?.text || 'No response found');
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ask Genie</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question..."
        style={{ width: '300px' }}
      />
      <button onClick={askGenie}>Submit</button>
      <div style={{ marginTop: '20px' }}>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;
