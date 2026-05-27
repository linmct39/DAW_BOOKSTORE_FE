import express from 'express';
import admin from 'firebase-admin';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read config manually
const firebaseConfig = JSON.parse(readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf-8'));

// Initialize Firebase Admin
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
  }
} catch (e) {
  console.error('Firebase Admin Init Error:', e);
}

// Access the database with correct ID
const db = getFirestore(firebaseConfig.firestoreDatabaseId);
db.settings({ ignoreUndefinedProperties: true });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to log requests
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Health Check
  app.get('/', async (req, res) => {
    try {
      res.json({ 
        status: 'UP',
        service: 'Bookstore Service (Proxy Mode)',
        version: '1.0.0',
        external_api: 'https://daw-bookstore-be.onrender.com'
      });
    } catch (e: any) {
      res.status(500).json({ status: 'error', error: e.message });
    }
  });

  const API_BASE_URL = 'https://daw-bookstore-be.onrender.com';
  const AUTH_API_BASE_URL = 'https://bookking000.vercel.app/api';

  async function proxyFetch(targetUrl: string, options: RequestInit = {}, res: express.Response) {
    try {
      console.log(`Proxying ${options.method || 'GET'} to ${targetUrl}`);
      const response = await fetch(targetUrl, options);
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return res.status(response.status).json(data);
      } else {
        const text = await response.text();
        console.log(`Non-JSON response from ${targetUrl} [${response.status}]`);
        try {
          const data = JSON.parse(text);
          return res.status(response.status).json(data);
        } catch {
          if (response.ok) {
            return res.status(response.status).json({ success: true, data: text });
          } else {
            return res.status(response.status).json({ 
              error: 'Backend returned non-JSON error', 
              status: response.status,
              detail: text.substring(0, 500) 
            });
          }
        }
      }
    } catch (e: any) {
      console.error(`Proxy failure for ${targetUrl}:`, e);
      return res.status(500).json({ error: 'Proxy Connection Failed', message: e.message });
    }
  }

  // Categories Proxy
  app.get('/categories/', async (req, res) => {
    await proxyFetch(`${API_BASE_URL}/categories/`, {}, res);
  });

  app.post('/categories/', async (req, res) => {
    await proxyFetch(`${API_BASE_URL}/categories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }, res);
  });

  app.get('/categories/:id', async (req, res) => {
    await proxyFetch(`${API_BASE_URL}/categories/${req.params.id}`, {}, res);
  });

  app.put('/categories/:id', async (req, res) => {
    await proxyFetch(`${API_BASE_URL}/categories/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }, res);
  });

  app.delete('/categories/:id', async (req, res) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${req.params.id}`, {
        method: 'DELETE'
      });
      res.status(response.status).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Books Proxy
  app.get('/books/', async (req, res) => {
    const url = new URL(`${API_BASE_URL}/books/`);
    Object.keys(req.query).forEach(key => url.searchParams.append(key, req.query[key] as string));
    await proxyFetch(url.toString(), {}, res);
  });

  app.get('/books/:id', async (req, res) => {
    await proxyFetch(`${API_BASE_URL}/books/${req.params.id}`, {}, res);
  });

  app.post('/books/', async (req, res) => {
    await proxyFetch(`${API_BASE_URL}/books/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }, res);
  });

  app.put('/books/:id', async (req, res) => {
    await proxyFetch(`${API_BASE_URL}/books/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }, res);
  });

  app.delete('/books/:id', async (req, res) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${req.params.id}`, {
        method: 'DELETE'
      });
      res.status(response.status).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Users Proxy & Registration/Login using AUTH_API_BASE_URL
  app.post('/users/register', async (req, res) => {
    await proxyFetch(`${AUTH_API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }, res);
  });

  app.post('/users/login', async (req, res) => {
    await proxyFetch(`${AUTH_API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }, res);
  });

  app.get('/users/', async (req, res) => {
    try {
      const snap = await db.collection('users').get();
      const users = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      res.json(users);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Invoice APIs using Firestore
  app.get('/invoices/', async (req, res) => {
    try {
      const snap = await db.collection('invoices').orderBy('createdAt', 'desc').get();
      const invoices = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(invoices);
    } catch (e: any) {
      console.error('GET /invoices error:', e);
      res.status(500).json({ error: 'Lỗi truy xuất hóa đơn' });
    }
  });

  app.get('/invoices/:id', async (req, res) => {
    try {
      const doc = await db.collection('invoices').doc(req.params.id).get();
      if (!doc.exists) return res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
      res.json({ id: doc.id, ...doc.data() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/invoices/', async (req, res) => {
    try {
      const invoice = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const docRef = await db.collection('invoices').add(invoice);
      res.status(201).json({ id: docRef.id, ...invoice });
    } catch (e: any) {
      console.error('POST /invoices error:', e);
      res.status(500).json({ error: 'Lỗi khi tạo hóa đơn' });
    }
  });

  app.put('/invoices/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = { ...req.body, updatedAt: new Date().toISOString() };
      await db.collection('invoices').doc(id).update(data);
      res.json({ id, ...data });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/users/', async (req, res) => {
    try {
      const { uid, ...data } = req.body;
      await db.collection('users').doc(uid).set(data, { merge: true });
      res.status(201).json({ id: uid, ...req.body });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/users/:id', async (req, res) => {
    try {
      await db.collection('users').doc(req.params.id).update(req.body);
      res.json({ id: req.params.id, ...req.body });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Invoices
  app.get('/invoices/', async (req, res) => {
    try {
      const snap = await db.collection('invoices').get();
      const invoices = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(invoices);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/invoices/', async (req, res) => {
    try {
      const { items, ...invoiceData } = req.body;
      const invoiceRef = await db.collection('invoices').add({
        ...invoiceData,
        createdAt: new Date().toISOString()
      });
      
      for (const item of items) {
        await invoiceRef.collection('items').add(item);
      }
      
      res.status(201).json({ id: invoiceRef.id, ...invoiceData });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Seed Data
  app.post('/seed/', async (req, res) => {
    try {
      const categories = [
        { name: 'Văn học', description: 'Các tác phẩm văn học kinh điển và hiện đại' },
        { name: 'Kinh tế', description: 'Sách về quản lý, đầu tư và khởi nghiệp' },
        { name: 'Kỹ năng sống', description: 'Phát triển bản thân và tư duy' },
        { name: 'Công nghệ', description: 'Lập trình, AI và xu hướng tech' }
      ];

      const catRefs: any[] = [];
      for (const cat of categories) {
        const ref = await db.collection('categories').add(cat);
        catRefs.push({ id: ref.id, ...cat });
      }

      const books = [
        { 
          title: 'Đắc Nhân Tâm', 
          author: 'Dale Carnegie', 
          price: 89000, 
          stock: 50, 
          category_id: catRefs[2].id, 
          isFeatured: true,
          description: 'Quyển sách nổi tiếng nhất thế giới về nghệ thuật giao tiếp và thuyết phục.',
          imageUrl: 'https://picsum.photos/300?1'
        },
        { 
          title: 'Nhà Giả Kim', 
          author: 'Paulo Coelho', 
          price: 75000, 
          stock: 30, 
          category_id: catRefs[0].id, 
          isFeatured: true,
          description: 'Hành trình tìm kiếm vận mệnh của chàng chăn cừu Santiago.',
          imageUrl: 'https://picsum.photos/300?2'
        },
        { 
          title: 'Cha Giàu Cha Nghèo', 
          author: 'Robert Kiyosaki', 
          price: 120000, 
          stock: 20, 
          category_id: catRefs[1].id, 
          isFeatured: true,
          description: 'Bài học về tài chính để trở nên giàu có.',
          imageUrl: 'https://picsum.photos/300?3'
        },
        { 
          title: 'Clean Code', 
          author: 'Robert C. Martin', 
          price: 450000, 
          stock: 15, 
          category_id: catRefs[3].id, 
          isFeatured: false,
          description: 'Cẩm nang về lập trình chuyên nghiệp.',
          imageUrl: 'https://picsum.photos/300?4'
        },
        {
          title: 'Mắt Biếc',
          author: 'Nguyễn Nhật Ánh',
          price: 95000,
          stock: 25,
          category_id: catRefs[0].id,
          isFeatured: true,
          description: 'Câu chuyện tình đơn phương đầy day dứt của Ngạn dành cho Hà Lan.',
          imageUrl: 'https://picsum.photos/300?5'
        },
        {
          title: 'Số Đỏ',
          author: 'Vũ Trọng Phụng',
          price: 65000,
          stock: 15,
          category_id: catRefs[0].id,
          isFeatured: false,
          description: 'Tác phẩm hiện thực phê phán kinh điển của văn học Việt Nam.',
          imageUrl: 'https://picsum.photos/300?6'
        },
        {
          title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          author: 'Rosie Nguyễn',
          price: 80000,
          stock: 40,
          category_id: catRefs[2].id,
          isFeatured: true,
          description: 'Sách truyền cảm hứng cho bạn trẻ về việc học, làm và đi.',
          imageUrl: 'https://picsum.photos/300?7'
        },
        {
          title: 'Atomic Habits (Thói Quen Nguyên Tử)',
          author: 'James Clear',
          price: 150000,
          stock: 20,
          category_id: catRefs[2].id,
          isFeatured: true,
          description: 'Phương pháp đơn giản để hình thành thói quen tốt và loại bỏ thói quen xấu.',
          imageUrl: 'https://picsum.photos/300?8'
        },
        {
          title: 'Đừng Bao Giờ Đi Ăn Một Mình',
          author: 'Keith Ferrazzi',
          price: 135000,
          stock: 30,
          category_id: catRefs[1].id,
          isFeatured: false,
          description: 'Nghệ thuật kết nối và xây dựng các mối quan hệ.',
          imageUrl: 'https://picsum.photos/300?9'
        },
        {
          title: 'Tôi Tự Học',
          author: 'Thu Giang Nguyễn Duy Cần',
          price: 55000,
          stock: 10,
          category_id: catRefs[2].id,
          isFeatured: false,
          description: 'Kinh nghiệm về phương pháp tự học hiệu quả.',
          imageUrl: 'https://picsum.photos/300?10'
        },
        {
          title: 'Deep Work (Làm Việc Sâu)',
          author: 'Cal Newport',
          price: 185000,
          stock: 25,
          category_id: catRefs[2].id,
          isFeatured: true,
          description: 'Quy tắc để tập trung trong một thế giới đầy xao nhãng.',
          imageUrl: 'https://picsum.photos/300?11'
        },
        {
          title: 'Khởi Nghiệp Tinh Gọn',
          author: 'Eric Ries',
          price: 165000,
          stock: 20,
          category_id: catRefs[1].id,
          isFeatured: true,
          description: 'Cách các công ty khởi nghiệp ngày nay sử dụng sự đổi mới liên tục để tạo ra các doanh nghiệp thành công rực rỡ.',
          imageUrl: 'https://picsum.photos/300?12'
        },
        {
          title: 'Code Complete',
          author: 'Steve McConnell',
          price: 550000,
          stock: 10,
          category_id: catRefs[3].id,
          isFeatured: false,
          description: 'Bản hướng dẫn thiết thực về xây dựng phần mềm.',
          imageUrl: 'https://picsum.photos/300?13'
        },
        {
          title: 'The Pragmatic Programmer',
          author: 'Andrew Hunt & David Thomas',
          price: 480000,
          stock: 12,
          category_id: catRefs[3].id,
          isFeatured: true,
          description: 'Hành trình từ thợ học việc đến bậc thầy.',
          imageUrl: 'https://picsum.photos/300?14'
        }
      ];

      for (const book of books) {
        await db.collection('books').add(book);
      }

      res.status(201).json({ message: 'Seed data complete' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Help serve artifacts
  app.use('/artifacts', express.static(path.join(__dirname, 'artifacts')));

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', description: err.message });
  });

  const seedData = async () => {
    try {
      console.log('--- Checking database status ---');
      const catsSnap = await db.collection('categories').get();
      const booksSnap = await db.collection('books').get();
      
      let catRefs: any[] = catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (catRefs.length === 0) {
        console.log('Categories empty, seeding categories...');
        const categories = [
          { name: 'Văn học', description: 'Các tác phẩm văn học kinh điển và hiện đại' },
          { name: 'Kinh tế', description: 'Sách về quản lý, đầu tư và khởi nghiệp' },
          { name: 'Kỹ năng sống', description: 'Phát triển bản thân và tư duy' },
          { name: 'Công nghệ', description: 'Lập trình, AI và xu hướng tech' }
        ];
        for (const cat of categories) {
          const ref = await db.collection('categories').add(cat);
          catRefs.push({ id: ref.id, ...cat });
        }
      }

      if (booksSnap.empty) {
        console.log('Books empty, seeding books...');
        const books = [
          { 
            title: 'Đắc Nhân Tâm', 
            author: 'Dale Carnegie', 
            price: 89000, 
            stock: 50, 
            category_id: catRefs[2].id, 
            isFeatured: true,
            description: 'Quyển sách nổi tiếng nhất thế giới về nghệ thuật giao tiếp và thuyết phục.',
            imageUrl: 'https://picsum.photos/300?1'
          },
          { 
            title: 'Nhà Giả Kim', 
            author: 'Paulo Coelho', 
            price: 75000, 
            stock: 30, 
            category_id: catRefs[0].id, 
            isFeatured: true,
            description: 'Hành trình tìm kiếm vận mệnh của chàng chăn cừu Santiago.',
            imageUrl: 'https://picsum.photos/300?2'
          },
          { 
            title: 'Cha Giàu Cha Nghèo', 
            author: 'Robert Kiyosaki', 
            price: 120000, 
            stock: 20, 
            category_id: catRefs[1].id, 
            isFeatured: true,
            description: 'Bài học về tài chính để trở nên giàu có.',
            imageUrl: 'https://picsum.photos/300?3'
          },
          { 
            title: 'Clean Code', 
            author: 'Robert C. Martin', 
            price: 450000, 
            stock: 15, 
            category_id: catRefs[3].id, 
            isFeatured: false,
            description: 'Cẩm nang về lập trình chuyên nghiệp.',
            imageUrl: 'https://picsum.photos/300?4'
          },
          {
            title: 'Mắt Biếc',
            author: 'Nguyễn Nhật Ánh',
            price: 95000,
            stock: 25,
            category_id: catRefs[0].id,
            isFeatured: true,
            description: 'Câu chuyện tình đơn phương đầy day dứt của Ngạn dành cho Hà Lan.',
            imageUrl: 'https://picsum.photos/300?5'
          },
          {
            title: 'Số Đỏ',
            author: 'Vũ Trọng Phụng',
            price: 65000,
            stock: 15,
            category_id: catRefs[0].id,
            isFeatured: false,
            description: 'Tác phẩm hiện thực phê phán kinh điển của văn học Việt Nam.',
            imageUrl: 'https://picsum.photos/300?6'
          },
          {
            title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
            author: 'Rosie Nguyễn',
            price: 80000,
            stock: 40,
            category_id: catRefs[2].id,
            isFeatured: true,
            description: 'Sách truyền cảm hứng cho bạn trẻ về việc học, làm và đi.',
            imageUrl: 'https://picsum.photos/300?7'
          },
          {
            title: 'Thói Quen Nguyên Tử',
            author: 'James Clear',
            price: 150000,
            stock: 20,
            category_id: catRefs[2].id,
            isFeatured: true,
            description: 'Phương pháp đơn giản để hình thành thói quen tốt và loại bỏ thói quen xấu.',
            imageUrl: 'https://picsum.photos/300?8'
          },
          {
            title: 'Đừng Bao Giờ Đi Ăn Một Mình',
            author: 'Keith Ferrazzi',
            price: 135000,
            stock: 30,
            category_id: catRefs[1].id,
            isFeatured: false,
            description: 'Nghệ thuật kết nối và xây dựng các mối quan hệ.',
            imageUrl: 'https://picsum.photos/300?9'
          },
          {
            title: 'Tôi Tự Học',
            author: 'Thu Giang Nguyễn Duy Cần',
            price: 55000,
            stock: 10,
            category_id: catRefs[2].id,
            isFeatured: false,
            description: 'Kinh nghiệm về phương pháp tự học hiệu quả.',
            imageUrl: 'https://picsum.photos/300?10'
          },
          {
            title: 'Deep Work',
            author: 'Cal Newport',
            price: 185000,
            stock: 25,
            category_id: catRefs[2].id,
            isFeatured: true,
            description: 'Quy tắc để tập trung trong một thế giới đầy xao nhãng.',
            imageUrl: 'https://picsum.photos/300?11'
          }
        ];
        for (const book of books) {
          await db.collection('books').add(book);
        }
        console.log('Books seeded.');
      }
      console.log('Database check complete.');
    } catch (e) {
      console.error('Auto-seed failed:', e);
    }
  };

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      seedData();
    });
  } else {
    // For Vercel, just run seed once if possible or omit
    seedData();
  }

  return app;
}

export const app = startServer();

