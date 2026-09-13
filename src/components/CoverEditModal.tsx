import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Link,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Eye,
  AlertCircle
} from 'lucide-react';

interface CoverEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoverImage?: string;
  defaultBannerImage: string;
  onSave: (coverData: { coverImage: string }) => Promise<void>;
}

export const CoverEditModal: React.FC<CoverEditModalProps> = ({
  isOpen,
  onClose,
  currentCoverImage,
  defaultBannerImage,
  onSave,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    currentCoverImage || defaultBannerImage
  );
  const [inputUrl, setInputUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP).');
      return;
    }

    // Limit file size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh quá lớn (vui lòng chọn ảnh dưới 15MB).');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) {
      setErrorMessage('Vui lòng nhập đường dẫn URL ảnh.');
      return;
    }
    setSelectedImage(inputUrl.trim());
    setErrorMessage('');
  };

  const handleRestoreDefault = () => {
    setSelectedImage(defaultBannerImage);
    setInputUrl('');
    setErrorMessage('');
  };

  const handleSave = async () => {
    if (!selectedImage) {
      setErrorMessage('Vui lòng chọn hoặc tải ảnh bìa lên.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      // If user selected default, we can save empty string or default image
      const imageToSave = selectedImage === defaultBannerImage ? '' : selectedImage;
      await onSave({ coverImage: imageToSave });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi lưu ảnh bìa.');
    } finally {
      setIsSaving(false);
    }
  };

  const sampleCovers = [
    {
      name: 'Mặc định (Pastel My Love)',
      url: defaultBannerImage,
    },
    {
      name: 'Hoa ép & Sách cổ điển',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Bầu trời hoàng hôn ấm áp',
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Ánh nến & Không gian tĩnh lặng',
      url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <div
      id="cover-edit-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="cover-edit-modal-card"
        className="relative w-full max-w-2xl bg-[#24130d] border border-[#d9777f]/40 rounded-2xl p-6 md:p-8 text-[#f7e7e2] shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-cover-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#c29d93] hover:text-white rounded-full hover:bg-white/5 transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3d2017]">
          <div className="w-10 h-10 rounded-full bg-[#d9777f]/20 border border-[#d9777f]/40 flex items-center justify-center text-[#f4c2c2]">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-[#fbeee9] font-bold flex items-center gap-2">
              Tự Chèn & Đổi Ảnh Bìa (Admin)
              <span className="text-[11px] font-sans font-normal px-2 py-0.5 rounded bg-[#d9777f]/20 text-[#f4c2c2] border border-[#d9777f]/30">
                Quyền Quản Trị
              </span>
            </h3>
            <p className="text-xs text-[#bda099] mt-0.5">
              Admin có thể tự tải ảnh bìa lên từ máy hoặc dán link ảnh tùy thích cho website.
            </p>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#deb8ae]">
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-3.5 h-3.5 text-[#d9777f]" />
              Xem trước ảnh bìa (Live Preview):
            </span>
            <button
              type="button"
              onClick={handleRestoreDefault}
              className="text-[#e2b18a] hover:text-[#f4c2c2] flex items-center gap-1 text-[11px] transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Khôi phục ảnh gốc
            </button>
          </div>

          <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-[#522b20] bg-[#140905] shadow-inner group">
            <img
              src={selectedImage}
              alt="Cover Preview"
              className="w-full h-full object-cover object-center"
              onError={() => {
                setErrorMessage('Không thể tải trước hình ảnh. Vui lòng kiểm tra lại file hoặc đường link URL.');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 text-xs text-white/90 font-serif italic">
              Ảnh bìa sẽ hiển thị tại trang chủ
            </div>
          </div>
        </div>

        {/* Tab Selection: Upload vs URL */}
        <div className="mb-4">
          <div className="flex border-b border-[#3d2017] mb-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                setErrorMessage('');
              }}
              className={`pb-2 px-4 text-xs font-medium border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-[#d9777f] text-[#f4c2c2]'
                  : 'border-transparent text-[#a6867d] hover:text-[#fbeee9]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Tải ảnh từ máy tính / điện thoại
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('url');
                setErrorMessage('');
              }}
              className={`pb-2 px-4 text-xs font-medium border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'url'
                  ? 'border-[#d9777f] text-[#f4c2c2]'
                  : 'border-transparent text-[#a6867d] hover:text-[#fbeee9]'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              Dán liên kết URL ảnh
            </button>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="cover-file-input"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#522b20] hover:border-[#d9777f] bg-[#1a0e0a] rounded-xl p-6 text-center cursor-pointer transition hover:bg-[#20110c]"
              >
                <Upload className="w-8 h-8 text-[#d9777f] mx-auto mb-2 opacity-80" />
                <p className="text-xs text-[#fbeee9] font-medium mb-1">
                  Bấm để chọn file ảnh bìa từ thiết bị của bạn
                </p>
                <p className="text-[11px] text-[#8a6860]">
                  Hỗ trợ JPG, PNG, WebP (Tối đa 15MB)
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/anh-bia-my-love.jpg"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-[#1a0e0a] border border-[#522b20] text-xs text-[#fbeee9] placeholder-[#805f57] focus:outline-none focus:border-[#d9777f]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl bg-[#351912] hover:bg-[#4d251a] border border-[#6b3527] text-xs text-[#f4c2c2] font-medium transition cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
              <p className="text-[11px] text-[#8a6860]">
                Nhập link ảnh từ các nguồn như Unsplash, Imgur, Cloudinary hoặc host ảnh bất kỳ.
              </p>
            </div>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div className="mb-6 pt-3 border-t border-[#3d2017]">
          <span className="text-[11px] text-[#bda099] block mb-2 font-medium">
            Hoặc chọn nhanh ảnh mẫu gợi ý:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sampleCovers.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedImage(preset.url);
                  setErrorMessage('');
                }}
                className={`p-1.5 rounded-lg border text-left text-[10px] transition cursor-pointer flex flex-col gap-1 ${
                  selectedImage === preset.url
                    ? 'border-[#d9777f] bg-[#3a1d15] text-[#f4c2c2]'
                    : 'border-[#43231a] bg-[#1a0e0a] text-[#a6867d] hover:text-[#fbeee9]'
                }`}
              >
                <div className="w-full h-12 rounded overflow-hidden bg-black/40">
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="truncate">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3d2017]">
          <button
            type="button"
            id="btn-cancel-cover-edit"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#522b20] text-xs text-[#deb8ae] hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            id="btn-save-cover-image"
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 text-xs text-white font-medium transition shadow-lg shadow-[#d9777f]/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Đang lưu ảnh bìa...' : 'LƯU ẢNH BÌA'}
          </button>
        </div>
      </div>
    </div>
  );
};
