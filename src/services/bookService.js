import { mockBooks, getNextId } from "../data/mockData";

const STORAGE_KEY = "books_data";

// Initialize with mock data if no data exists
const initializeData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBooks));
  }
};

const getBooks = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

const saveBooks = (books) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

export const bookService = {
  // Get all books
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getBooks());
      }, 300); // Simulate API delay
    });
  },

  // Get book by ID
  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const books = getBooks();
        const book = books.find(b => b.id === parseInt(id));
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      }, 300);
    });
  },

  // Create new book
  create: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const books = getBooks();
        const newBook = {
          id: getNextId(books),
          ...data,
          price: parseInt(data.price),
          categoryId: parseInt(data.categoryId),
          stock: parseInt(data.stock)
        };
        books.push(newBook);
        saveBooks(books);
        resolve(newBook);
      }, 300);
    });
  },

  // Update book
  update: async (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const books = getBooks();
        const index = books.findIndex(b => b.id === parseInt(id));
        if (index !== -1) {
          books[index] = {
            ...books[index],
            ...data,
            price: parseInt(data.price),
            categoryId: parseInt(data.categoryId),
            stock: parseInt(data.stock)
          };
          saveBooks(books);
          resolve(books[index]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 300);
    });
  },

  // Delete book
  delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const books = getBooks();
        const index = books.findIndex(b => b.id === parseInt(id));
        if (index !== -1) {
          const deleted = books.splice(index, 1);
          saveBooks(books);
          resolve(deleted[0]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 300);
    });
  },

  // Get books by category
  getByCategory: async (categoryId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const books = getBooks();
        const filtered = books.filter(b => b.categoryId === parseInt(categoryId));
        resolve(filtered);
      }, 300);
    });
  },
};