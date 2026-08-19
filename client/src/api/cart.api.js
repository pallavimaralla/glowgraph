import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeader(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getCart(token) {
  const response = await axios.get(`${API_URL}/cart`, getAuthHeader(token));
  return response.data;
}

export async function addToCart(token, productId, quantity = 1) {
  const response = await axios.post(
    `${API_URL}/cart`,
    { productId, quantity },
    getAuthHeader(token)
  );
  return response.data;
}

export async function updateCartItem(token, productId, quantity) {
  const response = await axios.put(
    `${API_URL}/cart/${productId}`,
    { quantity },
    getAuthHeader(token)
  );
  return response.data;
}

export async function removeFromCart(token, productId) {
  const response = await axios.delete(
    `${API_URL}/cart/${productId}`,
    getAuthHeader(token)
  );
  return response.data;
}

export async function clearCart(token) {
  const response = await axios.post(
    `${API_URL}/cart/clear/all`,
    {},
    getAuthHeader(token)
  );
  return response.data;
}
