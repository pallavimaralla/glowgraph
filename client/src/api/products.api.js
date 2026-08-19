import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.range) params.append('range', filters.range);
  if (filters.category) params.append('category', filters.category);
  if (filters.concern) params.append('concern', filters.concern);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.skip) params.append('skip', filters.skip);

  const response = await axios.get(`${API_URL}/products?${params.toString()}`);
  return response.data;
}

export async function getProductById(id) {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
}
