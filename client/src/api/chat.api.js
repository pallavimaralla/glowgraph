import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function sendChatMessage(message, sessionId = null, token = null) {
  const payload = { message };
  if (sessionId) payload.sessionId = sessionId;

  const config = {};
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axios.post(`${API_URL}/chat`, payload, config);
  return response.data;
}
