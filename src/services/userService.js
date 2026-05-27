import { mockUsers, getNextId } from "../data/mockData";

const STORAGE_KEY = "users_data";

const initializeData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
  }
};

const getUsers = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const userService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getUsers());
      }, 300);
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.id === parseInt(id));
        if (user) {
          resolve(user);
        } else {
          reject(new Error("User not found"));
        }
      }, 300);
    });
  },

  create: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const newUser = {
          id: getNextId(users),
          ...data,
          role: data.role || "user"
        };
        users.push(newUser);
        saveUsers(users);
        resolve(newUser);
      }, 300);
    });
  },

  update: async (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
          users[index] = { ...users[index], ...data };
          saveUsers(users);
          resolve(users[index]);
        } else {
          reject(new Error("User not found"));
        }
      }, 300);
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
          const deleted = users.splice(index, 1);
          saveUsers(users);
          resolve(deleted[0]);
        } else {
          reject(new Error("User not found"));
        }
      }, 300);
    });
  },

  changePassword: async (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.id === parseInt(id));
        if (user) {
          resolve({ message: "Password changed successfully" });
        } else {
          reject(new Error("User not found"));
        }
      }, 300);
    });
  },
};
