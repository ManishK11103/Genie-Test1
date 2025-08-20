import axios from 'axios';

const HOST = 'https://adb-3526728156255378.18.azuredatabricks.net';
const SPACE_ID = '01f071127f411e90afc725f863fc23c5';
const TOKEN = 'dapi9cd9267880cbe37ba63c3acabe247f5a';

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

export const startConversation = async (question) => {
  const url = `${HOST}/api/2.0/genie/spaces/${SPACE_ID}/start-conversation`;
  const response = await axios.post(url, { content: question }, { headers });
  return response.data;
};

export const getMessageStatus = async (conversationId, messageId) => {
  const url = `${HOST}/api/2.0/genie/spaces/${SPACE_ID}/conversations/${conversationId}/messages/${messageId}`;
  const response = await axios.get(url, { headers });
  return response.data;
};

export const getQueryResult = async (conversationId, messageId, attachmentId) => {
  const url = `${HOST}/api/2.0/genie/spaces/${SPACE_ID}/conversations/${conversationId}/messages/${messageId}/query-result/${attachmentId}`;
  const response = await axios.get(url, { headers });
  return response.data;
};
