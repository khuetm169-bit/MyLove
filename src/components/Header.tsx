import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, Menu, X, Heart } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  onOpenAdminModal,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'messbook', label: 'MESSBOOK' },
    { id: 'project', label: 'PROJECT' },
    { id: 'feedback', label: 'Ý KIẾN' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-[#1c0f0a]/90 backdrop-blur-md border-b border-[#3b1f17]/80 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Logo Section matching screenshot */}
        <button
          id="header-brand-logo"
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-1.5">
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.28em] text-[#eed0c6] group-hover:text-[#f7b2bd] transition-colors uppercase">
              MY LOVE
            </h1>
            <Heart className="w-3.5 h-3.5 text-[#d9777f] fill-[#d9777f]/40 opacity-70 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-[11px] sm:text-xs text-[#a6867d] tracking-[0.18em] font-light mt-0.5">
            A little space for T1
          </p>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.2em] text-[#deb8ae]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#fbeee9] font-semibold'
                    : 'text-[#a6867d] hover:text-[#f4c2c2]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d9777f] rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Button & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            id="btn-admin-trigger"
            onClick={onOpenAdminModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              isAdmin
                ? 'bg-[#d9777f]/20 text-[#f4c2c2] border border-[#d9777f]/50 shadow-sm shadow-[#d9777f]/20'
                : 'bg-[#291711] text-[#bda099] border border-[#4a281e] hover:text-[#fbeee9] hover:border-[#6a392b]'
            }`}
            title={isAdmin ? 'Bạn đang là Quản trị viên' : 'Đăng nhập Quản trị viên'}
          >
            {isAdmin ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-[#f4c2c2]" />
                <span className="hidden sm:inline">Admin</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#deb8ae] hover:text-white rounded-lg hover:bg-white/5 transition"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden border-t border-[#3b1f17] bg-[#1c0f0a] px-4 py-4 space-y-2 animate-fadeIn"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs tracking-[0.2em] transition ${
                activeSection === item.id
                  ? 'bg-[#2c1711] text-[#fbeee9] font-bold border-l-2 border-[#d9777f]'
                  : 'text-[#a6867d] hover:bg-white/5 hover:text-[#fbeee9]'
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <div className="pt-2 border-t border-[#3b1f17] flex items-center justify-between text-xs text-emerald-400 px-3">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Đang bật chế độ Admin
              </span>
              <button
                onClick={onOpenAdminModal}
                className="text-[#f4c2c2] underline cursor-pointer"
              >
                Cài đặt
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
