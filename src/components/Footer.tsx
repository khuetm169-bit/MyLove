import React from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface FooterProps {
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isAdmin, onOpenAdmin }) => {
  return (
    <footer id="main-footer" className="mt-20 border-t border-[#3b1f17] bg-[#160b07] py-12 px-4 sm:px-6 text-center text-xs text-[#a6867d]">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="font-serif text-xl tracking-[0.25em] text-[#ecd0d5] uppercase font-bold">
            MY LOVE
          </span>
          <Heart className="w-4 h-4 text-[#d9777f] fill-[#d9777f]/40" />
        </div>

        <p className="text-[12px] text-[#8a6860] max-w-md mx-auto leading-relaxed">
          Nơi lưu giữ từng trang Messbook viết tay, các project kỷ niệm đong đầy cảm xúc và những lời nhắn gửi chân thành.
        </p>

        <div className="flex items-center justify-center gap-6 text-[11px] pt-2">
          <a href="#messbook" className="hover:text-[#f4c2c2] transition">MESSBOOK</a>
          <span className="text-[#43231a]">•</span>
          <a href="#project" className="hover:text-[#f4c2c2] transition">PROJECT</a>
          <span className="text-[#43231a]">•</span>
          <a href="#feedback" className="hover:text-[#f4c2c2] transition">Ý KIẾN</a>
          <span className="text-[#43231a]">•</span>
          <button
            onClick={onOpenAdmin}
            className="text-[#deb8ae] hover:text-[#f4c2c2] underline cursor-pointer"
          >
            {isAdmin ? 'Quản Trị Viên (Đang Bật)' : 'Đăng Nhập Admin'}
          </button>
        </div>

        <div className="pt-6 border-t border-[#2a140d] text-[11px] text-[#6d4d45] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} My Love. All rights reserved.</span>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Mode Active
              </span>
            )}
            <span className="italic font-serif">Made with love & dedication</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
