import React, { useState } from 'react';
import {
  Calendar,
  Gift,
  Play,
  Film,
  Plus,
  Edit3,
  Trash2,
  X,
  ExternalLink,
  Download,
  Sparkles,
  Quote,
  Upload,
  AlertCircle,
  Tag
} from 'lucide-react';
import { ProjectItem, FreegiftItem } from '../types';

interface ProjectSectionProps {
  projects: ProjectItem[];
  isAdmin: boolean;
  onAddProject: (project: any) => Promise<void>;
  onUpdateProject: (id: string, project: any) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({
  projects,
  isAdmin,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'ongoing' | 'upcoming'>('all');
  const [activeMediaModal, setActiveMediaModal] = useState<{ url: string; type: string; title: string } | null>(null);
  const [activeGiftModal, setActiveGiftModal] = useState<FreegiftItem | null>(null);

  // Admin Project Modal (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [preface, setPreface] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState<'gif' | 'image' | 'video'>('image');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'completed' | 'ongoing' | 'upcoming'>('completed');
  const [freegifts, setFreegifts] = useState<FreegiftItem[]>([]);

  // Freegift Sub-item inputs
  const [giftTitle, setGiftTitle] = useState('');
  const [giftUrl, setGiftUrl] = useState('');
  const [giftDesc, setGiftDesc] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.status === selectedFilter;
  });

  const openAddModal = () => {
    setEditingProjectId(null);
    setTitle('');
    setPreface('');
    setPreviewUrl('https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80');
    setPreviewType('gif');
    setDate(new Date().toLocaleDateString('vi-VN'));
    setCategory('Special Project');
    setStatus('completed');
    setFreegifts([
      {
        id: 'gift-1',
        title: 'Photocard Scan Kỷ Niệm',
        imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        description: 'Bản in kỷ niệm đặc biệt'
      }
    ]);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    setEditingProjectId(proj.id);
    setTitle(proj.title);
    setPreface(proj.preface);
    setPreviewUrl(proj.previewUrl);
    setPreviewType(proj.previewType || 'image');
    setDate(proj.date);
    setCategory(proj.category || 'General');
    setStatus(proj.status || 'completed');
    setFreegifts(proj.freegifts ? [...proj.freegifts] : []);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleAddFreegift = () => {
    if (!giftUrl.trim() || !giftTitle.trim()) {
      alert('Vui lòng nhập tên món quà và đường dẫn ảnh!');
      return;
    }
    const newGift: FreegiftItem = {
      id: 'fg-' + Date.now(),
      title: giftTitle.trim(),
      imageUrl: giftUrl.trim(),
      description: giftDesc.trim()
    };
    setFreegifts([...freegifts, newGift]);
    setGiftTitle('');
    setGiftUrl('');
    setGiftDesc('');
  };

  const handleRemoveFreegift = (id: string) => {
    setFreegifts(freegifts.filter((g) => g.id !== id));
  };

  const handleFreegiftFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setGiftUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePreviewFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !preface.trim()) {
      setFormError('Vui lòng nhập đầy đủ tiêu đề và lời tựa cho project.');
      return;
    }
    if (!date.trim()) {
      setFormError('Vui lòng nhập thời gian (ngày / tháng / năm).');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const payload = {
        title: title.trim(),
        preface: preface.trim(),
        previewUrl: previewUrl.trim(),
        previewType,
        date: date.trim(),
        category: category.trim(),
        status,
        freegifts,
      };

      if (editingProjectId) {
        await onUpdateProject(editingProjectId, payload);
      } else {
        await onAddProject(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi lưu project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (proj: ProjectItem) => {
    if (window.confirm(`Bạn có chắc muốn xóa project "${proj.title}"?`)) {
      await onDeleteProject(proj.id);
    }
  };

  return (
    <section id="project" className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#3b1f17]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d9777f]" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#d49b8a] uppercase">
              MILESTONES & MEMORIES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fbeee9] font-bold tracking-wide">
            Project
          </h2>
          <p className="text-xs sm:text-sm text-[#bda099] mt-1">
            Tổng hợp các project kỷ niệm: Lời tựa, Preview (ảnh động/video), Quà tặng Freegifts và Mốc thời gian.
          </p>
        </div>

        {/* Admin Add Project Action */}
        {isAdmin && (
          <button
            id="btn-admin-add-project"
            onClick={openAddModal}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 text-white text-xs font-semibold tracking-wider transition shadow-lg shadow-[#d9777f]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            THÊM PROJECT MỚI
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <span className="text-xs text-[#a6867d] mr-1 hidden sm:inline">Trạng thái:</span>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'completed', label: 'Đã hoàn thành' },
          { id: 'ongoing', label: 'Đang diễn ra' },
          { id: 'upcoming', label: 'Sắp tới' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-[#d9777f] text-white shadow-sm'
                : 'bg-[#291711] text-[#deb8ae] hover:bg-[#382017] border border-[#43231a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#23120c] border border-[#43231a] text-[#bda099]">
          <p className="font-serif text-lg text-[#fbeee9] mb-1">Không có project nào trong mục này</p>
          <p className="text-xs">
            {isAdmin ? 'Nhấn "Thêm Project Mới" để tạo sự kiện kỷ niệm tiếp theo.' : 'Hãy theo dõi các project tiếp theo sắp được công bố nhé!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <article
              key={proj.id}
              id={`project-card-${proj.id}`}
              className="rounded-2xl bg-[#23120c] border border-[#43231a] overflow-hidden shadow-xl hover:border-[#6a3528] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Media Preview Section (Ảnh động GIF / video / ảnh) */}
                <div className="relative aspect-video w-full bg-[#180c07] overflow-hidden">
                  <img
                    src={proj.previewUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#23120c] via-transparent to-black/40" />

                  {/* Badges on preview */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-[#fbeee9] flex items-center gap-1 border border-white/10">
                      {proj.previewType === 'gif' ? (
                        <>
                          <Sparkles className="w-3 h-3 text-[#d9777f]" />
                          Ảnh động (GIF)
                        </>
                      ) : proj.previewType === 'video' ? (
                        <>
                          <Film className="w-3 h-3 text-[#d9777f]" />
                          Video Clip
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-[#d9777f]" />
                          Ảnh Preview
                        </>
                      )}
                    </span>

                    {proj.category && (
                      <span className="px-2.5 py-1 rounded-full bg-[#351a12]/80 backdrop-blur-md text-[10px] text-[#eed0c6] border border-[#522b20]">
                        {proj.category}
                      </span>
                    )}
                  </div>

                  {/* Play / Expand Preview Button */}
                  <button
                    onClick={() =>
                      setActiveMediaModal({
                        url: proj.previewUrl,
                        type: proj.previewType,
                        title: proj.title,
                      })
                    }
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 hover:bg-[#d9777f] text-white flex items-center justify-center backdrop-blur-xs transition transform group-hover:scale-110 cursor-pointer shadow-lg"
                    title="Xem toàn màn hình Preview"
                  >
                    <Play className="w-5 h-5 ml-0.5" />
                  </button>

                  {/* Date badge: Ngày / Tháng / Năm */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-medium text-[#f4c2c2] border border-[#d9777f]/30">
                    <Calendar className="w-3.5 h-3.5 text-[#d9777f]" />
                    <span>Thời gian: {proj.date}</span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute bottom-3 right-3">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                        proj.status === 'completed'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                          : proj.status === 'ongoing'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                          : 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                      }`}
                    >
                      {proj.status === 'completed'
                        ? 'Đã hoàn thành'
                        : proj.status === 'ongoing'
                        ? 'Đang diễn ra'
                        : 'Sắp tới'}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-5 text-left space-y-4">
                  {/* Title */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fbeee9] leading-snug">
                    {proj.title}
                  </h3>

                  {/* Lời tựa (Preface) */}
                  <div className="p-3.5 rounded-xl bg-[#1c0f0a] border-l-3 border-[#d9777f] text-xs sm:text-sm text-[#deb8ae] italic relative leading-relaxed">
                    <Quote className="w-4 h-4 text-[#d9777f]/40 absolute top-2 right-2" />
                    <p className="font-light pr-4">{proj.preface}</p>
                  </div>

                  {/* Freegifts Section (Ảnh quà tặng kèm) */}
                  <div className="space-y-2 pt-2 border-t border-[#351912]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#eed0c6] font-semibold">
                        <Gift className="w-4 h-4 text-[#d9777f]" />
                        <span>Freegifts (Quà tặng kèm):</span>
                      </div>
                      <span className="text-[11px] text-[#8a6860]">
                        {proj.freegifts?.length || 0} món quà
                      </span>
                    </div>

                    {(!proj.freegifts || proj.freegifts.length === 0) ? (
                      <p className="text-[11px] text-[#785750] italic">
                        Không có quà tặng đính kèm trong project này.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {proj.freegifts.map((gift) => (
                          <div
                            key={gift.id}
                            onClick={() => setActiveGiftModal(gift)}
                            className="relative group/gift aspect-square rounded-xl overflow-hidden bg-[#180c07] border border-[#43231a] hover:border-[#d9777f] cursor-pointer transition"
                          >
                            <img
                              src={gift.imageUrl}
                              alt={gift.title}
                              className="w-full h-full object-cover transition-transform group-hover/gift:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/gift:opacity-100 transition flex items-center justify-center p-1 text-center">
                              <span className="text-[9px] text-white font-medium line-clamp-2">
                                {gift.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Admin Actions Only */}
              {isAdmin && (
                <div className="p-4 bg-[#1b0c07] border-t border-[#3b1f17] flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Quyền Admin
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-edit-project-${proj.id}`}
                      onClick={() => openEditModal(proj)}
                      className="px-3 py-1.5 rounded-lg bg-[#2c1710] hover:bg-[#3d2017] border border-[#522b20] text-xs text-[#eed0c6] flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#d9777f]" />
                      Chỉnh sửa
                    </button>
                    <button
                      id={`btn-delete-project-${proj.id}`}
                      onClick={() => handleDelete(proj)}
                      className="px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 border border-red-800/40 text-xs text-red-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* MEDIA PREVIEW MODAL (GIF / VIDEO / IMAGE) */}
      {activeMediaModal && (
        <div
          id="modal-media-preview"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 animate-fadeIn"
          onClick={() => setActiveMediaModal(null)}
        >
          <div className="flex items-center justify-between text-white pb-3 max-w-4xl mx-auto w-full">
            <div>
              <span className="text-xs text-[#f4c2c2] tracking-widest font-semibold uppercase">
                XEM TRƯỚC MEDIA PROJECT
              </span>
              <h3 className="font-serif text-lg font-bold">{activeMediaModal.title}</h3>
            </div>
            <button
              onClick={() => setActiveMediaModal(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="flex-1 flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeMediaModal.url}
              alt="Project media preview"
              className="max-h-[80vh] max-w-full rounded-xl shadow-2xl border border-white/10 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* FREEGIFT LIGHTBOX MODAL */}
      {activeGiftModal && (
        <div
          id="modal-freegift-detail"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveGiftModal(null)}
        >
          <div
            className="w-full max-w-md bg-[#24130d] border border-[#522b20] rounded-2xl overflow-hidden shadow-2xl p-5 text-[#fbeee9]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#3b1f17]">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#d9777f]" />
                <h4 className="font-serif text-lg font-bold">{activeGiftModal.title}</h4>
              </div>
              <button
                onClick={() => setActiveGiftModal(null)}
                className="p-1 text-[#a6867d] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#180c07] border border-[#43231a] mb-4 aspect-square flex items-center justify-center">
              <img
                src={activeGiftModal.imageUrl}
                alt={activeGiftModal.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {activeGiftModal.description && (
              <p className="text-xs text-[#bda099] mb-4 leading-relaxed">
                {activeGiftModal.description}
              </p>
            )}

            <div className="flex items-center gap-3">
              <a
                href={activeGiftModal.imageUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                TẢI ẢNH VỀ MÁY
              </a>
              <button
                onClick={() => setActiveGiftModal(null)}
                className="py-2.5 px-4 rounded-xl border border-[#43231a] text-xs text-[#deb8ae] hover:bg-white/5"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ADD / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div
          id="modal-admin-project-form"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#24130d] border border-[#522b20] rounded-2xl p-6 text-[#fbeee9] shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#3b1f17]">
              <div>
                <h3 className="font-serif text-xl font-bold">
                  {editingProjectId ? 'Chỉnh Sửa Project' : 'Thêm Project Mới'}
                </h3>
                <p className="text-xs text-[#a6867d]">
                  Cập nhật các thông tin: Lời tựa, Preview (ảnh động/video), Freegifts và Thời gian
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#a6867d] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {formError && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#deb8ae] mb-1">
                    Tiêu đề Project *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Project Sinh Nhật 2025"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#deb8ae] mb-1">
                    Chuyên mục / Thể loại
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ví dụ: Birthday, Anniversary..."
                    className="w-full px-3 py-2 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                  />
                </div>
              </div>

              {/* Thời gian (Ngày / Tháng / Năm) & Trạng thái */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#deb8ae] mb-1">
                    Thời gian (Ngày / Tháng / Năm) *
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Ví dụ: 14/02/2025 hoặc 20/10/2024"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#deb8ae] mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                  >
                    <option value="completed">Đã hoàn thành</option>
                    <option value="ongoing">Đang diễn ra</option>
                    <option value="upcoming">Sắp tới</option>
                  </select>
                </div>
              </div>

              {/* Lời tựa (Preface) */}
              <div>
                <label className="block text-xs font-medium text-[#deb8ae] mb-1">
                  Lời tựa (Lời đề tựa / Ý nghĩa / Lời nhắn gửi) *
                </label>
                <textarea
                  rows={3}
                  value={preface}
                  onChange={(e) => setPreface(e.target.value)}
                  placeholder="Viết lời tựa chân thành dành cho project này..."
                  className="w-full p-3 rounded-lg bg-[#1a0e0a] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f] resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Preview (Ảnh động GIF / Video / Ảnh) */}
              <div className="p-4 rounded-xl bg-[#1c0f0a] border border-[#351912] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#eed0c6] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#d9777f]" />
                    Preview (Ảnh động / Video / Ảnh)
                  </label>
                  <div className="flex items-center gap-2">
                    {(['gif', 'image', 'video'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPreviewType(type)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold cursor-pointer ${
                          previewType === type
                            ? 'bg-[#d9777f] text-white'
                            : 'bg-[#2b1711] text-[#bda099]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="Nhập đường dẫn ảnh động GIF / video / ảnh..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#140a07] border border-[#43231a] text-xs text-[#fbeee9] focus:outline-none focus:border-[#d9777f]"
                  />
                  <label className="px-3 py-2 rounded-lg bg-[#2b1610] hover:bg-[#3d1f16] text-xs text-[#deb8ae] flex items-center justify-center gap-1.5 cursor-pointer border border-[#43231a]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải file</span>
                    <input
                      type="file"
                      accept="image/*,image/gif"
                      onChange={handlePreviewFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {previewUrl && (
                  <div className="relative aspect-video max-h-36 rounded-lg overflow-hidden bg-black/50 border border-[#43231a]">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Freegifts (Ảnh quà tặng đính kèm) */}
              <div className="p-4 rounded-xl bg-[#1c0f0a] border border-[#351912] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#eed0c6] flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-[#d9777f]" />
                    Danh sách Freegifts (Ảnh)
                  </label>
                  <span className="text-[11px] text-[#8a6860]">
                    {freegifts.length} món quà đã thêm
                  </span>
                </div>

                {/* List of current freegifts */}
                {freegifts.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {freegifts.map((g) => (
                      <div
                        key={g.id}
                        className="relative rounded-lg overflow-hidden bg-[#24130d] border border-[#43231a] p-2 flex items-center gap-2 group"
                      >
                        <img
                          src={g.imageUrl}
                          alt={g.title}
                          className="w-10 h-10 object-cover rounded shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden text-left flex-1">
                          <p className="text-[11px] font-medium text-[#fbeee9] truncate">{g.title}</p>
                          <p className="text-[9px] text-[#8a6860] truncate">{g.description || 'Quà tặng'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFreegift(g.id)}
                          className="text-red-400 hover:text-red-200 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-form to add a freegift */}
                <div className="p-3 rounded-lg bg-[#24130d] border border-[#43231a] space-y-2">
                  <span className="text-[11px] font-medium text-[#deb8ae] block">
                    Thêm quà tặng mới vào project này:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={giftTitle}
                      onChange={(e) => setGiftTitle(e.target.value)}
                      placeholder="Tên quà tặng (ví dụ: Photocard Hologram)"
                      className="px-2.5 py-1.5 rounded bg-[#180c07] border border-[#43231a] text-xs text-[#fbeee9]"
                    />
                    <input
                      type="text"
                      value={giftDesc}
                      onChange={(e) => setGiftDesc(e.target.value)}
                      placeholder="Mô tả ngắn (ví dụ: Bản scan độc quyền)"
                      className="px-2.5 py-1.5 rounded bg-[#180c07] border border-[#43231a] text-xs text-[#fbeee9]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={giftUrl}
                      onChange={(e) => setGiftUrl(e.target.value)}
                      placeholder="URL hình ảnh món quà..."
                      className="flex-1 px-2.5 py-1.5 rounded bg-[#180c07] border border-[#43231a] text-xs text-[#fbeee9]"
                    />
                    <label className="px-2.5 py-1.5 rounded bg-[#2b1711] text-xs text-[#deb8ae] flex items-center gap-1 cursor-pointer border border-[#43231a]">
                      <Upload className="w-3 h-3" />
                      <span>Tải ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFreegiftFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFreegift}
                      className="px-3 py-1.5 rounded bg-[#d9777f] hover:bg-[#b35760] text-white text-xs font-medium cursor-pointer"
                    >
                      + Thêm Quà
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#3b1f17]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[#43231a] text-xs text-[#deb8ae] hover:bg-white/5 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 text-white text-xs font-semibold tracking-wider transition shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang lưu...' : editingProjectId ? 'LƯU THAY ĐỔI' : 'TẠO PROJECT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
