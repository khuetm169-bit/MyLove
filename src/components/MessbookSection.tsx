import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Maximize2,
  X,
  MessageCircle,
  Send,
  Sparkles,
  Upload,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { MessbookPage } from '../types';

interface MessbookSectionProps {
  pages: MessbookPage[];
  isAdmin: boolean;
  onAddPage: (page: { title: string; caption?: string; imageUrl: string }) => Promise<void>;
  onDeletePage: (pageId: string) => Promise<void>;
  onAddComment: (pageId: string, author: string, isAnonymous: boolean, content: string) => Promise<void>;
  onDeleteComment: (pageId: string, commentId: string) => Promise<void>;
}

export const MessbookSection: React.FC<MessbookSectionProps> = ({
  pages,
  isAdmin,
  onAddPage,
  onDeletePage,
  onAddComment,
  onDeleteComment,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Comment Form State
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentIsAnonymous, setCommentIsAnonymous] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // New Page Form State (Admin)
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmittingPage, setIsSubmittingPage] = useState(false);
  const [pageFormError, setPageFormError] = useState('');

  // Sample quick scan presets for convenience
  const sampleScanPresets = [
    {
      name: 'Bản Scan Hoa Ép',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Scan Giấy Cũ Ký Ức',
      url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Scan Thư Tay Nghệ Thuật',
      url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Scan Sổ Lời Chúc',
      url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const currentPage = pages[currentPageIndex] || null;

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      setPageFormError('Vui lòng tải lên ảnh bản scan hoặc dán đường dẫn ảnh.');
      return;
    }
    setPageFormError('');
    setIsSubmittingPage(true);
    try {
      await onAddPage({
        title: newTitle || `Trang ${pages.length + 1}`,
        caption: newCaption,
        imageUrl: newImageUrl,
      });
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewCaption('');
      setNewImageUrl('');
      setCurrentPageIndex(pages.length); // Jump to new page
    } catch (err: any) {
      setPageFormError(err.message || 'Lỗi khi thêm trang');
    } finally {
      setIsSubmittingPage(false);
    }
  };

  const handleDeleteCurrentPage = async () => {
    if (!currentPage) return;
    if (window.confirm(`Bạn có chắc muốn xóa trang: "${currentPage.title}"?`)) {
      await onDeletePage(currentPage.id);
      if (currentPageIndex >= pages.length - 1 && currentPageIndex > 0) {
        setCurrentPageIndex(currentPageIndex - 1);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage || !commentContent.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(
        currentPage.id,
        commentAuthor,
        commentIsAnonymous,
        commentContent
      );
      setCommentContent('');
    } catch (err: any) {
      alert(err.message || 'Không thể gửi bình luận');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentPage) return;
    if (window.confirm('Xóa bình luận này?')) {
      await onDeleteComment(currentPage.id, commentId);
    }
  };

  return (
    <section id="messbook" className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#3b1f17]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#d49b8a] uppercase">
              SCAN ALBUM & MEMORIES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fbeee9] font-bold tracking-wide">
            Messbook
          </h2>
          <p className="text-xs sm:text-sm text-[#bda099] mt-1">
            Quyển sách scan lưu giữ từng trang viết tay và lời nhắn kỷ niệm. Mọi người có thể gửi bình luận theo từng trang ảnh.
          </p>
        </div>

        {/* Admin action to add page */}
        {isAdmin && (
          <button
            id="btn-admin-add-scan-page"
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 text-white text-xs font-semibold tracking-wider transition shadow-lg shadow-[#d9777f]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            THÊM TRANG SCAN
          </button>
        )}
      </div>

      {pages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#23120c] border border-[#43231a] text-[#bda099]">
          <p className="font-serif text-lg text-[#fbeee9] mb-2">Chưa có trang scan nào</p>
          <p className="text-xs">
            {isAdmin ? 'Hãy nhấn nút "Thêm trang scan" ở góc trên để bắt đầu tải trang sách đầu tiên.' : 'Vui lòng quay lại sau khi admin tải các bản scan lên nhé!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Book Reader Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Scan Page Display (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-[#180c07] border border-[#43231a] shadow-2xl p-2 sm:p-4 group">
                {/* Page Navigation Controls Overlay on Top */}
                <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-[#30170f] text-xs text-[#deb8ae]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#351a12] text-[#f4c2c2] font-semibold text-[11px] tracking-wider">
                      TRANG {currentPage?.pageNumber || currentPageIndex + 1} / {pages.length}
                    </span>
                    <span className="hidden sm:inline text-[#8a6860]">
                      {currentPage?.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-zoom-scan-page"
                      onClick={() => setIsZoomOpen(true)}
                      className="p-1.5 rounded-lg bg-[#2b1610] hover:bg-[#3d1f16] text-[#deb8ae] hover:text-white transition"
                      title="Phóng to xem chi tiết"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {isAdmin && (
                      <button
                        id="btn-admin-delete-page"
                        onClick={handleDeleteCurrentPage}
                        className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 border border-red-700/40 text-red-300 hover:text-red-100 transition"
                        title="Xóa trang scan này (Chỉ Admin)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Scan Image Container with tactile book shadow */}
                <div
                  className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#24130d] flex items-center justify-center cursor-pointer select-none"
                  onClick={() => setIsZoomOpen(true)}
                >
                  <img
                    src={currentPage?.imageUrl}
                    alt={currentPage?.title || 'Scan page'}
                    className="w-full h-full object-contain sm:object-cover transition-transform duration-500 hover:scale-[1.01]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Left Spine Book Gradient Illusion */}
                  <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />

                  {/* Hint overlay */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-[#fbeee9] opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    Bấm để phóng to
                  </div>
                </div>

                {/* Navigation Buttons: Previous / Next */}
                <div className="flex items-center justify-between mt-4 px-1">
                  <button
                    id="btn-prev-page"
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#291711] hover:bg-[#3d1f16] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-[#deb8ae] transition border border-[#43231a] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Trang trước
                  </button>

                  <span className="text-xs text-[#a6867d]">
                    Lật trang bằng nút hoặc chọn thumbnail
                  </span>

                  <button
                    id="btn-next-page"
                    onClick={handleNextPage}
                    disabled={currentPageIndex === pages.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#291711] hover:bg-[#3d1f16] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-[#deb8ae] transition border border-[#43231a] cursor-pointer"
                  >
                    Trang tiếp
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Page Caption & Meta */}
              <div className="p-4 rounded-xl bg-[#24130d]/80 border border-[#3b1f17] text-left">
                <h3 className="font-serif text-lg font-bold text-[#fbeee9] mb-1">
                  {currentPage?.title}
                </h3>
                {currentPage?.caption && (
                  <p className="text-xs text-[#bda099] leading-relaxed mb-2">
                    {currentPage.caption}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[11px] text-[#805f57]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Đăng tải ngày: {currentPage?.uploadedAt}</span>
                </div>
              </div>

              {/* Page Thumbnail Strip */}
              <div className="flex items-center gap-2 overflow-x-auto py-2 px-1">
                {pages.map((p, idx) => (
                  <button
                    key={p.id}
                    id={`thumb-page-${p.id}`}
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      idx === currentPageIndex
                        ? 'border-[#d9777f] ring-2 ring-[#d9777f]/40 scale-105'
                        : 'border-[#43231a] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-bold text-center py-0.5 text-white">
                      Trang {p.pageNumber}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Comments for this specific scan page (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-[#23120c] border border-[#43231a] p-5 text-left shadow-xl flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#3b1f17]">
                  <div className="flex items-center gap-2 text-[#fbeee9]">
                    <MessageCircle className="w-4 h-4 text-[#d9777f]" />
                    <h4 className="font-serif font-bold text-base">
                      Bình Luận Trang {currentPage?.pageNumber || currentPageIndex + 1}
                    </h4>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#351a12] text-[#e8b5a9]">
                    {currentPage?.comments?.length || 0} phản hồi
                  </span>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {(!currentPage?.comments || currentPage.comments.length === 0) ? (
                    <div className="py-8 text-center text-xs text-[#8a6860]">
                      <p>Chưa có bình luận nào cho trang này.</p>
                      <p className="mt-1 text-[11px]">Hãy là người đầu tiên để lại cảm nghĩ của bạn!</p>
                    </div>
                  ) : (
                    currentPage.comments.map((cmt) => (
                      <div
                        key={cmt.id}
                        className="p-3 rounded-xl bg-[#1d0e09] border border-[#351912] relative group transition hover:border-[#4d261b]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#f4c2c2] flex items-center gap-1.5">
                            {cmt.isAnonymous ? (
                              <span className="text-[#a6867d] italic">👤 {cmt.author}</span>
                            ) : (
                              <span>🌸 {cmt.author}</span>
                            )}
                          </span>
                          <span className="text-[10px] text-[#785750]">
                            {cmt.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-[#ebd0c7] leading-relaxed whitespace-pre-line">
                          {cmt.content}
                        </p>

                        {/* Admin Delete Comment Button */}
                        {isAdmin && (
                          <button
                            id={`btn-del-cmt-${cmt.id}`}
                            onClick={() => handleDeleteComment(cmt.id)}
                            className="absolute top-2 right-2 p-1 rounded bg-red-950/60 text-red-400 hover:text-red-200 hover:bg-red-900 transition opacity-0 group-hover:opacity-100"
                            title="Xóa bình luận này (Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Form: Add Comment */}
                <form onSubmit={handleCommentSubmit} className="mt-4 pt-4 border-t border-[#3b1f17] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-[#deb8ae] font-medium">Viết bình luận</label>
                    <label className="flex items-center gap-1.5 text-[11px] text-[#bda099] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={commentIsAnonymous}
                        onChange={(e) => setCommentIsAnonymous(e.target.checked)}
                        className="rounded accent-[#d9777f]"
                      />
                      <span>Bình luận ẩn danh</span>
                    </label>
                  </div>

                  {!commentIsAnonymous && (
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      placeholder="Biệt danh hoặc tên của bạn..."
                      className="w-full px-3 py-2 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] placeholder-[#7d5d54] focus:outline-none focus:border-[#d9777f]"
                    />
                  )}

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder={`Chia sẻ cảm nghĩ của bạn về bản scan Trang ${currentPage?.pageNumber || ''}...`}
                      className="w-full p-3 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] placeholder-[#7d5d54] focus:outline-none focus:border-[#d9777f] resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-submit-page-comment"
                    disabled={isSubmittingComment || !commentContent.trim()}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 disabled:opacity-40 text-white text-xs font-semibold tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingComment ? 'Đang gửi...' : 'GỬI BÌNH LUẬN'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZOOM LIGHTBOX MODAL */}
      {isZoomOpen && currentPage && (
        <div
          id="zoom-scan-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="flex items-center justify-between text-white pb-3 max-w-5xl mx-auto w-full">
            <div>
              <span className="text-xs text-[#f4c2c2] tracking-widest font-semibold uppercase">
                BẢN SCAN GỐC CHI TIẾT
              </span>
              <h3 className="font-serif text-lg font-bold">
                {currentPage.title} (Trang {currentPage.pageNumber})
              </h3>
            </div>
            <button
              onClick={() => setIsZoomOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Đóng"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="flex-1 flex items-center justify-center overflow-auto p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPage.imageUrl}
              alt={currentPage.title}
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* ADMIN ADD SCAN PAGE MODAL */}
      {isAddModalOpen && (
        <div
          id="modal-add-scan-page"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#24130d] border border-[#522b20] rounded-2xl p-6 text-[#fbeee9] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#3b1f17]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#fbeee9]">
                  Thêm Trang Scan Mới
                </h3>
                <p className="text-xs text-[#a6867d]">
                  Chỉ admin có quyền tải lên các trang bản scan tiếp theo
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#a6867d] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPageSubmit} className="space-y-4 text-left">
              {pageFormError && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pageFormError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#deb8ae] mb-1">
                  Tiêu đề trang scan
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={`Ví dụ: Trang ${pages.length + 1} - Lời Tự Sự`}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#deb8ae] mb-1">
                  Mô tả / Lời ghi chú trang
                </label>
                <textarea
                  rows={2}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Ghi chú về nguồn gốc trang scan hoặc kỷ niệm đặc biệt..."
                  className="w-full p-3 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f] resize-none"
                />
              </div>

              {/* Upload file or enter image URL */}
              <div>
                <label className="block text-xs font-medium text-[#deb8ae] mb-1">
                  Hình ảnh bản scan
                </label>
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#522b20] hover:border-[#d9777f] rounded-xl cursor-pointer bg-[#1a0e0a]/50 transition">
                    <Upload className="w-6 h-6 text-[#d9777f] mb-1" />
                    <span className="text-xs text-[#deb8ae] font-medium">
                      Nhấn để tải file ảnh từ máy của bạn
                    </span>
                    <span className="text-[10px] text-[#7d5d54] mt-0.5">
                      Hỗ trợ JPG, PNG, WEBP
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="text-center text-[11px] text-[#7d5d54]">- Hoặc dán đường dẫn ảnh URL -</div>

                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                  />
                </div>

                {/* Preset sample images for quick testing */}
                <div className="mt-2">
                  <span className="text-[11px] text-[#8a6860] block mb-1">
                    Chọn nhanh ảnh mẫu (Nếu chưa có file scan sẵn):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleScanPresets.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewImageUrl(preset.url)}
                        className="px-2 py-1 rounded bg-[#1c0f0a] hover:bg-[#351912] border border-[#43231a] text-[10px] text-[#f4c2c2] cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {newImageUrl && (
                  <div className="mt-3 p-2 rounded-lg bg-[#1a0e0a] border border-[#43231a] flex items-center gap-3">
                    <img
                      src={newImageUrl}
                      alt="Preview scan"
                      className="w-14 h-16 object-cover rounded"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs text-[#deb8ae] overflow-hidden">
                      <p className="font-semibold text-emerald-400">Đã chọn ảnh xem trước</p>
                      <p className="text-[10px] truncate text-[#7d5d54]">{newImageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#3b1f17]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[#43231a] text-xs text-[#deb8ae] hover:bg-white/5 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPage}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 text-white text-xs font-semibold tracking-wider transition shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPage ? 'Đang thêm...' : 'LƯU TRANG SCAN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
