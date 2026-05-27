import { mockInvoices, getNextId } from '../data/mockData';

const STORAGE_KEY = 'invoices_data';

const initializeData = () => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInvoices));
    }
};

const getInvoices = () => {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

const saveInvoices = (invoices) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
};

export const invoiceService = {
    getAll: async () =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(getInvoices());
            }, 300);
        }),

    getById: async (id) =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                const invoices = getInvoices();
                const invoice = invoices.find((item) => item.id === parseInt(id, 10));
                if (invoice) {
                    resolve(invoice);
                } else {
                    reject(new Error('Invoice not found'));
                }
            }, 300);
        }),

    create: async (data) =>
        new Promise((resolve) => {
            setTimeout(() => {
                const invoices = getInvoices();
                const newInvoice = {
                    id: getNextId(invoices),
                    ...data,
                    status: data.status || 'pending',
                    createdAt: new Date().toISOString().split('T')[0],
                };
                invoices.push(newInvoice);
                saveInvoices(invoices);
                resolve(newInvoice);
            }, 300);
        }),

    update: async (id, data) =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                const invoices = getInvoices();
                const index = invoices.findIndex((item) => item.id === parseInt(id, 10));
                if (index !== -1) {
                    invoices[index] = { ...invoices[index], ...data };
                    saveInvoices(invoices);
                    resolve(invoices[index]);
                } else {
                    reject(new Error('Invoice not found'));
                }
            }, 300);
        }),

    delete: async (id) =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                const invoices = getInvoices();
                const index = invoices.findIndex((item) => item.id === parseInt(id, 10));
                if (index !== -1) {
                    const deleted = invoices.splice(index, 1);
                    saveInvoices(invoices);
                    resolve(deleted[0]);
                } else {
                    reject(new Error('Invoice not found'));
                }
            }, 300);
        }),

    getByUserId: async (userId) =>
        new Promise((resolve) => {
            setTimeout(() => {
                const invoices = getInvoices();
                const filtered = invoices.filter((item) => item.userId === parseInt(userId, 10));
                resolve(filtered);
            }, 300);
        }),
};