import React, { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askGenie = async () => {
    setLoading(true);
    setResponse('');

    try {
      // Call your Node.js backend endpoint
      const startRes = await fetch('/api/start-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const { conversation, message } = await startRes.json();
      const conversationId = conversation.id;
      const messageId = message.id;

      let retries = 0;
      const maxRetries = 20; // stop after ~100 sec if still IN_PROGRESS

      const pollStatus = async () => {
        try {
          const statusRes = await fetch(
            `/api/message-status/${conversationId}/${messageId}`
          );
          const result = await statusRes.json();
          const status = result.status;

          if (status === 'COMPLETED' || status === 'SUBMITTED') {
            //setResponse(result.attachments?.[0]?.text.content || 'No response found');
            if (attachment[0].text?.content) {
              // normal text response
              setResponse({
                type: "text",
                content: attachment[0].text.content
              });
            } else if (attachment[0].query?.query) {
              // SQL / Query response
              setResponse({
                type: "query",
                content: attachment.query.query,
                description: attachment.query.description
              });
            } else {
              setResponse({
                type: "unknown",
                content: "Unsupported response format."
              });
            }
            setLoading(false);
            return;
          }

          if (retries < maxRetries) {
            retries++;
            setTimeout(pollStatus, 5000); // check again after 5 sec
          } else {
            setResponse('Request timed out. Please try again.');
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching status:', error);
          setResponse('Something went wrong. Please try again.');
          setLoading(false);
        }
      };

      pollStatus();
    } catch (err) {
      console.error(err);
      setResponse('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Ask Genie</h2>

      <div className="mb-3 d-flex justifiy-content-center " style={{ maxWidth: '400px' }}>
        <input
          type="text"
          className="form-control"
          style={{ width: '400px' }}
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
        <div className="mt-4">
          <strong>Response:</strong>
          <textarea
            className="form-control response-box mt-2"
            value={response}
            readOnly
            rows={6} // adjust height as needed
          />
        </div>
      </div>
    </div>
  );
}

export default App;
