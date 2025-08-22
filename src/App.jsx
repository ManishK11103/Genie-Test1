import React, { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askGenie = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const startRes = await fetch('/api/start-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const { conversation, message } = await startRes.json();
      await pollMessageStatus(conversation.id, message.id);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setResponse('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const pollMessageStatus = async (conversationId, messageId) => {
    let retries = 0;
    const maxRetries = 20;
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    while (retries < maxRetries) {
      try {
        const res = await fetch(`/api/message-status/${conversationId}/${messageId}`);
        const result = await res.json();

        const { status, attachments } = result;

        if (status === 'COMPLETED' || status === 'SUBMITTED') {
          const attachment = attachments?.[0];

          if (attachment?.text?.content) {
            setResponse(attachment.text.content);
          } else if (attachment?.query?.query) {
            const queryRes = await fetch(
              `/api/query-result/${conversationId}/${messageId}/${attachment.attachment_id}`
            );
            const queryResult = await queryRes.json();
            setResponse(JSON.stringify(queryResult, null, 2));
          } else {
            setResponse('No response found');
          }

          setLoading(false);
          return;
        }

        retries++;
        await delay(3000);
      } catch (error) {
        console.error('Error fetching status:', error);
        setResponse('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
    }

    setResponse('Request timed out. Please try again.');
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2>Ask Genie</h2>

      <div className="mb-3 d-flex" style={{ maxWidth: '700px' }}>
        <input
          type="text"
          className="form-control"
          style={{ width: '600px' }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
        />

        <button
          onClick={askGenie}
          className="btn btn-primary ms-2"
          disabled={loading || !question.trim()}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </div>

      <div className="mt-4">
        <strong>Response:</strong>
        <textarea
          className="form-control mt-2"
          value={response}
          style={{ resize: 'none' }}
          readOnly
          rows={10}
        />
      </div>
    </div>
  );
}

export default App;
