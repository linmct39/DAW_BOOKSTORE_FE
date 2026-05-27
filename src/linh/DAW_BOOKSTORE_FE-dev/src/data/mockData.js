export const mockBooks = [
    {
        id: 1,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        price: 250000,
        categoryId: 1,
        stock: 15,
        description: 'A Handbook of Agile Software Craftsmanship',
        image: 'https://via.placeholder.com/150?text=Clean+Code',
    },
    {
        id: 2,
        title: 'Design Patterns',
        author: 'Gang of Four',
        price: 320000,
        categoryId: 1,
        stock: 10,
        description: 'Elements of Reusable Object-Oriented Software',
        image: 'https://via.placeholder.com/150?text=Design+Patterns',
    },
    {
        id: 3,
        title: 'JavaScript: The Good Parts',
        author: 'Douglas Crockford',
        price: 180000,
        categoryId: 2,
        stock: 20,
        description: 'Master the JavaScript language',
        image: 'https://via.placeholder.com/150?text=JS+Good+Parts',
    },
    {
        id: 4,
        title: 'React in Action',
        author: 'Mark Thomas',
        price: 380000,
        categoryId: 2,
        stock: 8,
        description: 'Building modern web applications with React',
        image: 'https://via.placeholder.com/150?text=React+in+Action',
    },
    {
        id: 5,
        title: 'Dune',
        author: 'Frank Herbert',
        price: 150000,
        categoryId: 3,
        stock: 25,
        description: 'Epic science fiction novel',
        image: 'https://via.placeholder.com/150?text=Dune',
    },
];

export const mockInvoices = [
    {
        id: 1,
        userId: 2,
        userName: 'John Doe',
        items: [
            { bookId: 1, title: 'Clean Code', quantity: 1, price: 250000 },
        ],
        totalAmount: 275000,
        tax: 25000,
        subtotal: 250000,
        status: 'completed',
        paymentMethod: 'credit_card',
        createdAt: '2026-05-20',
        shippingAddress: '456 Main St',
    },
    {
        id: 2,
        userId: 3,
        userName: 'Jane Smith',
        items: [
            { bookId: 3, title: 'JavaScript: The Good Parts', quantity: 2, price: 180000 },
        ],
        totalAmount: 396000,
        tax: 36000,
        subtotal: 360000,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        createdAt: '2026-05-25',
        shippingAddress: '789 Oak Ave',
    },
];

export const getNextId = (items) => {
    return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
};