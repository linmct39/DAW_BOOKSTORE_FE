
export const mockBooks = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 250000,
    categoryId: 1,
    stock: 15,
    description: "A Handbook of Agile Software Craftsmanship",
    image: "https://via.placeholder.com/150?text=Clean+Code"
  },
  {
    id: 2,
    title: "Design Patterns",
    author: "Gang of Four",
    price: 320000,
    categoryId: 1,
    stock: 10,
    description: "Elements of Reusable Object-Oriented Software",
    image: "https://via.placeholder.com/150?text=Design+Patterns"
  },
  {
    id: 3,
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    price: 180000,
    categoryId: 2,
    stock: 20,
    description: "Master the JavaScript language",
    image: "https://via.placeholder.com/150?text=JS+Good+Parts"
  },
  {
    id: 4,
    title: "React in Action",
    author: "Mark Thomas",
    price: 380000,
    categoryId: 2,
    stock: 8,
    description: "Building modern web applications with React",
    image: "https://via.placeholder.com/150?text=React+in+Action"
  },
  {
    id: 5,
    title: "Dune",
    author: "Frank Herbert",
    price: 150000,
    categoryId: 3,
    stock: 25,
    description: "Epic science fiction novel",
    image: "https://via.placeholder.com/150?text=Dune"
  }
];

export const mockCategories = [
  { id: 1, name: "Programming", description: "Software development books" },
  { id: 2, name: "Web Development", description: "Web and frontend books" },
  { id: 3, name: "Fiction", description: "Fiction and fantasy novels" }
];

export const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@bookstore.com", phone: "0123456789", role: "admin", address: "123 Admin St" },
  { id: 2, name: "John Doe", email: "john@example.com", phone: "0987654321", role: "user", address: "456 Main St" },
  { id: 3, name: "Jane Smith", email: "jane@example.com", phone: "0912345678", role: "user", address: "789 Oak Ave" }
];

export const mockInvoices = [
  {
    id: 1,
    userId: 2,
    userName: "John Doe",
    items: [
      { bookId: 1, title: "Clean Code", quantity: 1, price: 250000 }
    ],
    totalAmount: 275000,
    tax: 25000,
    subtotal: 250000,
    status: "completed",
    paymentMethod: "credit_card",
    createdAt: "2026-05-20",
    shippingAddress: "456 Main St"
  },
  {
    id: 2,
    userId: 3,
    userName: "Jane Smith",
    items: [
      { bookId: 3, title: "JavaScript: The Good Parts", quantity: 2, price: 180000 }
    ],
    totalAmount: 396000,
    tax: 36000,
    subtotal: 360000,
    status: "pending",
    paymentMethod: "bank_transfer",
    createdAt: "2026-05-25",
    shippingAddress: "789 Oak Ave"
  }
];

// Helper function to generate next ID
export const getNextId = (items) => {
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
};
