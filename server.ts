import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";

// Initial seed database
interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
  featured: boolean;
  stock: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: "admin" | "user";
  password?: string; // stored plainly for ease of demonstration
}

interface InvoiceItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Invoice {
  id: string;
  userId: string;
  userEmail: string;
  fullName: string;
  phone: string;
  shippingAddress: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
}

// In-memory data store with Vietnamese book seeds
let categories: Category[] = [];

let books: Book[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 50000,
    description: "Programming best practices",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    categoryId: "1",
    featured: true,
    stock: 10,
  },
  {
    id: "2",
    title: "Design Patterns",
    author: "Gang of Four",
    price: 75000,
    description: "Reusable solutions to common problems",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=400",
    categoryId: "1",
    featured: true,
    stock: 8,
  },
  {
    id: "3",
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    price: 60000,
    description: "Your journey to mastery",
    imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400",
    categoryId: "1",
    featured: true,
    stock: 12,
  },
  {
    id: "4",
    title: "Refactoring",
    author: "Martin Fowler",
    price: 55000,
    description: "Improving the design of existing code",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400",
    categoryId: "1",
    featured: false,
    stock: 6,
  },
  {
    id: "5",
    title: "The Mythical Man-Month",
    author: "Fred Brooks",
    price: 45000,
    description: "Essays on software engineering",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
    categoryId: "1",
    featured: false,
    stock: 5,
  },
];

let users: User[] = [];

let invoices: Invoice[] = [];

async function startServer() {
  const app = express();
  app.use(express.json());

  // ---------------- PROXY ENDPOINTS TO BYPASS BROWSER CORS ----------------
  // Proxy for Vercel Auth API
  app.all("/api/remote-auth/*", async (req, res) => {
    try {
      const targetPath = req.params[0];
      const targetUrl = `https://bookking000.vercel.app/api/${targetPath}`;
      
      const headers: any = {};
      
      // Forward headers like Content-Type and Authorization
      if (req.headers["content-type"]) {
        headers["content-type"] = req.headers["content-type"];
      }
      if (req.headers.authorization) {
        headers.authorization = req.headers["authorization"];
      }

      // Only forward body if the request actually has mutating content to send
      let requestData: any = undefined;
      const hasBody = ["POST", "PUT", "PATCH"].includes(req.method.toUpperCase()) || (req.body && Object.keys(req.body).length > 0);
      if (hasBody) {
        requestData = req.body;
        const contentType = req.headers["content-type"] || "";
        if (contentType.includes("multipart/form-data")) {
          requestData = req;
        }
      }

      console.log(`[PROXY-AUTH] Forwarding ${req.method} to ${targetUrl}`);

      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: requestData,
        params: req.query,
        headers: headers,
        validateStatus: () => true,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });

      // Transfer response headers (e.g., content-type)
      if (response.headers["content-type"]) {
        res.setHeader("content-type", String(response.headers["content-type"]));
      }
      
      res.status(response.status).send(response.data);
    } catch (error: any) {
      console.error("[PROXY-AUTH] Error:", error);
      res.status(500).json({ success: false, message: "Proxy error: " + error.message });
    }
  });

  // Proxy for Onrender Books API
  app.all("/api/remote-books/*", async (req, res) => {
    try {
      const targetPath = req.params[0];
      const targetUrl = `https://daw-bookstore-be.onrender.com/${targetPath}`;
      
      const headers: any = {};
      if (req.headers["content-type"]) {
        headers["content-type"] = req.headers["content-type"];
      }
      if (req.headers.authorization) {
        headers.authorization = req.headers["authorization"];
      }

      // Only forward body if the request actually has mutating content to send
      let requestData: any = undefined;
      const hasBody = ["POST", "PUT", "PATCH"].includes(req.method.toUpperCase()) || (req.body && Object.keys(req.body).length > 0);
      if (hasBody) {
        requestData = req.body;
        const contentType = req.headers["content-type"] || "";
        if (contentType.includes("multipart/form-data")) {
          requestData = req;
        }
      }

      console.log(`[PROXY-BOOKS] Forwarding ${req.method} to ${targetUrl}`);

      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: requestData,
        params: req.query,
        headers: headers,
        validateStatus: () => true,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });

      if (response.headers["content-type"]) {
        res.setHeader("content-type", String(response.headers["content-type"]));
      }
      
      res.status(response.status).send(response.data);
    } catch (error: any) {
      console.error("[PROXY-BOOKS] Error:", error);
      res.status(500).json({ success: false, message: "Proxy error: " + error.message });
    }
  });

  // API Middleware for Simple Auth simulation
  const extractUser = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      // Let's decode token. Plainly mock token as user email
      const user = users.find(u => u.email === token);
      if (user) {
        req.user = user;
      }
    }
    next();
  };
  app.use(extractUser);

  // Auth Guard Middlewares
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(418).json({ message: "Vui lòng đăng nhập để thực hiện" });
    }
    next();
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Quyền truy cập bị từ chối. Chỉ dành cho Admin." });
    }
    next();
  };

  // ---------------- AUTH API ----------------
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
    }
    // Token is just the email in this simple, elegant backend
    const token = user.email;
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  });

  app.post("/api/auth/register", (req, res) => {
    const { email, password, fullName, phone, address } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ email, mật khẩu và họ tên." });
    }
    const exists = users.some(u => u.email === email);
    if (exists) {
      return res.status(400).json({ message: "Email này đã được đăng ký!" });
    }
    const newUser: User = {
      id: "user-" + Date.now(),
      email,
      fullName,
      password,
      role: "user",
      phone: phone || "",
      address: address || ""
    };
    users.push(newUser);
    res.status(201).json({
      token: newUser.email,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address
      }
    });
  });

  app.get("/api/users/profile", requireAuth, (req: any, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      role: user.role
    });
  });

  app.put("/api/users/profile", requireAuth, (req: any, res) => {
    const { fullName, phone, address, password } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (password) user.password = password;

    res.json({
      message: "Cập nhật tài khoản thành công!",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  });

  // ---------------- CATEGORIES API ----------------
  app.get("/api/categories", (req, res) => {
    res.json(categories);
  });

  app.post("/api/categories", requireAdmin, (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Tên danh mục không được trống" });
    const newCat: Category = {
      id: "cat-" + Date.now(),
      name,
      description: description || ""
    };
    categories.push(newCat);
    res.status(201).json(newCat);
  });

  app.put("/api/categories/:id", requireAdmin, (req, res) => {
    const { name, description } = req.body;
    const cat = categories.find(c => c.id === req.params.id);
    if (!cat) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    if (name) cat.name = name;
    if (description !== undefined) cat.description = description;
    res.json(cat);
  });

  app.delete("/api/categories/:id", requireAdmin, (req, res) => {
    const idx = categories.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    // Keep at least one category to avoid breaks
    categories.splice(idx, 1);
    res.json({ message: "Xóa danh mục thành công" });
  });

  // ---------------- BOOKS API ----------------
  app.get("/api/books", (req, res) => {
    const { search, category, featured } = req.query;
    let filteredBooks = [...books];

    if (search) {
      const q = String(search).toLowerCase();
      filteredBooks = filteredBooks.filter(
        b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    if (category) {
      filteredBooks = filteredBooks.filter(b => b.categoryId === category);
    }
    if (featured === "true") {
      filteredBooks = filteredBooks.filter(b => b.featured === true);
    }

    res.json(filteredBooks);
  });

  app.get("/api/books/:id", (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.json(book);
  });

  app.post("/api/books", requireAdmin, (req, res) => {
    const { title, author, price, description, imageUrl, categoryId, featured, stock } = req.body;
    if (!title || !author || price === undefined) {
      return res.status(400).json({ message: "Thiếu thông tin sách bắt buộc (tiêu đề, tác giả, giá)" });
    }
    const newBook: Book = {
      id: "book-" + Date.now(),
      title,
      author,
      price: Number(price),
      description: description || "",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
      categoryId: categoryId || "cat-1",
      featured: featured === true || String(featured) === "true",
      stock: stock !== undefined ? Number(stock) : 10
    };
    books.push(newBook);
    res.status(201).json(newBook);
  });

  app.put("/api/books/:id", requireAdmin, (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });

    const { title, author, price, description, imageUrl, categoryId, featured, stock } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (price !== undefined) book.price = Number(price);
    if (description !== undefined) book.description = description;
    if (imageUrl !== undefined) book.imageUrl = imageUrl;
    if (categoryId !== undefined) book.categoryId = categoryId;
    if (featured !== undefined) book.featured = (featured === true || String(featured) === "true");
    if (stock !== undefined) book.stock = Number(stock);

    res.json(book);
  });

  app.delete("/api/books/:id", requireAdmin, (req, res) => {
    const idx = books.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Không tìm thấy sách" });
    books.splice(idx, 1);
    res.json({ message: "Xóa sách thành công!" });
  });

  // ---------------- USER ADMINISTRATION API ----------------
  app.get("/api/users", requireAdmin, (req, res) => {
    // Hide password fields in responses
    const filteredUsers = users.map(({ password, ...u }) => u);
    res.json(filteredUsers);
  });

  app.post("/api/users", requireAdmin, (req, res) => {
    const { email, password, fullName, phone, address, role } = req.body;
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng bắt buộc" });
    }
    if (users.some(u => u.email === email)) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    const newUser: User = {
      id: "user-" + Date.now(),
      email,
      fullName,
      password,
      phone: phone || "",
      address: address || "",
      role: role === "admin" ? "admin" : "user"
    };
    users.push(newUser);
    const { password: _, ...responseUser } = newUser;
    res.status(201).json(responseUser);
  });

  app.put("/api/users/:id", requireAdmin, (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    const { fullName, phone, address, password, role } = req.body;
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (password) user.password = password;
    if (role) user.role = role === "admin" ? "admin" : "user";

    const { password: _, ...responseUser } = user;
    res.json(responseUser);
  });

  app.delete("/api/users/:id", requireAdmin, (req: any, res) => {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Bạn không thể tự xóa tài khoản của chính mình!" });
    }
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    users.splice(idx, 1);
    res.json({ message: "Xóa tài khoản thành công!" });
  });

  // ---------------- INVOICES API ----------------
  app.get("/api/invoices", requireAuth, (req: any, res) => {
    if (req.user.role === "admin") {
      // Admin sees everything
      return res.json(invoices);
    }
    // Users see only their own invoices
    const userInvoices = invoices.filter(inv => inv.userId === req.user.id);
    res.json(userInvoices);
  });

  // Removed admin-only invoices listing endpoint to avoid exposing invoice list via /api/admin/invoices
  // If admin access to all invoices is required later, re-add a protected endpoint with proper auth.

  app.get("/api/invoices/:id", requireAuth, (req: any, res) => {
    const inv = invoices.find(i => i.id === req.params.id);
    if (!inv) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // Users can only view their own invoices, exception for admin
    if (req.user.role !== "admin" && inv.userId !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập đơn hàng này" });
    }
    res.json(inv);
  });

  const handleCreateInvoice = (req: any, res: any) => {
    const rawItems = req.body.items;
    const userId = req.user ? req.user.id : (req.body.user_id || 30);
    const userEmail = req.user ? req.user.email : `user_${userId}@example.com`;
    const fullName = req.body.fullName || req.body.receiver_name || req.body.receiverName || "Khách Hàng API";
    const phone = req.body.phone || req.body.phone_number || req.body.phoneNumber || "0987654321";
    const shippingAddress = req.body.shippingAddress || req.body.shipping_address || req.body.address || req.body.note || "Giao giờ hành chính";
    const user_id = req.body.user_id || Number(userId);
    const total_amount = req.body.total_amount || req.body.totalAmount;
    const note = req.body.note || "";

    // Validate basic required fields
    if (!rawItems || !Array.isArray(rawItems)) {
      return res.status(400).json({ message: "Danh sách sản phẩm (items) không hợp lệ" });
    }
    if (rawItems.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng rỗng, không thể tạo hóa đơn." });
    }

    // Basic phone format validation
    if (phone && !/^[0-9+]{7,15}$/.test(String(phone))) {
      return res.status(400).json({ message: "số điện thoại không đúng cấu trúc" });
    }

    // Process items without validating against local books
    // (Frontend books come from remote API, so just accept the items as-is)
    let totalAmount = 0;
    const invoiceItems: InvoiceItem[] = [];

    for (let idx = 0; idx < rawItems.length; idx++) {
      const item = rawItems[idx];
      const bId = item.bookId !== undefined ? item.bookId : item.book_id;
      if (bId === undefined) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm tại vị trí ${idx + 1} không đúng cấu trúc (thiếu ID, số lượng hoặc đơn giá).`
        });
      }

      const q = Number(item.quantity) || Number(item.qty) || 1;
      if (q <= 0) {
        return res.status(400).json({
          message: `Sản phẩm tại vị trí ${idx + 1} phải có số lượng > 0.`
        });
      }

      // Accept unit_price from frontend (client has the correct price from remote API)
      const price = Number(item.price !== undefined ? item.price : item.unit_price !== undefined ? item.unit_price : item.unitPrice);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          message: `Sản phẩm tại vị trí ${idx + 1} phải có giá > 0.`
        });
      }

      const subtotal = price * q;
      totalAmount += subtotal;

      invoiceItems.push({
        bookId: String(bId),
        title: item.title || `Sách #${bId}`,
        price: price,
        quantity: q
      });
    }

    const calculatedTotal = Number(total_amount) || totalAmount;
    const mockInvoiceId = Math.floor(Math.random() * 900) + 10;

    const newInvoice: any = {
      id: String(mockInvoiceId),
      invoice_id: mockInvoiceId,
      userId: userId,
      user_id: user_id,
      userEmail: userEmail,
      fullName,
      phone,
      shippingAddress,
      note,
      items: invoiceItems,
      totalAmount: calculatedTotal,
      total_amount: calculatedTotal,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    invoices.push(newInvoice);
    res.status(200).json({
      success: true,
      message: "Tạo hóa đơn thành công",
      invoice_id: mockInvoiceId,
      ...newInvoice
    });
  };

  app.post("/api/invoices", requireAuth, handleCreateInvoice);
  // Allow creating invoices (e.g., COD checkout) without requiring login
  app.post("/api/invoices/add", handleCreateInvoice);

  app.put("/api/invoices/:id", requireAdmin, (req, res) => {
    const { status } = req.body;
    const inv = invoices.find(i => i.id === req.params.id);
    if (!inv) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (status) {
      inv.status = status;
    }
    res.json(inv);
  });

  // ---------------- VITE DEV SERVER OR STATIC IN PRODUCTION ----------------
  const PORT = 3000;
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running beautifully on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Vô cùng đáng tiếc, server khởi động thất bại:", err);
});
