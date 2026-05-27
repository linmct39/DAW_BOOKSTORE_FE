import axios from 'axios';
import { Category } from '../types';
import { BOOK_API } from './api';

export const categoryService = {
  async getAll(params?: { skip?: number, limit?: number, q?: string }) {
    const response = await axios.get(`${BOOK_API}/categories/`, { params });
    return response.data;
  },

  async getById(id: string | number) {
    const response = await axios.get(`${BOOK_API}/categories/${id}`);
    return response.data;
  },

  async create(data: Omit<Category, 'id'>) {
    const response = await axios.post(`${BOOK_API}/categories/`, data);
    return response.data;
  },

  async update(id: string | number, data: Partial<Category>) {
    const response = await axios.put(`${BOOK_API}/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string | number) {
    await axios.delete(`${BOOK_API}/categories/${id}`);
    return true;
  },
};

