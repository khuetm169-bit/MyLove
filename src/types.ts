export interface MessbookComment {
  id: string;
  author: string;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
}

export interface MessbookPage {
  id: string;
  pageNumber: number;
  title: string;
  caption?: string;
  imageUrl: string;
  uploadedAt: string;
  comments: MessbookComment[];
}

export interface FreegiftItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  preface: string; // Lời tựa
  previewUrl: string; // Ảnh động GIF / video / ảnh
  previewType: 'gif' | 'image' | 'video';
  freegifts: FreegiftItem[]; // Quà tặng kèm (ảnh)
  date: string; // Ngày / tháng / năm
  status?: 'completed' | 'ongoing' | 'upcoming';
  category?: string;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  name: string; // Biệt danh / tên hoặc "Ẩn danh"
  isAnonymous: boolean;
  category: string;
  content: string;
  mood?: string;
  likes: number;
  adminReply?: string;
  createdAt: string;
}

export interface AppStateData {
  coverImage?: string;
  coverTitle?: string;
  coverSubtitle?: string;
  messbookPages: MessbookPage[];
  projects: ProjectItem[];
  feedbacks: FeedbackItem[];
}
