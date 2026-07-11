import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/works", label: "Works" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-40 text-white"
          : "sticky top-0 z-40 border-b border-neutral-100 bg-white/90 text-neutral-800 backdrop-blur"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" aria-label="DYHY 홈" className="text-lg">
          <Logo />
        </Link>

        {/* 데스크톱 텍스트 네비 */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `tracking-wide transition-opacity hover:opacity-60 ${
                  isActive ? "underline underline-offset-8" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* 모바일 햄버거 */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="메뉴 열기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 모바일 풀스크린 오버레이 메뉴 */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white text-neutral-800">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="text-lg">
              <Logo />
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="메뉴 닫기">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-10 text-2xl">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="tracking-widest"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
