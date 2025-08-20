import React, { useState } from 'react';
import { startConversation, getMessageStatus } from '/genieApi';

interface Conversation {
  id: string;
}

interface Message {
  id: string;
}

interface Attachment {
  text?: string;
}

interface MessageStatusResponse {
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  attachments?: Attachment[];
}

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const askGenie = async () => {
    try {
      const {
        conversation,
        message,
      }: { conversation: Conversation; message: Message } = await startConversation(question);

      const conversationId = conversation.id;
      const messageId = message.id;

      let status: MessageStatusResponse['status'] = 'IN_PROGRESS';

      while (status === 'IN_PROGRESS') {
        const result: MessageStatusResponse = await getMessageStatus(conversationId, messageId);
        status = result.status;

        if (status === 'COMPLETED') {
          setResponse(result.attachments?.[0]?.text || 'No response found');
        }

        await new Promise((r) => setTimeout(r, 3000));
      }
    } catch (error) {
      console.error('Error calling Genie API:', error);
      setResponse('Something went wrong. Please try again.');
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
};

export default App;