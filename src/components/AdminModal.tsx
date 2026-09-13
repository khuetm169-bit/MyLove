import React, { useState } from 'react';
import { Lock, KeyRound, User, X, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { verifyAdminPassword } from '../utils/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLoginSuccess,
  onLogout,
}) => {
  const [username, setUsername] = useState('Bundau');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Vui lòng nhập tên tài khoản admin.');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu quản trị viên.');
      return;
    }
    setIsLoading(true);
    setError('');

    const success = await verifyAdminPassword(password, username.trim());
    setIsLoading(false);

    if (success) {
      onLoginSuccess();
      setPassword('');
      onClose();
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại (User: Bundau / Pass: Mue1609).');
    }
  };

  const handleQuickFill = () => {
    setUsername('Bundau');
    setPassword('Mue1609');
    setError('');
  };

  return (
    <div
      id="admin-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="admin-modal-card"
        className="relative w-full max-w-md bg-[#24140e] border border-[#d9777f]/30 rounded-2xl p-6 md:p-8 text-[#f7e7e2] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-admin-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#c29d93] hover:text-white rounded-full hover:bg-white/5 transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#d9777f]/20 border border-[#d9777f]/40 flex items-center justify-center text-[#f4c2c2]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-[#fbeee9] font-bold">
              {isAdmin ? 'Quản Trị Viên (Admin)' : 'Đăng Nhập Quản Trị'}
            </h3>
            <p className="text-xs text-[#bda099]">
              {isAdmin ? 'Bạn đang ở chế độ chỉnh sửa toàn quyền' : 'Đăng nhập để chèn ảnh bìa, quản lý Messbook, Project và Ý kiến'}
            </p>
          </div>
        </div>

        {isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#2e1a13] border border-[#4a2a1f] flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-sm text-[#ecd5d8]">
                <p className="font-semibold text-emerald-300">Đã đăng nhập quyền Admin (Bundau)</p>
                <p className="text-xs text-[#bda099] mt-1 leading-relaxed">
                  Bạn có toàn quyền: Tự chèn & thay đổi ảnh bìa, thêm/xóa trang scan Messbook, xóa bình luận, chỉnh sửa Project và phản hồi/xóa Ý kiến.
                </p>
              </div>
            </div>

            <button
              id="btn-logout-admin"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-900/30 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-sm font-medium transition cursor-pointer"
            >
              Thoát Quyền Quản Trị (Trở về Chế độ Khách)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#deb8ae]">
                Tài Khoản Admin (User)
              </label>
              <div className="relative">
                <input
                  id="admin-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập User: Bundau"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#1a0e0a] border border-[#522b20] text-[#fbeee9] placeholder-[#805f57] focus:outline-none focus:border-[#d9777f] text-sm"
                  autoFocus
                />
                <User className="w-4 h-4 text-[#a37970] absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#deb8ae]">
                Mật Khẩu Admin (Pass)
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập Pass: Mue1609"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#1a0e0a] border border-[#522b20] text-[#fbeee9] placeholder-[#805f57] focus:outline-none focus:border-[#d9777f] text-sm"
                />
                <KeyRound className="w-4 h-4 text-[#a37970] absolute left-3.5 top-3" />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Quick Fill Note */}
            <div className="p-3 rounded-lg bg-[#1f110c] border border-[#43231a] flex items-center justify-between text-xs text-[#bda099]">
              <div>
                <span>Tài khoản Admin: </span>
                <code className="text-[#f4c2c2] bg-[#331b14] px-1.5 py-0.5 rounded font-mono">User: Bundau</code>
                <span className="mx-1">•</span>
                <code className="text-[#f4c2c2] bg-[#331b14] px-1.5 py-0.5 rounded font-mono">Pass: Mue1609</code>
              </div>
              <button
                type="button"
                id="btn-quick-fill-pass"
                onClick={handleQuickFill}
                className="text-[#e2b18a] hover:text-[#f4c2c2] underline cursor-pointer flex items-center gap-1 shrink-0 ml-2"
              >
                <Sparkles className="w-3 h-3" />
                Điền nhanh
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                id="btn-cancel-admin"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#522b20] text-[#deb8ae] hover:text-white hover:bg-white/5 text-sm transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                id="btn-submit-admin"
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d9777f] to-[#b35760] hover:brightness-110 text-white text-sm font-medium transition shadow-lg shadow-[#d9777f]/20 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
