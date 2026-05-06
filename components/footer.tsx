import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-32 border-t border-primary/20 backdrop-blur-sm bg-card/30 py-10">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="mb-4">
          <p className="text-primary font-black text-2xl drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            SPORT MEET - ITUM
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-px bg-linear-to-r from-transparent to-primary/50"></div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Inter-House Championship</p>
          <div className="w-12 h-px bg-linear-to-l from-transparent to-primary/50"></div>
        </div>
        <p className="text-xs text-muted-foreground">
          Celebrating athletic excellence, house pride, and the pursuit of glory
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#"
            className="rounded-full border border-primary/30 bg-card/60 px-4 py-2 text-xs font-semibold text-primary/90 transition-all duration-300 hover:border-primary hover:text-primary"
          >
            <span className='text-neutral-500'>Developed by</span>
            <span className="blink-dot">•</span>
            <span>Srinath</span>
          </Link>
          <Link
            href="#"
            className="rounded-full border border-primary/30 bg-card/60 px-4 py-2 text-xs font-semibold text-primary/90 transition-all duration-300 hover:border-primary hover:text-primary"
          >
            <span className='text-neutral-500'>Developed by</span>
            <span className="blink-dot">•</span>
            <span>Dhanushka</span>
          </Link>
          <Link
            href="#"
            className="rounded-full border border-primary/30 bg-card/60 px-4 py-2 text-xs font-semibold text-primary/90 transition-all duration-300 hover:border-primary hover:text-primary"
          >
            <span className='text-neutral-500'>Designed by</span>
            <span className="blink-dot">•</span>
            <span>Thisara</span>
          </Link>
        </div>

        {/* Facebook Icon Section */}
        <div className="mt-8 flex justify-center">
          <Link
            href="https://www.facebook.com/profile.php?id=61576624917667"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
            aria-label="Visit our Official Facebook Page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Link>
        </div>

      </div>
    </footer>
  )
}