import { AppStateData } from '../types';

export const INITIAL_DATA: AppStateData = {
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
    },
    {
      id: 'page-4',
      pageNumber: 4,
      title: 'Trang 4 - Nguyện Ước Tương Lai',
      caption: 'Trang ký tên và những lời chúc bình an, chúc cho hành trình rực rỡ.',
      imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
      uploadedAt: '18/01/2025',
      comments: [
        {
          id: 'c-5',
          author: 'Ẩn danh',
          isAnonymous: true,
          content: 'Chúc cho My Love luôn mỉm cười và tỏa sáng nhé!',
          createdAt: '20/01/2025 08:30'
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
        },
        {
          id: 'fg-3',
          title: 'Bookmark Gỗ Khắc Nổi Kỷ Niệm',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          description: 'Kẹp sách gỗ khắc hoa cúc và lời tựa'
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
        },
        {
          id: 'fg-5',
          title: 'Postcard Scan Tranh Vẽ Màu Nước',
          imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
          description: 'Bản in nghệ thuật giới hạn'
        }
      ],
      date: '20/10/2024',
      status: 'completed',
      category: 'Anniversary',
      createdAt: '2024-10-01'
    },
    {
      id: 'proj-3',
      title: 'Project Mùa Hạ Rực Rỡ: "Hẹn Ước Dưới Khung Trời"',
      preface: 'Đang trong quá trình ấp ủ chuẩn bị những bất ngờ lớn cho mùa hè này! Những món quà tri ân và các hoạt động offline tiếp lửa cho hành trình mới sẽ sớm được hé lộ.',
      previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      previewType: 'image',
      freegifts: [
        {
          id: 'fg-6',
          title: 'Vé Bo Góc Kỷ Niệm (Special Hologram Ticket)',
          imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
          description: 'Vé mời phiên bản giới hạn'
        }
      ],
      date: '15/07/2025',
      status: 'upcoming',
      category: 'Special Support',
      createdAt: '2025-02-01'
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
    },
    {
      id: 'fb-3',
      name: 'Bé Gió Mùa Thu',
      isAnonymous: false,
      category: 'Project',
      content: 'Bộ Freegifts của Project Sinh Nhật đợt rồi cưng xỉu luôn á! Mình đã đóng khung treo góc học tập rồi nè.',
      mood: '🌸 Ngọt ngào',
      likes: 9,
      createdAt: '16/02/2025 20:05'
    },
    {
      id: 'fb-4',
      name: 'Người theo dõi thầm lặng',
      isAnonymous: true,
      category: 'Góp ý chung',
      content: 'Giao diện màu nâu ấm kết hợp hồng pastel nhìn sang và tình cảm lắm. Hi vọng sau này web có thêm nhạc nền êm dịu nữa thì tuyệt vời hơn nữa!',
      mood: '🎶 Du dương',
      likes: 15,
      adminReply: 'Gợi ý cực kỳ tuyệt vời! Admin sẽ lưu ý để tích hợp thêm list nhạc chill nhẹ nhàng trong bản cập nhật tới nhé.',
      createdAt: '18/02/2025 09:22'
    }
  ]
};
