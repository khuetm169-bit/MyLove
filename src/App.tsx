import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MessbookSection } from './components/MessbookSection';
import { ProjectSection } from './components/ProjectSection';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { AppStateData } from './types';
import { INITIAL_DATA } from './data/mockData';
import {
  fetchAppData,
  getStoredAdminToken,
  setStoredAdminToken,
  apiUpdateCover,
  apiAddScanPage,
  apiDeleteScanPage,
  apiAddComment,
  apiDeleteComment,
  apiAddProject,
  apiUpdateProject,
  apiDeleteProject,
  apiAddFeedback,
  apiLikeFeedback,
  apiReplyFeedback,
  apiDeleteFeedback,
} from './utils/api';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppStateData>(INITIAL_DATA);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Load initial data and admin token
  useEffect(() => {
    const token = getStoredAdminToken();
    if (token) {
      setIsAdmin(true);
    }

    fetchAppData().then((res) => {
      if (res && res.messbookPages) {
        setData(res);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    showToast('Đã kích hoạt Chế độ Quản trị viên (Admin Mode)!');
  };

  const handleAdminLogout = () => {
    setStoredAdminToken(null);
    setIsAdmin(false);
    showToast('Đã quay lại Chế độ Khách xem.');
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cover Handlers
  const handleUpdateCover = async (coverData: { coverImage: string }) => {
    try {
      const res = await apiUpdateCover(coverData);
      if (res.success) {
        setData((prev) => ({
          ...prev,
          coverImage: res.coverImage,
        }));
        showToast('Đã cập nhật ảnh bìa mới thành công!');
        return;
      }
    } catch (e) {
      console.warn('API error, applying client-side cover update', e);
    }

    setData((prev) => ({
      ...prev,
      coverImage: coverData.coverImage,
    }));
    showToast('Đã cập nhật ảnh bìa!');
  };

  // Messbook Handlers
  const handleAddScanPage = async (page: { title: string; caption?: string; imageUrl: string }) => {
    try {
      const res = await apiAddScanPage(page);
      if (res.page) {
        setData((prev) => ({
          ...prev,
          messbookPages: [...prev.messbookPages, res.page],
        }));
        showToast('Đã thêm trang scan mới thành công!');
      }
    } catch (err: any) {
      // Fallback local update
      const newPage = {
        id: 'page-' + Date.now(),
        pageNumber: data.messbookPages.length + 1,
        title: page.title || `Trang ${data.messbookPages.length + 1}`,
        caption: page.caption || '',
        imageUrl: page.imageUrl,
        uploadedAt: new Date().toLocaleDateString('vi-VN'),
        comments: [],
      };
      setData((prev) => ({
        ...prev,
        messbookPages: [...prev.messbookPages, newPage],
      }));
      showToast('Đã thêm trang scan!');
    }
  };

  const handleDeleteScanPage = async (pageId: string) => {
    try {
      await apiDeleteScanPage(pageId);
    } catch (e) {
      console.warn('API error, applying client-side deletion', e);
    }
    setData((prev) => {
      const updated = prev.messbookPages.filter((p) => p.id !== pageId);
      updated.forEach((p, i) => {
        p.pageNumber = i + 1;
      });
      return { ...prev, messbookPages: updated };
    });
    showToast('Đã xóa trang scan.');
  };

  const handleAddComment = async (
    pageId: string,
    author: string,
    isAnonymous: boolean,
    content: string
  ) => {
    try {
      const res = await apiAddComment(pageId, author, isAnonymous, content);
      if (res.comment) {
        setData((prev) => ({
          ...prev,
          messbookPages: prev.messbookPages.map((p) =>
            p.id === pageId ? { ...p, comments: [...p.comments, res.comment] } : p
          ),
        }));
        showToast('Bình luận của bạn đã được gửi!');
        return;
      }
    } catch (e) {
      console.warn('API error, applying optimistic comment', e);
    }

    const fallbackComment = {
      id: 'c-' + Date.now(),
      author: isAnonymous ? 'Người bạn giấu tên' : author.trim() || 'Bạn đọc',
      isAnonymous,
      content: content.trim(),
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setData((prev) => ({
      ...prev,
      messbookPages: prev.messbookPages.map((p) =>
        p.id === pageId ? { ...p, comments: [...p.comments, fallbackComment] } : p
      ),
    }));
    showToast('Bình luận của bạn đã được gửi!');
  };

  const handleDeleteComment = async (pageId: string, commentId: string) => {
    try {
      await apiDeleteComment(pageId, commentId);
    } catch (e) {
      console.warn('API error, applying client-side delete', e);
    }
    setData((prev) => ({
      ...prev,
      messbookPages: prev.messbookPages.map((p) =>
        p.id === pageId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p
      ),
    }));
    showToast('Đã xóa bình luận.');
  };

  // Project Handlers
  const handleAddProject = async (project: any) => {
    try {
      const res = await apiAddProject(project);
      if (res.project) {
        setData((prev) => ({
          ...prev,
          projects: [res.project, ...prev.projects],
        }));
        showToast('Đã tạo Project mới thành công!');
        return;
      }
    } catch (e) {
      console.warn('API error, applying client-side project creation', e);
    }

    const fallbackProj = {
      ...project,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      projects: [fallbackProj, ...prev.projects],
    }));
    showToast('Đã tạo Project mới!');
  };

  const handleUpdateProject = async (id: string, project: any) => {
    try {
      const res = await apiUpdateProject(id, project);
      if (res.project) {
        setData((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => (p.id === id ? res.project : p)),
        }));
        showToast('Đã cập nhật Project thành công!');
        return;
      }
    } catch (e) {
      console.warn('API error, applying client-side update', e);
    }

    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
    }));
    showToast('Đã cập nhật Project!');
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await apiDeleteProject(id);
    } catch (e) {
      console.warn('API error, applying client-side deletion', e);
    }
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    showToast('Đã xóa Project.');
  };

  // Feedback Handlers
  const handleAddFeedback = async (feedback: {
    name: string;
    isAnonymous: boolean;
    category: string;
    content: string;
    mood?: string;
  }) => {
    try {
      const res = await apiAddFeedback(feedback);
      if (res.feedback) {
        setData((prev) => ({
          ...prev,
          feedbacks: [res.feedback, ...prev.feedbacks],
        }));
        return;
      }
    } catch (e) {
      console.warn('API error, applying fallback feedback', e);
    }

    const fallbackFb = {
      id: 'fb-' + Date.now(),
      ...feedback,
      likes: 0,
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setData((prev) => ({
      ...prev,
      feedbacks: [fallbackFb, ...prev.feedbacks],
    }));
  };

  const handleLikeFeedback = async (id: string) => {
    setData((prev) => ({
      ...prev,
      feedbacks: prev.feedbacks.map((f) =>
        f.id === id ? { ...f, likes: (f.likes || 0) + 1 } : f
      ),
    }));
    try {
      await apiLikeFeedback(id);
    } catch (e) {
      // already updated optimistically
    }
  };

  const handleReplyFeedback = async (id: string, reply: string) => {
    try {
      const res = await apiReplyFeedback(id, reply);
      if (res.feedback) {
        setData((prev) => ({
          ...prev,
          feedbacks: prev.feedbacks.map((f) => (f.id === id ? res.feedback : f)),
        }));
        showToast('Đã lưu phản hồi cho ý kiến!');
        return;
      }
    } catch (e) {
      console.warn('API error, applying client reply', e);
    }

    setData((prev) => ({
      ...prev,
      feedbacks: prev.feedbacks.map((f) =>
        f.id === id ? { ...f, adminReply: reply } : f
      ),
    }));
    showToast('Đã lưu phản hồi!');
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      await apiDeleteFeedback(id);
    } catch (e) {
      console.warn('API error, applying client delete', e);
    }
    setData((prev) => ({
      ...prev,
      feedbacks: prev.feedbacks.filter((f) => f.id !== id),
    }));
    showToast('Đã xóa ý kiến đóng góp.');
  };

  return (
    <div className="min-h-screen bg-[#1a0e0a] text-[#f7e7e2] font-sans antialiased flex flex-col selection:bg-[#d9777f]/30 selection:text-white">
      {/* Toast Notification Banner */}
      {adminToast && (
        <div
          id="global-toast-notification"
          className="fixed top-18 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#2e1710] border border-[#d9777f] text-xs text-[#fbeee9] shadow-2xl flex items-center gap-2 animate-fadeIn"
        >
          <Sparkles className="w-4 h-4 text-[#d9777f] shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Admin Mode Floating Indicator */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-[#5a1e27] via-[#702934] to-[#4f1a22] text-[#fbeee9] py-1.5 px-4 text-center text-xs border-b border-[#d9777f]/40 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>
            <strong>Đang ở chế độ Admin (Bundau):</strong> Bạn có quyền tự chèn/đổi ảnh bìa, thêm/xóa trang Messbook, xóa bình luận, chỉnh sửa Project và phản hồi Ý kiến.
          </span>
          <button
            onClick={handleAdminLogout}
            className="ml-2 text-[11px] underline text-[#f4c2c2] hover:text-white cursor-pointer"
          >
            Thoát Admin
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Hero
          coverImage={data.coverImage}
          isAdmin={isAdmin}
          onUpdateCover={handleUpdateCover}
          onNavigateToMessbook={() => scrollToSection('messbook')}
          onNavigateToProject={() => scrollToSection('project')}
          onNavigateToFeedback={() => scrollToSection('feedback')}
        />

        {/* 1. MESSBOOK SECTION */}
        <MessbookSection
          pages={data.messbookPages}
          isAdmin={isAdmin}
          onAddPage={handleAddScanPage}
          onDeletePage={handleDeleteScanPage}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />

        {/* 2. PROJECT SECTION */}
        <ProjectSection
          projects={data.projects}
          isAdmin={isAdmin}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />

        {/* 3. Ý KIẾN SECTION */}
        <FeedbackSection
          feedbacks={data.feedbacks}
          isAdmin={isAdmin}
          onAddFeedback={handleAddFeedback}
          onLikeFeedback={handleLikeFeedback}
          onReplyFeedback={handleReplyFeedback}
          onDeleteFeedback={handleDeleteFeedback}
        />
      </main>

      {/* Footer */}
      <Footer
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Admin Login Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLoginSuccess={handleAdminLogin}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}
