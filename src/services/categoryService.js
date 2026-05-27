import { mockCategories, getNextId } from "../data/mockData";

const STORAGE_KEY = "categories_data";

const initializeData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCategories));
  }
};

const getCategories = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

export const categoryService = {
  // Get all categories
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getCategories());
      }, 300);
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = getCategories();
        const category = categories.find(c => c.id === parseInt(id));
        if (category) {
          resolve(category);
        } else {
          reject(new Error("Category not found"));
        }
      }, 300);
    });
  },

  create: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getCategories();
        const newCategory = {
          id: getNextId(categories),
          ...data
        };
        categories.push(newCategory);
        saveCategories(categories);
        resolve(newCategory);
      }, 300);
    });
  },

  update: async (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = getCategories();
        const index = categories.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
          categories[index] = { ...categories[index], ...data };
          saveCategories(categories);
          resolve(categories[index]);
        } else {
          reject(new Error("Category not found"));
        }
      }, 300);
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = getCategories();
        const index = categories.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
          const deleted = categories.splice(index, 1);
          saveCategories(categories);
          resolve(deleted[0]);
        } else {
          reject(new Error("Category not found"));
        }
      }, 300);
    });
  },
};
