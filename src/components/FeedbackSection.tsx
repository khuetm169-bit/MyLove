import React, { useState } from 'react';
import {
  MessageSquareHeart,
  Send,
  Heart,
  User,
  EyeOff,
  Sparkles,
  Trash2,
  Reply,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FeedbackItem } from '../types';

interface FeedbackSectionProps {
  feedbacks: FeedbackItem[];
  isAdmin: boolean;
  onAddFeedback: (feedback: {
    name: string;
    isAnonymous: boolean;
    category: string;
    content: string;
    mood?: string;
  }) => Promise<void>;
  onLikeFeedback: (id: string) => Promise<void>;
  onReplyFeedback: (id: string, reply: string) => Promise<void>;
  onDeleteFeedback: (id: string) => Promise<void>;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  feedbacks,
  isAdmin,
  onAddFeedback,
  onLikeFeedback,
  onReplyFeedback,
  onDeleteFeedback,
}) => {
  // Form State
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Lời yêu thương');
  const [mood, setMood] = useState('💖 Ấm áp');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Admin Reply State
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Filter State
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Tất cả');

  const categories = [
    'Lời yêu thương',
    'Góp ý Messbook',
    'Góp ý Project',
    'Góp ý chung & Ý tưởng',
  ];

  const moodOptions = [
    '💖 Ấm áp',
    '✨ Lấp lánh',
    '🌸 Ngọt ngào',
    '💌 Thư tình',
    '☕ Bình yên',
    '🎉 Chúc mừng',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddFeedback({
        name: isAnonymous ? 'Ẩn danh' : (name && name.trim() ? name.trim() : 'Ẩn danh'),
        isAnonymous,
        category,
        mood,
        content: content.trim(),
      });
      setContent('');
      setName('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi gửi góp ý');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminReplySubmit = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await onReplyFeedback(id, replyText.trim());
      setReplyingId(null);
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi gửi phản hồi');
    }
  };

  const handleDelete = async (fb: FeedbackItem) => {
    if (window.confirm('Bạn có chắc muốn xóa ý kiến này?')) {
      await onDeleteFeedback(fb.id);
    }
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (activeCategoryFilter === 'Tất cả') return true;
    return fb.category === activeCategoryFilter;
  });

  return (
    <section id="feedback" className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#3b1f17]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d9777f]" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#d49b8a] uppercase">
              HEARTFELT THOUGHTS
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fbeee9] font-bold tracking-wide">
            Ý Kiến & Lời Nhắn
          </h2>
          <p className="text-xs sm:text-sm text-[#bda099] mt-1">
            Góc lắng nghe những đóng góp chân thành, bạn có thể gửi dưới dạng ẩn danh hoặc để lại biệt danh/tên của mình.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Gửi Góp Ý (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#23120c] border border-[#43231a] shadow-xl text-left">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#3b1f17]">
              <MessageSquareHeart className="w-5 h-5 text-[#d9777f]" />
              <h3 className="font-serif text-lg font-bold text-[#fbeee9]">
                Gửi Ý Kiến Đến My Love
              </h3>
            </div>

            {showSuccessToast && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Cảm ơn bạn! Ý kiến đóng góp của bạn đã được gửi thành công.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anonymous vs Named Toggle */}
              <div className="p-3 rounded-xl bg-[#1a0e0a] border border-[#3b1f17] space-y-2">
                <span className="text-xs font-medium text-[#deb8ae] block">
                  Hình thức gửi góp ý:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      !isAnonymous
                        ? 'bg-[#d9777f] text-white shadow-sm'
                        : 'bg-[#24130d] text-[#a6867d] hover:text-[#fbeee9]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Có Biệt Danh / Tên
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAnonymous(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isAnonymous
                        ? 'bg-[#d9777f] text-white shadow-sm'
                        : 'bg-[#24130d] text-[#a6867d] hover:text-[#fbeee9]'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    Gửi Ẩn Danh
                  </button>
                </div>

                {!isAnonymous ? (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập tên hoặc biệt danh của bạn..."
                      className="w-full px-3 py-2 rounded-lg bg-[#140905] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                    />
                  </div>
                ) : (
                  <div className="text-[11px] text-[#8a6860] italic pt-1 flex items-center gap-1">
                    <span>Lời nhắn sẽ được hiển thị dưới tên [Người bạn ẩn danh]</span>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-[#deb8ae] mb-1.5">
                  Chủ đề góp ý
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2 rounded-lg text-[11px] text-left transition truncate cursor-pointer ${
                        category === cat
                          ? 'bg-[#351912] border border-[#d9777f] text-[#f4c2c2] font-semibold'
                          : 'bg-[#1a0e0a] border border-[#351912] text-[#a6867d] hover:text-[#fbeee9]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-xs font-medium text-[#deb8ae] mb-1.5">
                  Cảm xúc kèm theo
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {moodOptions.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer ${
                        mood === m
                          ? 'bg-[#d9777f]/30 border border-[#d9777f] text-[#fbeee9]'
                          : 'bg-[#1a0e0a] border border-[#351912] text-[#8a6860] hover:text-[#fbeee9]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-medium text-[#deb8ae] mb-1.5">
                  Nội dung góp ý / Lời nhắn gửi *
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Chia sẻ những suy nghĩ, cảm xúc chân thành hoặc đề xuất cải thiện dành cho My Love..."
                  className="w-full p-3 rounded-xl bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] placeholder-[#7d5d54] focus:outline-none focus:border-[#d9777f] resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                id="btn-submit-feedback"
                disabled={isSubmitting || !content.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 disabled:opacity-40 text-white text-xs font-semibold tracking-wider transition shadow-lg shadow-[#d9777f]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Đang gửi...' : 'GỬI Ý KIẾN'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Wall: Danh Sách Các Ý Kiến Đã Gửi (7 cols) */}
        <div className="lg:col-span-7 space-y-4 text-left">
          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['Tất cả', ...categories].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveCategoryFilter(filter)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                  activeCategoryFilter === filter
                    ? 'bg-[#d9777f] text-white font-medium'
                    : 'bg-[#23120c] text-[#a6867d] hover:text-[#fbeee9] border border-[#43231a]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#23120c] border border-[#43231a] text-[#bda099]">
              <p className="font-serif text-lg text-[#fbeee9] mb-1">Chưa có ý kiến nào</p>
              <p className="text-xs">
                Hãy là người đầu tiên để lại lời nhắn yêu thương hoặc góp ý quý báu nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  id={`feedback-card-${fb.id}`}
                  className="p-5 rounded-2xl bg-[#23120c] border border-[#43231a] shadow-lg hover:border-[#5a2c20] transition relative group"
                >
                  {/* Top line of the feedback card */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-[#f4c2c2] flex items-center gap-1">
                        {fb.isAnonymous ? (
                          <span className="text-[#deb8ae] flex items-center gap-1">
                            <EyeOff className="w-3.5 h-3.5 text-[#a6867d]" />
                            Ẩn danh
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#d9777f]" />
                            {fb.name}
                          </span>
                        )}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-[#180c07] text-[10px] text-[#a6867d] border border-[#351912]">
                        {fb.category}
                      </span>

                      {fb.mood && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#351a12] text-[#fbeee9]">
                          {fb.mood}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-[#7d5d54] shrink-0">
                      {fb.createdAt}
                    </span>
                  </div>

                  {/* Feedback message content */}
                  <p className="text-xs sm:text-sm text-[#ecd0c7] leading-relaxed whitespace-pre-line mb-3">
                    {fb.content}
                  </p>

                  {/* Admin Reply if present */}
                  {fb.adminReply && (
                    <div className="mt-3 p-3 rounded-xl bg-[#1b0c07] border-l-2 border-[#d9777f] text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#f4c2c2]">
                        <Reply className="w-3.5 h-3.5 rotate-180 text-[#d9777f]" />
                        <span>Phản hồi từ Admin:</span>
                      </div>
                      <p className="text-[#cbb0a8] italic leading-relaxed">
                        {fb.adminReply}
                      </p>
                    </div>
                  )}

                  {/* Card bottom actions: Like & Admin controls */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#351912] text-xs">
                    <button
                      onClick={() => onLikeFeedback(fb.id)}
                      className="flex items-center gap-1.5 text-[#deb8ae] hover:text-[#f4c2c2] transition cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-[#d9777f] fill-[#d9777f]/20 hover:fill-[#d9777f]" />
                      <span className="text-[11px]">{fb.likes || 0} Trái tim</span>
                    </button>

                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setReplyingId(replyingId === fb.id ? null : fb.id);
                            setReplyText(fb.adminReply || '');
                          }}
                          className="px-2.5 py-1 rounded bg-[#2c1710] hover:bg-[#3d2017] border border-[#522b20] text-[11px] text-[#eed0c6] flex items-center gap-1 transition cursor-pointer"
                        >
                          <Reply className="w-3 h-3 text-[#d9777f]" />
                          {fb.adminReply ? 'Sửa phản hồi' : 'Trả lời'}
                        </button>

                        <button
                          onClick={() => handleDelete(fb)}
                          className="p-1 rounded bg-red-950/50 hover:bg-red-900 border border-red-800/40 text-red-300 transition cursor-pointer"
                          title="Xóa ý kiến này (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Admin inline reply form */}
                  {isAdmin && replyingId === fb.id && (
                    <div className="mt-3 pt-3 border-t border-[#351912] space-y-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Viết lời phản hồi từ admin..."
                        className="w-full p-2 rounded-lg bg-[#140905] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingId(null)}
                          className="px-3 py-1 rounded bg-[#24130d] text-xs text-[#deb8ae]"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminReplySubmit(fb.id)}
                          className="px-3 py-1 rounded bg-[#d9777f] text-white text-xs font-semibold hover:bg-[#b35760]"
                        >
                          Lưu Phản Hồi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
