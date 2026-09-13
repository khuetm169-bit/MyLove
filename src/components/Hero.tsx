import React, { useState } from 'react';
import { BookOpen, FolderHeart, MessageSquareHeart, Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import bannerImage from '../assets/images/my_love_banner_1789312277358.jpg';
import { CoverEditModal } from './CoverEditModal';

interface HeroProps {
  coverImage?: string;
  isAdmin: boolean;
  onUpdateCover: (coverData: { coverImage: string }) => Promise<void>;
  onNavigateToMessbook: () => void;
  onNavigateToProject: () => void;
  onNavigateToFeedback: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  coverImage,
  isAdmin,
  onUpdateCover,
  onNavigateToMessbook,
  onNavigateToProject,
  onNavigateToFeedback,
}) => {
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const activeBanner = coverImage && coverImage.trim() ? coverImage : bannerImage;

  return (
    <section id="hero-section" className="relative pt-8 pb-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-left">
        {/* Eyebrow matching screenshot */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#d9777f]" />
          <span className="text-[12px] sm:text-xs font-semibold tracking-[0.25em] text-[#d49b8a] uppercase">
            A LITTLE CORNER FOR US
          </span>
        </div>

        {/* Big Display Title matching screenshot: MY LOVE */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#f5dad8] leading-[0.95] mb-6">
          MY<br />
          <span className="text-[#ecd0d5]">LOVE</span>
        </h1>

        {/* Subtitle text matching screenshot */}
        <p className="text-[#c7a79f] text-base sm:text-lg max-w-xl font-light leading-relaxed mb-8">
          Một góc nhỏ để lưu lại những trang sách, những project và những lời nhắn đáng yêu.
        </p>

        {/* Action Button matching screenshot: MỞ MESSBOOK */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <button
            id="btn-hero-open-messbook"
            onClick={onNavigateToMessbook}
            className="px-6 py-3 border border-[#8a4e3f] hover:border-[#d9777f] hover:bg-[#d9777f]/10 text-[#fbeee9] text-xs sm:text-sm font-medium tracking-[0.2em] rounded-sm transition-all duration-300 cursor-pointer flex items-center gap-2 uppercase shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-[#d9777f]" />
            MỞ MESSBOOK
          </button>

          <button
            id="btn-hero-open-project"
            onClick={onNavigateToProject}
            className="px-5 py-3 border border-[#4a281e] hover:border-[#8a4e3f] bg-[#22120b]/50 text-[#deb8ae] text-xs sm:text-sm font-medium tracking-[0.15em] rounded-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <FolderHeart className="w-4 h-4 text-[#deb8ae]" />
            XEM PROJECT
          </button>

          <button
            id="btn-hero-open-feedback"
            onClick={onNavigateToFeedback}
            className="px-5 py-3 border border-[#4a281e] hover:border-[#8a4e3f] bg-[#22120b]/50 text-[#deb8ae] text-xs sm:text-sm font-medium tracking-[0.15em] rounded-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <MessageSquareHeart className="w-4 h-4 text-[#deb8ae]" />
            GỬI Ý KIẾN
          </button>
        </div>

        {/* Visual banner matching the screenshot's cute pastel pink card */}
        <div
          id="hero-banner-card"
          className="relative rounded-2xl overflow-hidden border border-[#522b20]/60 shadow-2xl shadow-black/60 group bg-[#23120b]"
        >
          <img
            src={activeBanner}
            alt="My Love Banner"
            className="w-full h-auto max-h-[420px] object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c0f0a]/70 via-transparent to-transparent pointer-events-none" />

          {/* Admin Change Cover Button */}
          {isAdmin && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                id="btn-edit-cover-hero"
                onClick={() => setIsCoverModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-black/70 hover:bg-[#d9777f] text-[#fbeee9] border border-[#d9777f]/50 hover:border-[#d9777f] text-xs font-medium backdrop-blur-md transition shadow-xl flex items-center gap-2 cursor-pointer group/btn"
              >
                <Camera className="w-4 h-4 text-[#f4c2c2] group-hover/btn:text-white" />
                <span>Tự chèn / Đổi ảnh bìa</span>
              </button>
            </div>
          )}

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#deb8ae]/90 font-light">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d9777f] animate-ping" />
              Góc lưu niệm & lời chúc
            </span>
            <span className="font-serif italic">#MyLoveWithYou</span>
          </div>
        </div>
      </div>

      {/* Cover Edit Modal for Admin */}
      <CoverEditModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        currentCoverImage={coverImage}
        defaultBannerImage={bannerImage}
        onSave={onUpdateCover}
      />
    </section>
  );
};
