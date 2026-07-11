import site from "../data/site.json";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-10 text-sm text-neutral-500">
        <p>© DYHY</p>
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label="DYHY 인스타그램"
          className="transition-opacity hover:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
