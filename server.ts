import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Bundau';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Mue1609';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial state
const DEFAULT_DATA = {
  coverImage: '',
  coverTitle: 'MY LOVE',
  coverSubtitle: 'Một góc nhỏ để lưu lại những trang sách, những project và những lời nhắn đáng yêu.',
  messbookPages: [
    {
      id: 'page-1',
      pageNumber: 1,
      title: 'Trang Bìa - Bản Scan Sổ Tay Kỷ Niệm',
      caption: 'Bìa sách thủ công với nét chữ viết tay và hoa ép khô kỷ niệm.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      uploadedAt: '10/01/2025',
      comments: [
        {
          id: 'c-1',
          author: 'Mây Nhỏ',
          isAnonymous: false,
          content: 'Nét chữ viết tay xinh xắn và ấm áp quá! Nhìn bìa sổ là thấy bao tâm huyết rồi.',
          createdAt: '11/01/2025 14:20'
        },
        {
          id: 'c-2',
          author: 'Người bạn giấu tên',
          isAnonymous: true,
          content: 'Góc sổ có gắn cánh hoa khô tỉ mỉ quá ạ. Rất mong chờ các trang tiếp theo!',
          createdAt: '12/01/2025 09:15'
        }
      ]
    },
    {
      id: 'page-2',
      pageNumber: 2,
      title: 'Trang 2 - Lời Nhắn Đầu Mùa',
      caption: 'Trang scan những lời chúc và mẩu giấy note từ các bạn gửi về.',
      imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
      uploadedAt: '12/01/2025',
      comments: [
        {
          id: 'c-3',
          author: 'An Nhiên',
          isAnonymous: false,
          content: 'Thấy mẩu note màu vàng góc phải của mình rồi hihi, hạnh phúc quá!',
          createdAt: '13/01/2025 19:40'
        }
      ]
    },
    {
      id: 'page-3',
      pageNumber: 3,
      title: 'Trang 3 - Dấu Ấn Mùa Hạ',
      caption: 'Scan hình ảnh kỷ niệm kèm lời tự sự ngọt ngào dành riêng cho My Love.',
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      uploadedAt: '15/01/2025',
      comments: [
        {
          id: 'c-4',
          author: 'Trăng Tròn',
          isAnonymous: false,
          content: 'Đọc trang này mà rưng rưng xúc động, từng con chữ như sưởi ấm trái tim.',
          createdAt: '16/01/2025 21:05'
        }
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Project Sinh Nhật 2025: "Ánh Sao Trong Mắt"',
      preface: 'Gửi đến My Love tuổi mới thật nhiều an yên và ngập tràn hạnh phúc. Mỗi lời chúc gửi về đây là một vì sao nhỏ thắp sáng chặng đường em đi. Dù ngoài kia có giông bão, nơi này luôn là bến đỗ êm đềm nhất dành riêng cho em.',
      previewUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
      previewType: 'image',
      freegifts: [
        {
          id: 'fg-1',
          title: 'Set Photocard Kỷ Niệm Hologram (Scan)',
          imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
          description: 'Set 4 card ảnh tráng gương lung linh'
        },
        {
          id: 'fg-2',
          title: 'Sticker Tình Ca & Hoa Nhỏ',
          imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
          description: 'Sheet dán sổ thủ công vẽ tay'
        }
      ],
      date: '14/02/2025',
      status: 'completed',
      category: 'Birthday Project',
      createdAt: '2025-01-10'
    },
    {
      id: 'proj-2',
      title: 'Project 500 Ngày Bên Nhau: "Vệt Nắng Hoàng Hôn"',
      preface: '500 ngày cùng nhau vượt qua bao cung bậc cảm xúc, từ những bỡ ngỡ ban đầu cho đến tình cảm sâu đậm ngày hôm nay. Project này là minh chứng cho sự kiên định và tấm lòng chân thành nhất.',
      previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80',
      previewType: 'image',
      freegifts: [
        {
          id: 'fg-4',
          title: 'Lịch Để Bàn 2025 - 12 Khoảnh Khắc',
          imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
          description: 'Lịch thiết kế độc quyền 12 tháng'
        }
      ],
      date: '20/10/2024',
      status: 'completed',
      category: 'Anniversary',
      createdAt: '2024-10-01'
    }
  ],
  feedbacks: [
    {
      id: 'fb-1',
      name: 'Ẩn danh',
      isAnonymous: true,
      category: 'Lời yêu thương',
      content: 'Một góc nhỏ bình yên và đong đầy tình cảm. Cảm ơn admin đã tạo nên trang web tuyệt vời này để tụi mình cùng gửi gắm yêu thương!',
      mood: '💖 Trái tim ấm',
      likes: 18,
      adminReply: 'Cảm ơn tình cảm chân thành của bạn rất nhiều! My Love luôn đón nhận những yêu thương từ bạn.',
      createdAt: '12/02/2025 10:14'
    },
    {
      id: 'fb-2',
      name: 'Tiểu Mộc',
      isAnonymous: false,
      category: 'Messbook',
      content: 'Bản scan Messbook nét và đẹp lắm ạ, lật từng trang đọc bình luận của mọi người mà cảm xúc dâng trào. Mong admin sẽ sớm đăng thêm các trang tiếp theo nhé!',
      mood: '✨ Lấp lánh',
      likes: 12,
      createdAt: '14/02/2025 16:30'
    }
  ]
};

function readData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
      return DEFAULT_DATA;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      ...DEFAULT_DATA,
      ...parsed,
      coverImage: parsed.coverImage !== undefined ? parsed.coverImage : DEFAULT_DATA.coverImage,
      coverTitle: parsed.coverTitle || DEFAULT_DATA.coverTitle,
      coverSubtitle: parsed.coverSubtitle || DEFAULT_DATA.coverSubtitle,
    };
  } catch (err) {
    console.error('Error reading db.json, returning default data:', err);
    return DEFAULT_DATA;
  }
}

function writeData(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

// ---------------- API ROUTES ----------------

// Verify Admin Credentials (User: Bundau, Pass: Mue1609)
app.post('/api/admin/verify', (req, res) => {
  const { username, password } = req.body;
  const normalizedUser = (username || '').trim().toLowerCase();
  const expectedUser = ADMIN_USERNAME.toLowerCase();

  // Allow either providing correct username & password, or password match if username is already implied
  const isUserValid = !username || normalizedUser === expectedUser;
  const isPassValid = password === ADMIN_PASSWORD;

  if (isUserValid && isPassValid) {
    res.json({ success: true, token: 'admin-authorized-token' });
  } else {
    res.status(401).json({
      success: false,
      message: 'Tài khoản hoặc mật khẩu quản trị viên không chính xác (Yêu cầu User: Bundau và Pass: Mue1609).'
    });
  }
});

// Middleware for Admin operations
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers['authorization'];
  const passHeader = req.headers['x-admin-password'];
  if (token === 'Bearer admin-authorized-token' || passHeader === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(403).json({ error: 'Chỉ có admin mới có quyền thực hiện thao tác này.' });
  }
}

// GET all data
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// Update Cover Image & Hero Text (Admin)
app.post('/api/cover', requireAdmin, (req, res) => {
  const data = readData();
  const { coverImage, coverTitle, coverSubtitle } = req.body;
  if (coverImage !== undefined) {
    data.coverImage = coverImage;
  }
  if (coverTitle !== undefined) {
    data.coverTitle = coverTitle;
  }
  if (coverSubtitle !== undefined) {
    data.coverSubtitle = coverSubtitle;
  }
  writeData(data);
  res.json({
    success: true,
    coverImage: data.coverImage,
    coverTitle: data.coverTitle,
    coverSubtitle: data.coverSubtitle
  });
});

// MESSBOOK ROUTES
// Add scan page (Admin)
app.post('/api/messbook/page', requireAdmin, (req, res) => {
  const data = readData();
  const { title, caption, imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'Vui lòng cung cấp hình ảnh bản scan' });
  }
  const newPage = {
    id: 'page-' + Date.now(),
    pageNumber: data.messbookPages.length + 1,
    title: title || `Trang ${data.messbookPages.length + 1}`,
    caption: caption || '',
    imageUrl,
    uploadedAt: new Date().toLocaleDateString('vi-VN'),
    comments: []
  };
  data.messbookPages.push(newPage);
  writeData(data);
  res.json({ success: true, page: newPage });
});

// Delete scan page (Admin)
app.delete('/api/messbook/page/:id', requireAdmin, (req, res) => {
  const data = readData();
  const { id } = req.params;
  const initialLength = data.messbookPages.length;
  data.messbookPages = data.messbookPages.filter((p: any) => p.id !== id);
  // Re-index page numbers
  data.messbookPages.forEach((p: any, idx: number) => {
    p.pageNumber = idx + 1;
  });
  writeData(data);
  res.json({ success: true, deleted: initialLength > data.messbookPages.length });
});

// Add comment to scan page (Public)
app.post('/api/messbook/comment', (req, res) => {
  const data = readData();
  const { pageId, author, isAnonymous, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Nội dung bình luận không được để trống' });
  }
  const page = data.messbookPages.find((p: any) => p.id === pageId);
  if (!page) {
    return res.status(404).json({ error: 'Không tìm thấy trang sách' });
  }
  const newComment = {
    id: 'c-' + Date.now(),
    author: isAnonymous ? 'Người bạn giấu tên' : (author && author.trim() ? author.trim() : 'Bạn đọc'),
    isAnonymous: !!isAnonymous,
    content: content.trim(),
    createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
  page.comments.push(newComment);
  writeData(data);
  res.json({ success: true, comment: newComment });
});

// Delete comment (Admin)
app.delete('/api/messbook/comment/:pageId/:commentId', requireAdmin, (req, res) => {
  const data = readData();
  const { pageId, commentId } = req.params;
  const page = data.messbookPages.find((p: any) => p.id === pageId);
  if (!page) {
    return res.status(404).json({ error: 'Không tìm thấy trang sách' });
  }
  page.comments = page.comments.filter((c: any) => c.id !== commentId);
  writeData(data);
  res.json({ success: true });
});

// PROJECT ROUTES
// Add Project (Admin)
app.post('/api/projects', requireAdmin, (req, res) => {
  const data = readData();
  const { title, preface, previewUrl, previewType, freegifts, date, status, category } = req.body;
  if (!title || !preface) {
    return res.status(400).json({ error: 'Vui lòng điền tiêu đề và lời tựa cho project' });
  }
  const newProject = {
    id: 'proj-' + Date.now(),
    title,
    preface,
    previewUrl: previewUrl || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
    previewType: previewType || 'image',
    freegifts: Array.isArray(freegifts) ? freegifts : [],
    date: date || new Date().toLocaleDateString('vi-VN'),
    status: status || 'completed',
    category: category || 'General Project',
    createdAt: new Date().toISOString()
  };
  data.projects.unshift(newProject);
  writeData(data);
  res.json({ success: true, project: newProject });
});

// Edit Project (Admin)
app.put('/api/projects/:id', requireAdmin, (req, res) => {
  const data = readData();
  const { id } = req.params;
  const index = data.projects.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy project' });
  }
  data.projects[index] = {
    ...data.projects[index],
    ...req.body,
    id // preserve id
  };
  writeData(data);
  res.json({ success: true, project: data.projects[index] });
});

// Delete Project (Admin)
app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const data = readData();
  const { id } = req.params;
  data.projects = data.projects.filter((p: any) => p.id !== id);
  writeData(data);
  res.json({ success: true });
});

// FEEDBACK (Ý KIẾN) ROUTES
// Add feedback (Public - anonymous or named)
app.post('/api/feedback', (req, res) => {
  const data = readData();
  const { name, isAnonymous, category, content, mood } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập nội dung góp ý' });
  }
  const newFeedback = {
    id: 'fb-' + Date.now(),
    name: isAnonymous ? 'Ẩn danh' : (name && name.trim() ? name.trim() : 'Ẩn danh'),
    isAnonymous: !!isAnonymous,
    category: category || 'Góp ý chung',
    content: content.trim(),
    mood: mood || '💖 Lời yêu thương',
    likes: 0,
    createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
  data.feedbacks.unshift(newFeedback);
  writeData(data);
  res.json({ success: true, feedback: newFeedback });
});

// Like feedback (Public)
app.post('/api/feedback/:id/like', (req, res) => {
  const data = readData();
  const { id } = req.params;
  const fb = data.feedbacks.find((f: any) => f.id === id);
  if (!fb) return res.status(404).json({ error: 'Không tìm thấy ý kiến' });
  fb.likes = (fb.likes || 0) + 1;
  writeData(data);
  res.json({ success: true, likes: fb.likes });
});

// Reply to feedback (Admin)
app.post('/api/feedback/:id/reply', requireAdmin, (req, res) => {
  const data = readData();
  const { id } = req.params;
  const { adminReply } = req.body;
  const fb = data.feedbacks.find((f: any) => f.id === id);
  if (!fb) return res.status(404).json({ error: 'Không tìm thấy ý kiến' });
  fb.adminReply = adminReply;
  writeData(data);
  res.json({ success: true, feedback: fb });
});

// Delete feedback (Admin)
app.delete('/api/feedback/:id', requireAdmin, (req, res) => {
  const data = readData();
  const { id } = req.params;
  data.feedbacks = data.feedbacks.filter((f: any) => f.id !== id);
  writeData(data);
  res.json({ success: true });
});

// Start Server with Vite
async function startServer() {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`My Love server running on http://localhost:${PORT}`);
  });
}

startServer();
