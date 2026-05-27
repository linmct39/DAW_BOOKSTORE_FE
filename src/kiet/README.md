# 👤 KIET Module - Book Catalog

## 📖 Responsibility
- Home page with featured books
- Search & filter by category
- Book details/description page
- Book browsing and discovery

## 📁 Structure
```
kiet/
├── pages/
│   ├── Home.tsx
│   ├── Search.tsx
│   └── BookDetail.tsx
├── components/
│   └── (add Kiet-specific components here)
├── services/
│   └── (add Kiet-specific services here)
└── index.ts
```

## 🔗 Routes
- `/` - Home page
- `/search?q=<query>&category_id=<id>` - Search results
- `/books/:id` - Book details

## 📦 Using Services
```tsx
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';

// Get all books
const books = await bookService.getAll();

// Get book by ID
const book = await bookService.getById(id);

// Get by category
const books = await bookService.getByCategory(categoryId);

// Get all categories
const categories = await categoryService.getAll();
```

## 🎨 Components to Create
- [ ] BookCard - Display individual book
- [ ] BookGrid - Display multiple books
- [ ] CategoryFilter - Filter by category
- [ ] SearchBar - Search books

## ✅ Status
- ✅ Pages created and organized
- ✅ Services accessible
- ✅ Routes defined in App.tsx
- ⏳ Ready for integration

## 📝 Notes
- Use TypeScript (.tsx) for components
- Reuse components from `src/shared/` when possible
- Keep module independent from Linh & Hoang's code
