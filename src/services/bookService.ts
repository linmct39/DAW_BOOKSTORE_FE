import axios from 'axios';
import { Book } from '../types';
import { BOOK_API } from './api';

export const bookService = {
  async getAll(params?: { skip?: number, limit?: number, q?: string, category_id?: number | string }) {
    const response = await axios.get(`${BOOK_API}/books/`, { params });
    return response.data;
  },

  async getById(id: string | number) {
    const response = await axios.get(`${BOOK_API}/books/${id}`);
    return response.data;
  },

  async create(data: Omit<Book, 'id' | 'category'>) {
    const payload = {
      ...data,
      price: Number(data.price),
      category_id: Number(data.category_id)
    };
    const response = await axios.post(`${BOOK_API}/books/`, payload);
    return response.data;
  },

  async update(id: string | number, data: Partial<Book>) {
    const payload = { ...data };
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.category_id !== undefined) payload.category_id = Number(payload.category_id);
    
    const response = await axios.put(`${BOOK_API}/books/${id}`, payload);
    return response.data;
  },

  async delete(id: string | number) {
    await axios.delete(`${BOOK_API}/books/${id}`);
    return true;
  },
};

